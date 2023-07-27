import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

let Navbar = () => {
  let navigate = useNavigate();

  const [user, setUser] = useState({});

  const getUser = async () => {
    const { data } = await axios.get("http://127.0.0.1:5000/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
      },
    });
    setUser(data.user);
  };

  useEffect(() => {
    if (localStorage.getItem("leadmanager")) getUser();
  }, []);

  let clickLogOut = async () => {
    localStorage.removeItem("leadmanager");
    navigate("/users/login");
  };

  let beforeLogin = (
    <React.Fragment>
      <button className="btn btn-primary me-1" onClick={()=>{navigate("/users/login")}}>
        Login
      </button>
      <button className="btn btn-primary" onClick={()=>{navigate("/users/register")}}>
        Register
      </button>
    </React.Fragment>
  );
  const dashboard=()=>{
    if(user.role=="User"){navigate("/dashboard/user")}
    else{navigate("/dashboard/admin")}
  }
  let afterLogin = (
    <React.Fragment>
      <button className="btn btn-primary me-1" onClick={dashboard}>Dashboard</button>
      {/* <li className="nav-item">
        <Link to="/" className="nav-link">
          <img
            src={user.avatar}
            alt=""
            width="25"
            height="25"
            className="rounded-circle"
          />
          home
        </Link>
      </li> */}
      <button className="btn btn-danger" onClick={clickLogOut}>Logout</button>
    </React.Fragment>
  );

  return (
      <div>
       <nav className="navbar bg-primary">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">LEAD</a>
    <div>
    {localStorage.getItem("leadmanager") ? afterLogin : beforeLogin}

    </div>
  </div>
</nav>
      </div>
      
      
      
    // </React.Fragment>
  );
};
export default Navbar;

{/* <nav className="navbar navbar-dark bg-success navbar-expand-sm ">
        <div className="container d-flex justify-content-between">
         <div> <Link to="/" className="navbar-brand w-25">
            <i className="fa fa-code" /> LEAD
          </Link></div>
          
          <div className="navbar navbar-nav ml-auto w-75 d-flex justify-content-around" id="navbarSupportedContent">
          {localStorage.getItem("leadmanager") ? afterLogin : beforeLogin}
          </div>
        </div>
      </nav> */}
