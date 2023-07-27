import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Editcomm = () => {
  const id = useParams().commid;
  let navigate = useNavigate();
  const [type,setType]=useState('')
  const [a,seta]=useState('')

  let [comm, setComm] = useState({
    lead_id: "",
    date_time: "",
    type: "",
    content: "",
  });
  let [commError, setCommError] = useState({
    date_timeError: "",
    typeError: "",
    contentError: "",
  });
  let validatedate = (event) => {
    setComm({ ...comm, date_time: event.target.value });
    let regExp = /^\d{4}-\d{2}-\d{2}$/;
    !regExp.test(event.target.value)
      ? setCommError({
          ...commError,
          date_timeErrorError: "Enter a proper content",
        })
      : setCommError({ ...commError, date_timeErrorError: "" });
  };
  let validatecontent = (event) => {
    setComm({ ...comm, content: event.target.value });
  };
  const settype = (event) => {
    setComm({ ...comm, type: event.target.value });
    if (event.target.value == "Select type of Communcation") {
      setCommError({ ...commError, typeError: "Select a type" });
    } else {
      setCommError({ ...commError, typeError: "" });
    }
    console.log(event.target.value);
  };
  const getcomm = async () => {
    let { data } = await axios.get(
      `http://127.0.0.1:5000/api/lead/communication/comm/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
        },
      }
    );
    setComm(data.comm);
    seta("1")
  };
  const submitComm =async(event) =>{
    event.preventDefault();
    event.preventDefault();
    if(
        comm.lead_id && comm.date_time.trim() && comm.content.trim() && comm.type
    ){
        let leadId=comm.lead_id;
        let date_time=comm.date_time.trim();
        let content=comm.content.trim();
        let type=comm.type;

        const { status } = await axios.put(`http://127.0.0.1:5000/api/lead/communication/${id}`,
        { leadId,content, date_time, type},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
          },
        }
      );
    //   console.log(status);
     if (status == 200) {
        Swal.fire("communication history updated successful", "", "success");
        navigate(`/lead/admin/comm/${leadId.id}`);
      }
      
    }else {
        Swal.fire("Oh no!", "Something went wrong! Try again", "error");
      }
    console.log(comm)
  }
  useEffect(() => {
    getcomm();
    if(comm.type=="Text") setType('Text')
    if(comm.type=="Call") setType('Call')
    if(comm.type=="Written") setType('Written')

  }, [a]);
  return (
    <div className="main p-2">
      <section className="pt-2 d-flex justify-content-center">
        <div className="container homebg p-2">
        <div className="row animated zoomIn">
        <div className="col m-2">
          <p className="h3 text-primary">
                   Communication History
                </p>
                <p>Edit Communication History</p>
        </div>
      </div>
        
          <div className="row pt-2">
            <div className="col-md-8 animated zoomIn">
              <form onSubmit={submitComm}>
                <div className="form-group">
                  <input
                    required
                    name="date_time"
                    value={comm.date_time}
                    onChange={validatedate}
                    type="text"
                    className={`form-control mb-3 ${
                      commError.date_timeError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="YYYY-MM-DD"
                  />
                  {commError.date_timeError.length > 0 ? (
                    <small className="text-danger">
                      {commError.date_timeError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="content"
                    value={comm.content}
                    onChange={validatecontent}
                    type="text"
                    className={`form-control mb-3 ${
                      commError.contentError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Content"
                  />
                  {commError.contentError.length > 0 ? (
                    <small className="text-danger">
                      {commError.contentError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className={`mb-3 ${
                    commError.typeError.length > 0 ? "is-invalid" : ""
                  }`}>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={settype}
                  // defaultValue={type}
                >
                  {/* {console.log(type)} */}
                  <option value="Call"selected={type=="Call"}>Call</option>
                  <option value="Text" selected={type=="Text"}>Text</option>
                  <option value="Written" selected={type=="Written"}>Written</option>
                </select>
                {commError.typeError.length > 0 ? (
                    <small className="text-danger">
                      {commError.typeError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <input
                    type="submit"
                    className="btn btn-success btn-sm"
                    value="Submit"
                  />
                </div>
              </form>
              <small>
                Go to Dashboard?
                <Link
                  to="/dashboard/admin"
                  className="font-weight-bold text-teal"
                >
                  {" "}
                  Dashboard
                </Link>
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Editcomm;
