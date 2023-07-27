import React, {useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";

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
      let { data } = await axios.get(`http://127.0.0.1:5000/api/lead/followup/${id}`,{headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
      },});
      console.log(data);
      setfollows(data.follow);
      
      setLoad(false);
    };
  
    useEffect(() => {
      getfollow();
    }, []);
    const handlesearch =(e) =>{
      getfollow();
  
      setIssearch(true);
      console.log(e.target.className.split(" ")[1]);
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
      console.log(follows)
      }
      if(searchselcted=="date"){
        const filteredArray = follows.filter((item) =>
        item.due_date.toLowerCase().includes(searchval.toLowerCase())
      );
      setfollows(filteredArray)
      console.log(follows)
      }
      if(searchselcted=="status"){
        const filteredArray = follows.filter((item) =>
        item.status.toLowerCase().includes(searchval.toLowerCase())
      );
      setfollows(filteredArray)
      console.log(follows)
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
        if(date.split("-")[0]==currentDate.split("/")[2] && date.split("-")[1]==currentDate.split("/")[1] && parseInt(date.split("-")[2])-parseInt(currentDate.split("/")[0])<7){
            cardval.notify=true;
        }
      }
      setCardv(cardval)
    }
  
    
    return (
      <>
        {load && <h3>Loading....</h3>}
      {!load && follows.length > 0 && <div className="container m-3">
          <div className="dropdown searchs">
            <span>search by:</span>
            <button
              className="btn dropdown-toggle"
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
            {issearch && (
              <div className="search_val">
                <span>value : </span>
                <input
                  type="string"
                  value={searchval}
                  onChange={handlevalue}
                  placeholder="Enter value"
                />
                <input
                  type="submit"
                  className="btn btn-teal btn-sm"
                  onClick={searching}
                />
              </div>
            )}
          </div>

          {follows.length > 0 && (
            <div className="d-flex justify-content-evenly">
              <table className="table table-hover">
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
              {isclicked && (
                <div className="card ms-2">
                  <div className="card-header"><b>Name: </b>{cardv.Name}</div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><b>Date: </b>{cardv.Date}</li>
                    <li className="list-group-item"><b>Description: </b>{cardv.Description}</li>
                    <li className="list-group-item"><b>Status: </b>{cardv.Status}</li>
                   {cardv.notify &&  <li className="list-group-item d-flex justify-content-center"><a  class="btn btn-primary">Notify</a></li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>}
        {!load && follows.length<=0 && <h3>No Communication History for this lead</h3>}
    </>
  );
}

export default Userfollow