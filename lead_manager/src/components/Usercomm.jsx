import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Usercomm = () => {
  const [comm, setComm] = useState([]);
  const [load, setLoad] = useState("true");
  const [issearch, setIssearch] = useState(false);
  const [isclicked, setIsclicked] = useState(false);
  const [searchselcted, setsearchselected] = useState("select attribute");
  const [searchval, setsearchval] = useState("");
  const [cardv,setCardv]=useState([])
  const getcomm = async () => {
    let id = localStorage.getItem("leadid");
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
  }, []);

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
  return (
    <>
      {load && <h3>Loading....</h3>}
      {!load && comm.length > 0 && <div className="container m-3">
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
                  type
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

          {comm.length > 0 && (
            <div className="d-flex justify-content-evenly">
              <table className="table table-hover">
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
                        <tr key={com.lead_id._id}>
                          <th scope="row">{com.lead_id.name}</th>
                          <td>{com.date_time}</td>
                          <td>{com.type}</td>
                          <td>
                            <button
                              className="btn btn-primary"
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
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {isclicked && (
                <div className="card w-25 ms-2">
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
        {!load && comm.length<=0 && <h3>No Communication History for this lead</h3>}
    </>
  );
};

export default Usercomm;
