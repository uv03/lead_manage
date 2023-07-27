import React, {useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Userdashboard = () => {
  const navigate=useNavigate()
  const [leads, setLeads] = useState([]);
  const [load, setLoad] = useState(true);
  const [issearch,setIssearch]=useState(false);
  const [searchselcted,setsearchselected]=useState("select attribute");
  const [searchval,setsearchval]=useState("");
  const getlead = async () => {
    let { data } = await axios.get("http://127.0.0.1:5000/api/lead",{headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
    },});
    // console.log(data);
    setLeads(data.lead);
    
    setLoad(false);
  };

  useEffect(() => {
    getlead();
  }, []);
  const handlesearch =(e) =>{
    getlead();

    setIssearch(true);
    console.log(e.target.className.split(" ")[1]);
    if(e.target.className.split(" ")[1]=="0") setsearchselected("id");
    if(e.target.className.split(" ")[1]=="1") setsearchselected("name");
    if(e.target.className.split(" ")[1]=="2") setsearchselected("email");
    if(e.target.className.split(" ")[1]=="3") setsearchselected("phone");
    if(e.target.className.split(" ")[1]=="4") setsearchselected("source");


    
  }
  const handlevalue =(e) =>{

    setsearchval(e.target.value)


    
  }
  const searching =()=>{
    if(searchselcted=="id"){
      const filteredArray = leads.filter((item) =>
      item.id==searchval
    );
    setLeads(filteredArray)
    console.log(leads)
    }
    if(searchselcted=="name"){
      const filteredArray = leads.filter((item) =>
      item.name.toLowerCase().includes(searchval.toLowerCase())
    );
    setLeads(filteredArray)
    console.log(leads)
    }
    if(searchselcted=="email"){
      const filteredArray = leads.filter((item) =>
      item.email.toLowerCase().includes(searchval.toLowerCase())
    );
    setLeads(filteredArray)
    console.log(leads)
    }
    if(searchselcted=="source"){
      const filteredArray = leads.filter((item) =>
      item.source.toLowerCase().includes(searchval.toLowerCase())
    );
    setLeads(filteredArray)
    console.log(leads)
    }
    if(searchselcted=="phone"){
      const filteredArray = leads.filter((item) =>
      item.phone.toLowerCase().includes(searchval.toLowerCase())
    );
    setLeads(filteredArray)
    console.log(leads)
    }
  }



  const gotocomm = (id) =>{
    console.log(id)
    localStorage.setItem("leadid", id);
    navigate("/lead/user/comm");
  }
  const gotofollow = (id) =>{
    console.log(id)
    localStorage.setItem("leadid", id);
    navigate("/lead/user/follow");
  }


  return (
    <div className="main pt-2">
      {load == true ? (
         <h3 className="container d-flex justify-content-center">Loading...</h3>
      ) : (
        <div className="container p-3 homebg rounded-1">
          <div className="upper row d-flex justify-content-between pe-3 pb-2">
          <div className="dropdown searchs col-lg-8 col-md-11 col-sm-12 d-flex">
            <div className="border rounded me-1  d-flex justify-content-center">
            <span className="pt-2 me-2">search by:</span>
            <button
              className="btn dropdown-toggle border m-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {searchselcted}
            </button>
            <ul className="dropdown-menu">
            <li>
                <a className="dropdown-item 0" onClick={handlesearch}>
                  ID
                </a>
              </li>
              <li>
                <a className="dropdown-item 1" onClick={handlesearch}>
                  Name
                </a>
              </li>
              <li>
                <a className="dropdown-item 2" onClick={handlesearch}>
                  Email
                </a>
              </li>
              <li>
                <a className="dropdown-item 3" onClick={handlesearch}>
                  Source
                </a>
              </li>
              <li>
                <a className="dropdown-item 4" onClick={handlesearch}>
                  Phone
                </a>
              </li>
            </ul>
            </div>
            {issearch && (
            <div className="search_val">
              <span>value : </span>
              <input type="string" value={searchval} onChange={handlevalue} placeholder="Enter value"/>
              <input
                    type="submit"
                    className="btn btn-teal btn-sm"
                    onClick={searching}
              />
            </div>

          )}
          </div>
          </div>
          
          {leads.length > 0 && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 &&
                  leads.map((lead) => {
                    return (
                      <tr key={lead.id}>
                        <th scope="row">{lead.id}</th>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.source}</td>
                        <td><button className="btn btn-primary me-1" onClick={()=>gotocomm(lead.id)}>comm</button><button className="btn btn-primary" onClick={()=>gotofollow(lead.id)}>Followup</button></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Userdashboard