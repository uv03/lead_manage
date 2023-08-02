import React, { useState } from "react";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Userregister = () => {
  let navigate = useNavigate();
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
  });
  let [userError, setUserError] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    phoneError: "",
    roleError: "",
  });
  
  let validateusername = (event) => {
    setUser({ ...user, name: event.target.value });
    let regExp = /^[a-zA-Z]/;
    !regExp.test(event.target.value)
      ? setUserError({ ...userError, nameError: "Enter a proper Username" })
      : setUserError({ ...userError, nameError: "" });
  };

  let validateEmail = (event) => {
    setUser({ ...user, email: event.target.value });
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value) || event.target.value.trim() === ""
      ? setUserError({ ...userError, emailError: "Enter a proper Email" })
      : setUserError({ ...userError, emailError: "" });
  };

  let validatePassword = (event) => {
    setUser({ ...user, password: event.target.value });
    if (event.target.value.trim() === "")
      setUserError({ ...userError, passwordError: "Enter a proper Password" });
    else setUserError({ ...userError, passwordError: "" });
  };
  // let validateRole = (event) => {
  //   setUser({ ...user, role: event.target.value });
  //   if (
  //     event.target.value.trim() == "User" ||
  //     (event.target.value.trim() == "Admin" / event.target.value.trim()) ==
  //       "user" ||
  //     event.target.value.trim() == "admin"
  //   )
  //     setUserError({ ...userError, roleError: "" });
  //   else
  //     setUserError({ ...userError, roleError: "Enter proper Role Admin/User" });
  // };
  let validatephone = (event) => {
    setUser({ ...user, phone: event.target.value });
    let regExp = /^[0-9]/;
    !regExp.test(event.target.value)
      ? setUserError({ ...userError, nameError: "Enter a proper Phone" })
      : setUserError({ ...userError, nameError: "" });
  };

  let submitRegistration = async (event) => {
    event.preventDefault();
    if (
      user.name.trim() !== "" &&
      user.email.trim() !== "" &&
      user.password.trim() !== "" &&
      user.role.trim() !== "" &&
      user.phone.trim() !== ""
    ) {
      let name = user.name.trim();
      let email = user.email.trim();
      let password = user.password.trim();
      let role = user.role.trim();
      let phone = Number(user.phone.trim());

      const { status } = await axios.post("https://leadmanager.onrender.com/api/users/register",
        { name, email, password, role, phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(status);
      if (status === 201) {
        Swal.fire("User already exists", "", "error");
        return;
      } else if (status === 200) {
        Swal.fire("Registration successful", "", "success");
        navigate("/users/login");
      }
      // console.log(user);
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
    }
  };

  return (
    <div className="main">
      <section className="pt-2 d-flex justify-content-center">
        <div className="container homebg ">
          <div className="row animated zoomIn">
            <div className="col">
              <p className="h3 text-primary">Register</p>
              <p>Register to Lead Manager</p>
            </div>
          </div>
        
          <div className="row pt-2">
            <div className="col-md-8 animated zoomIn">
              <form onSubmit={submitRegistration}>
                <div className="form-group">
                  <input
                    required
                    name="name"
                    value={user.name}
                    onChange={validateusername}
                    type="text"
                    className={`form-control mb-3 ${
                      userError.nameError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Name"
                  />
                  {userError.nameError.length > 0 ? (
                    <small className="text-danger">{userError.nameError}</small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="email"
                    value={user.email}
                    onChange={validateEmail}
                    type="email"
                    className={`form-control mb-3 ${
                      userError.emailError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                  />
                  {userError.emailError.length > 0 ? (
                    <small className="text-danger">
                      {userError.emailError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="password"
                    value={user.password}
                    onChange={validatePassword}
                    type="password"
                    className={`form-control mb-3 ${
                      userError.passwordError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                  />
                  {userError.passwordError.length > 0 ? (
                    <small className="text-danger">
                      {userError.passwordError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                {/* <div className="form-group">
                  <input
                    required
                    name="role"
                    value={user.role}
                    onChange={validateRole}
                    type="text"
                    className={`form-control mb-3 ${
                      userError.roleError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                  />
                  {userError.roleError.length > 0 ? (
                    <small className="text-danger">{userError.roleError}</small>
                  ) : (
                    ""
                  )}
                </div> */}
                <div className="form-group">
                  <input
                    required
                    name="phone"
                    value={user.phone}
                    onChange={validatephone}
                    type="text"
                    className={`form-control mb-3 ${
                      userError.phoneError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Phone"
                  />
                  {userError.roleError.length > 0 ? (
                    <small className="text-danger">{userError.roleError}</small>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <input
                    type="submit"
                    className="btn btn-success btn-sm"
                    value="Register"
                  />
                </div>
              </form>
              <small>
                Already have an account ?
                <Link to="/users/login" className="font-weight-bold text-primary">
                  {" "}
                  Login
                </Link>
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Userregister;
