import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Admincomm = () => {
  const id=useParams().leadid;
  const navigate=useNavigate();
  const [comm, setComm] = useState([]);
  const [load, setLoad] = useState("true");
  const [issearch, setIssearch] = useState(false);
  const [isclicked, setIsclicked] = useState(false);
  const [searchselcted, setsearchselected] = useState("select attribute");
  const [searchval, setsearchval] = useState("");
  const [cardv,setCardv]=useState([])
  const [deleted,setdeleted]=useState(false);
  const getcomm = async () => {
    
    let { data } = await axios.get(
      `http://127.0.0.1:5000/api/lead/communication/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
        },
      }
    );
    console.log(data);
    setComm(data.comm);
    
    setLoad(false);
  };
  
  useEffect(() => {
    getcomm();
    if(deleted)setdeleted(false)
  }, [deleted]);

  const handlesearch = (e) => {
    getcomm();

    setIssearch(true);
    console.log(e.target.className.split(" ")[1]);
    if (e.target.className.split(" ")[1] == "0") setsearchselected("name");
    if (e.target.className.split(" ")[1] == "1") setsearchselected("date");
    if (e.target.className.split(" ")[1] == "2") setsearchselected("type");
  };
  const handlevalue = (e) => {
    setsearchval(e.target.value);
  };
  const searching = () => {
    if (searchselcted == "name") {
      const filteredArray = comm.filter((item) =>
        item.lead_id.name.toLowerCase().includes(searchval.toLowerCase())
      );
      setComm(filteredArray);
      console.log(comm);
    }
    if (searchselcted == "date") {
      const filteredArray = comm.filter((item) =>
        item.date_time.toLowerCase().includes(searchval.toLowerCase())
      );
      setComm(filteredArray);
      console.log(comm);
    }
    if (searchselcted == "type") {
      const filteredArray = comm.filter((item) =>
        item.type.toLowerCase().includes(searchval.toLowerCase())
      );
      setComm(filteredArray);
      console.log(comm);
    }
  };
  const handleclick = (name, date, type, content) => {
    setIsclicked(true);
    console.log(name);
    let cardval={}
    cardval.Name = name;
    cardval.Date = date;
    cardval.Type = type;
    cardval.Content = content;
    setCardv(cardval)
  };
  const addhistory =() => {
    navigate(`/lead/comm/newcomm/${id}`);
  }
  const editcomm =(commid)=>{
    navigate(`/lead/comm/${commid}`)
  }
  const deletecomm =async(commid)=>{
    let { data } = await axios.delete(
      `http://127.0.0.1:5000/api/lead/communication/${commid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
        },
      }
    );
    setdeleted(true);
  }
  return (
    <div className="main pt-2">
      {load && <h3 className="container d-flex justify-content-center">Loading...</h3>}
      {!load && comm.length > 0 && <div className="container p-3 homebg rounded-1">
          <div className="upper row d-flex justify-content-between  pe-3 pb-2">
            <div className={`dropdown searchs d-flex col-lg-9 col-md-11 col-sm-12 `} >
            <div className={`border rounded d-flex justify-content-centerme-1 col-lg-4 col-md-5 col-sm-6 me-2`}>
            <span className="pt-2 me-2 ms-3">Search by:</span>
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
                  type
                </a>
              </li>
            </ul>
            </div>
            {issearch && (
              <div className={`search_val border rounded-1 d-flex justify-content-around col-lg-6 col-md-7 col-sm-9`}>
                <span className="pt-2 mt-1">Value : </span>
                <input
                  className="mt-2 mb-2 rounded-1"
                  type="string"
                  value={searchval}
                  onChange={handlevalue}
                  placeholder="Enter value"
                />
                <input
                  type="submit"
                  className="btn btn-teal btn-sm m-2 "
                  onClick={searching}
                />
              </div>
            )}
          </div>
          <div className={`btn btn-primary  ms-2 col-lg-2 col-sm-5`} onClick={addhistory}>
              +Enter a history
            </div>
          </div>

          {comm.length > 0 && (
            <div className="d-flex justify-content-evenly row bg-simple p-2">
              <div className={`table-responsive ${isclicked ?"col-lg-8 col-md-7 col-sm-6":""}`} >
              <table className="table table-hover border">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {comm.length > 0 &&
                    comm.map((com) => {
                      return (
                        <tr key={com._id}>
                          <th scope="row">{com.lead_id.name}</th>
                          <td>{com.date_time}</td>
                          <td>{com.type}</td>
                          <td>
                            <button
                              className="btn btn-primary me-1"
                              onClick={() =>
                                handleclick(
                                  com.lead_id.name,
                                  com.date_time,
                                  com.type,
                                  com.content
                                )
                              }
                            >
                              View
                            </button>
                            <button
                              className="btn btn-primary me-1"
                              onClick={() =>
                                editcomm(com._id)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                deletecomm(com._id)
                              }
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
              {isclicked && (
                <div className="card ms-2 col-lg-3 col-md-4 col-sm-5">
                  <div className="card-header"><b>Name: </b>{cardv.Name}</div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><b>Date: </b>{cardv.Date}</li>
                    <li className="list-group-item"><b>Type: </b>{cardv.Type}</li>
                    <li className="list-group-item"><b>ContentType: </b>{cardv.Content}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>}
        {!load && comm.length<=0 && <div className="container homebg p-2 mt-2">
        <h3 className="container d-flex justify-content-center">No Communication History for this lead</h3>
        <div className="row d-flex justify-content-center">
        <div className="btn btn-primary mb-1 col-2" onClick={addhistory}>
        +Enter a history
      </div>
        </div>
        </div>
        }
      
    </div>
  );
};

export default Admincomm;
