import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Admindashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [load, setLoad] = useState(true);
  const [issearch, setIssearch] = useState(false);
  const [searchselcted, setsearchselected] = useState("select attribute");
  const [searchval, setsearchval] = useState("");
  const [c,setc]=useState(false);
  const [comms, setComms] = useState([]);
  const [follows, setFollows] = useState([]);

  const getlead = async () => {
    let { data } = await axios.get("https://leadmanager.onrender.com/api/lead", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
      },
    });
    // console.log(data);
    setLeads(data.lead);

    setLoad(false);
  };

  useEffect(() => {
    getlead();
    if(c){
      deletecomms();
      deletefollow();
      setc(false);
    }
  },[c]);

  const handlesearch = (e) => {
    getlead();

    setIssearch(true);
    // console.log(e.target.className.split(" ")[1]);
    if (e.target.className.split(" ")[1] === "0") setsearchselected("Id");
    if (e.target.className.split(" ")[1] === "1") setsearchselected("Name");
    if (e.target.className.split(" ")[1] === "2") setsearchselected("Email");
    if (e.target.className.split(" ")[1] === "3") setsearchselected("Source");
    if (e.target.className.split(" ")[1] === "4") setsearchselected("Phone");
  };

  const handlevalue = (e) => {
    setsearchval(e.target.value);
  };

  const searching = () => {
    if (searchselcted === "Id") {
      const filteredArray = leads.filter((item) => item.id === searchval);
      setLeads(filteredArray);
      // console.log(leads);
    }
    if (searchselcted === "Name") {
      const filteredArray = leads.filter((item) =>
        item.name.toLowerCase().includes(searchval.toLowerCase())
      );
      setLeads(filteredArray);
      // console.log(leads);
    }
    if (searchselcted === "Email") {
      const filteredArray = leads.filter((item) =>
        item.email.toLowerCase().includes(searchval.toLowerCase())
      );
      setLeads(filteredArray);
      // console.log(leads);
    }
    if (searchselcted === "Source") {
      const filteredArray = leads.filter((item) =>
        item.source.toLowerCase().includes(searchval.toLowerCase())
      );
      setLeads(filteredArray);
      // console.log(leads);
    }
    if (searchselcted === "Phone") {
      const filteredArray = leads.filter((item) =>
        item.phone.toLowerCase().includes(searchval.toLowerCase())
      );
      setLeads(filteredArray);
      // console.log(leads);
    }
  };

  const gotocomm = (id) => {
    // console.log(id);
    localStorage.setItem("leadid", id);
    navigate(`/lead/admin/comm/${id}`);
  };

  const gotofollow = (id) => {
    // console.log(id);
    localStorage.setItem("leadid", id);
    navigate(`/lead/admin/follow/${id}`);
  };

  const addlead = () => {
    navigate("/lead/newlead");
  };

  const editlead = (id) => {
    navigate(`/lead/${id}`);
  };

  const deletelead = async (id,leadid) => {
    // console.log(id);
    let {data } = await axios.get(
      `https://leadmanager.onrender.com/api/lead/communication/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
        },
      }

    );
    
    setComms(data.comm);
     data  = await axios.get(`https://leadmanager.onrender.com/api/lead/followup/${id}`,{headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
      },});
      setFollows(data.data.follow);
    setc(true);
    data = await axios.delete(
      `https://leadmanager.onrender.com/api/lead/${leadid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
        },
      }
    );
    if (data.status == 200) {
      Swal.fire("Lead Deleted successful", "", "success");
    }
   else {
    Swal.fire("Oh no!Something's Wrong", `${data.msg}`, "error");}
  };

  const deletecomms = async()=>{
    if (comms.length > 0) {
      comms.map(async(comm)=>{
        let id=comm._id;
        let { data } = await axios.delete(
          `https://leadmanager.onrender.com/api/lead/communication/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
            },
          }
        );
        // console.log(data);
      })
    }
  }
  
  const deletefollow = async()=>{
    if (follows.length > 0) {
      follows.map(async(follow)=>{
        let id=follow._id;
        let { data } = await axios.delete(
          `https://leadmanager.onrender.com/api/lead/followup/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
            },
          }
        );
        // console.log(data);
      })
    }
  }
  
  return (
    <div className="main p-2">
      {load == true ? (
        <h3 className="container d-flex justify-content-center">Loading...</h3>
      ) : (
        <div className="container p-3 homebg rounded-1">
          <div className="upper row d-flex justify-content-between pe-3 pb-2">
            <div className="dropdown searchs col-lg-8 col-md-11 col-sm-12 d-flex">
              <div className="border rounded me-1  d-flex justify-content-center">
              <span className="pt-2 me-2">Search by:</span>
              <button
                className="btn dropdown-toggle border m-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {searchselcted}
              </button>
              <ul className="dropdown-menu ">
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
                <div className="search_val border rounded-1 col-lg-7 col-md-7 col-sm-8 d-flex justify-content-around">
                  <span className="search-sp pt-2">value : </span>
                  <input
                    className=" mt-2 mb-2 search-in rounded-1"
                    type="string"
                    value={searchval}
                    onChange={handlevalue}
                    placeholder="Enter value"
                  />
                  <input
                    type="submit"
                    className="search-btn btn btn-teal btn-sm m-1 "
                    onClick={searching}
                  />
                </div>
              )}
            </div>
            <div className="btn btn-primary col-lg-3 col-sm-5 ms-2" onClick={addlead}>
              <h5>+Create New Lead</h5>
            </div>
          </div>

          {leads.length > 0 && (
            <div className="table-responsive bg-simple p-1 rounded-1">
              <table className="table  border">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Source</th>
                  <th scope="col"></th>
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
                        <td>
                          <button
                            className="btn btn-primary me-1"
                            onClick={() => gotocomm(lead.id)}
                          >
                            comm
                          </button>
                          <button
                            className="btn btn-primary me-1"
                            onClick={() => gotofollow(lead.id)}
                          >
                            Followup
                          </button>
                          <button
                            className="btn btn-warning me-1"
                            onClick={() => editlead(lead._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger me-1"
                            onClick={() => deletelead(lead.id,lead._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default Admindashboard;
