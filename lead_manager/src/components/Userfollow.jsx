import React, {useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Userfollow = () => {
    const navigate=useNavigate()
    const [follows, setfollows] = useState([]);
    const [load, setLoad] = useState(true);
    const [issearch,setIssearch]=useState(false);
    const [searchselcted,setsearchselected]=useState("select attribute");
    const [searchval,setsearchval]=useState("");
    const [isclicked,setIsclicked]=useState(false);
    const [cardv,setCardv]=useState([])
    const getfollow = async () => {
        let id = localStorage.getItem("leadid");
      let { data } = await axios.get(`https://leadmanager.onrender.com/api/lead/followup/${id}`,{headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
      },});
      // console.log(data);
      setfollows(data.follow);
      
      setLoad(false);
    };
  
    useEffect(() => {
      getfollow();
    }, []);
    const handlesearch =(e) =>{
      getfollow();
  
      setIssearch(true);
      // console.log(e.target.className.split(" ")[1]);
      if(e.target.className.split(" ")[1]=="0") setsearchselected("name");
      if(e.target.className.split(" ")[1]=="1") setsearchselected("date");
      if(e.target.className.split(" ")[1]=="2") setsearchselected("status");    
    }
    const handlevalue =(e) =>{
  
      setsearchval(e.target.value) 

    }
    const searching =()=>{
      if(searchselcted=="name"){
        const filteredArray = follows.filter((item) =>
        item.lead_id.name.toLowerCase().includes(searchval.toLowerCase())
      );
      setfollows(filteredArray)
      // console.log(follows)
      }
      if(searchselcted=="date"){
        const filteredArray = follows.filter((item) =>
        item.due_date.toLowerCase().includes(searchval.toLowerCase())
      );
      setfollows(filteredArray)
      // console.log(follows)
      }
      if(searchselcted=="status"){
        const filteredArray = follows.filter((item) =>
        item.status.toLowerCase().includes(searchval.toLowerCase())
      );
      setfollows(filteredArray)
      // console.log(follows)
      }
    }
  
  
  
    const handleclick = (name,date,status,description,email) =>{
      setIsclicked(true);
      let cardval={};
      cardval.Name=name;
      cardval.Date=date;
      cardval.Description=description;
      cardval.Status=status;
      cardval.email=email;
      const today = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const currentDate = today.toLocaleDateString('en-GB', options);
      if(status.toLowerCase()=="pending"){
      // console.log(date.split("-")[0],currentDate.split("/")[2]);
      // console.log(date.split("-")[1],currentDate.split("/")[1]);
      // console.log(parseInt(date.split("-")[2]),parseInt(currentDate.split("/")[0]));

        if(date.split("-")[0]==currentDate.split("/")[2] && date.split("-")[1]==currentDate.split("/")[1] && parseInt(date.split("-")[2])-parseInt(currentDate.split("/")[0])<7){
            cardval.notify=true;
        }
        else{
          cardval.notify=false;
        }
        cardval.notify=true;
      }
      // console.log(cardval.notify);
      setCardv(cardval)
    }
  const notify=async(email)=>{
    alert("wait for confirmation")
    let { status,data } = await axios.post(`https://leadmanager.onrender.com/api/lead/followup/notify/${email}`,{name:cardv.Name,date:cardv.Date,description:cardv.Description},{headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
    },});
    if (status == 201) {
      Swal.fire("Invalid credentials", `${data.msg}`, "error");
    } else if (status == 200) {
      Swal.fire("Notification Sent", "", "success");
    }
  }
    
    return (
      <div className="main pt-2">
        {load && <h3 className="container d-flex justify-content-center">Loading...</h3>}
      {!load && follows.length > 0 && <div className="container p-3 homebg rounded-1">
          <div className="upper row d-flex justify-content-between  pe-3 pb-2">
          <div className="dropdown searchs d-flex col-lg-9 col-md-11 col-sm-12">
            <div className="border rounded d-flex justify-content-centerme-1 col-lg-4 col-md-5 col-sm-6 me-2">
            <span className="pt-2 me-2 ms-3">search by:</span>
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
                  Name
                </a>
              </li>
              <li>
                <a className="dropdown-item 1" onClick={handlesearch}>
                  Date
                </a>
              </li>
              <li>
                <a className="dropdown-item 2" onClick={handlesearch}>
                  Status
                </a>
              </li>
            </ul>
            </div>
            {issearch && (
              <div className="search_val border rounded-1 d-flex justify-content-around col-lg-6 col-md-7 col-sm-9">
                <span className="pt-2 mt-1">value : </span>
                <input
                  className="mt-2 mb-2 rounded-1"
                  type="string"
                  value={searchval}
                  onChange={handlevalue}
                  placeholder="Enter value"
                />
                <input
                  type="submit"
                  className="btn btn-teal btn-sm m-2"
                  onClick={searching}
                />
              </div>
            )}
          </div>
          </div>

          {follows.length > 0 && (
            <div className="d-flex justify-content-evenly row bg-simple p-2">
              <div className={`table-responsive ${isclicked ?"col-lg-8 col-md-7 col-sm-6":""}`}>
              <table className="table table-hover border">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {follows.length > 0 &&
                    follows.map((follow) => {
                      return (
                        <tr key={follow._id}>
                          <th scope="row">{follow.lead_id.name}</th>
                          <td>{follow.due_date.split("T")[0]}</td>
                          <td>{follow.status}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleclick(
                                  follow.lead_id.name,
                                  follow.due_date,
                                  follow.status,
                                  follow.description,
                                  follow.lead_id.email
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              </div>
              {isclicked && (
                <div className="card ms-2 col-lg-3 col-md-4 col-sm-5">
                  <div className="card-header"><b>Name: </b>{cardv.Name}</div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><b>Date: </b>{cardv.Date}</li>
                    <li className="list-group-item"><b>Description: </b>{cardv.Description}</li>
                    <li className="list-group-item"><b>Status: </b>{cardv.Status}</li>
                   {cardv.notify &&  <li className="list-group-item d-flex justify-content-center"><a  className="btn btn-primary" onClick={()=>notify(cardv.email)}>Notify</a></li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>}
        {!load && follows.length<=0 && <div className="container homebg p-2 mt-2">
        <h3 className="container d-flex justify-content-center">No Communication History for this lead</h3></div>}
    </div>
  );
}

export default Userfollow