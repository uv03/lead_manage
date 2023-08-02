import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Userlogin = () => {
  const navigate = useNavigate();
  let [user, setUser] = useState({
    email: "",
    password: "",
  });

  let [userError, setUserError] = useState({
    emailError: "",
    passwordError: "",
  });

  useEffect(() => {
    if (localStorage.getItem("leadmanager")) {
      navigate("/");
    }
  }, []);

  let validateEmail = (event) => {
    setUser({ ...user, email: event.target.value });
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value)
      ? setUserError({ ...userError, emailError: "Enter a proper Email" })
      : setUserError({ ...userError, emailError: "" });
  };

  let validatePassword = (event) => {
    setUser({ ...user, password: event.target.value });
    if (event.target.value.trim() == "")
      setUserError({ ...userError, passwordError: "Enter a proper Password" });
    else setUserError({ ...userError, passwordError: "" });
  };
  let dashboard = async () => {
    let { data } = await axios.get("https://leadmanager.onrender.com/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
      },
    });
    if (data.user.role == "admin" || data.user.role == "Admin")
      navigate("/dashboard/admin");
    else navigate("/dashboard/user");
  };
  let submitLogin = async (event) => {
    event.preventDefault();
    if (user.email !== "" && user.password !== "") {
      let email = user.email;
      let password = user.password;
      const { status, data } = await axios.post(
        "https://leadmanager.onrender.com/api/users/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (status == 201) {
        Swal.fire("Invalid credentials", "", "error");
      } else if (status == 200) {
        Swal.fire("Login successful", "", "success");
        localStorage.setItem("leadmanager", data.token);
        dashboard();
      }
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
    }
  };
  return (
    <React.Fragment>
      <div className="main">
        <section className="pt-2 d-flex justify-content-center">
          <div className="container  homebg">
            <div className="row animated zoomIn">
              <div className="col">
                <p className="h3 text-primary">
                  <i className="fa fa-sign-in-alt" /> Login
                </p>
                <p>Login into Lead-Manager</p>
              </div>
            </div>
            <div className="row pt-2">
              <div className="col-md-8 animated zoomIn">
                <form onSubmit={submitLogin}>
                  <div className="form-group">
                    <input
                      name="email"
                      required
                      value={user.email}
                      onChange={validateEmail}
                      type="email"
                      className={`form-control mb-3  ${
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
                      name="password"
                      required
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
                    to="/users/register"
                    className="font-weight-bold text-primary"
                  >
                    {" "}
                    Register
                  </Link>
                </small>
                <div>
                  <small>
                    Forgot password
                    <Link
                      to="/users/reset"
                      className="font-weight-bold text-primary"
                    >
                      {" "}
                      Reset
                    </Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default Userlogin;
