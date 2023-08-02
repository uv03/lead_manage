import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Password = () => {
  const email=useParams().email;
  const Navigate=useNavigate();
  const [password,Setpassword]=useState("");
  const [confirmpassword,setconfirmpassword]=useState("");
  const [passwordError,setpassworderror]=useState("");
  const submitpassword =async(e)=>{
    e.preventDefault();
    let {status,user}=await axios.put("https://leadmanager.onrender.com/api/users/changepassword",{email,password});
    // console.log(user);
    if (status.status == 200) {
      Swal.fire("password reset successful", "", "success");
      Navigate("/users/login");
    }
    else {
    Swal.fire("Oh no!", "Something went wrong! Try again", "error");
  }
  }
  const validatePassword =(e)=>{
    Setpassword(e.target.value);
  }
  const validateconfirmpassword =(e)=>{
    setconfirmpassword(e.target.value);
    if(e.target.value!==password){
      setpassworderror("Password Does not Match");
    }
    else {setpassworderror("")}
  }

  return (
    <div className="main">
      <section className="pt-2 d-flex justify-content-center">
        <div className="container homebg">
          <div className="row animated zoomIn">
            <div className="col">
              <p className="h3 text-teal">
                 Password Reset
              </p>
              <p>Enter Your Password to Reset</p>
            </div>
          </div>
        
          <div className="row pt-2">
            <div className="col-md-8 animated zoomIn">
              <form onSubmit={submitpassword}>
                <div className="form-group">
                  <input
                    name="password"
                    required
                    value={password}
                    onChange={validatePassword}
                    type="password"
                    className={`form-control mb-3`}
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    name="confirmpassword"
                    required
                    value={confirmpassword}
                    onChange={validateconfirmpassword}
                    type="password"
                    className={`form-control mb-3 ${
                      passwordError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="ReEnter Password"
                  />
                  {passwordError.length > 0 ? (
                    <small className="text-danger">
                      {passwordError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <input
                    type="submit"
                    className="btn btn-teal btn-sm"
                    value="Login"
                  />
                </div>
              </form>
              <small>
                Don't have an account ?
                <Link
                  to="/users/login"
                  className="font-weight-bold text-primary"
                >
                  {" "}
                  Login
                </Link>
              </small>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Password