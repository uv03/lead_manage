import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { reg } from "../Apiroutes";
const Home = () => {
  // let navigate = useNavigate();
  // let clickLogOut = async () => {
  //   localStorage.removeItem("devroom");
  //   navigate("/users/login");
  // };

 return (
     <div className="main position-relative">
          <div className="homebg container d-flex  flex-column position-absolute top-50 start-50 translate-middle">
            <div className="d-flex justify-content-center m-2 "><h4>Let's Work with Leads</h4></div>
            <div className="d-flex justify-content-center">We here Help you to Save Leads,Communication Histories And Setup Follow up Schedules</div>
          </div>
         
     </div>
 );
};

export default Home;
