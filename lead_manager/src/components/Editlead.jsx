import React, { useState, useEffect } from "react";
import { Link, useNavigate,useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Editlead = () => {
    const leadId=useParams().leadid;
  let navigate = useNavigate();
  let [lead, setLead] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    source: "",
  });
  let [leadError, setLeadError] = useState({
    idError:"",
    nameError: "",
    emailError: "",
    phoneError: "",
    sourceError: "",
  });

  const getlead=async()=>{
    let { data } = await axios.get(`http://127.0.0.1:5000/api/lead/${leadId}`,{headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
},});
console.log(data.lead);
console.log(leadId);
setLead(data.lead);
}

useEffect(() => {
    getlead();
  }, []);

  let submitLead = async (event) => {
    event.preventDefault();
    if (
      lead.id !== "" &&
      lead.name.trim() !== "" &&
      lead.email.trim() !== "" &&
      lead.phone.trim() !== "" &&
      lead.source.trim() !== ""
    ) {
      let id = Number(lead.id);
      let name = lead.name.trim();
      let email = lead.email.trim();
      let phone = lead.phone.trim();
      let source = lead.source.trim();

      const { status } = await axios.put(`http://127.0.0.1:5000/api/lead/${leadId}`,
        { id,name, email, phone,source },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
          },
        }
      );
      console.log(status);
      if (status == 201) {
        Swal.fire("Email of lead already exists", "", "error");
        return;
      } else if (status == 202) {
        Swal.fire("Lead Id of lead already exists", "", "error");
        return;
      } 
      else if (status == 200) {
        Swal.fire("Lead edited successful", "", "success");
        navigate("/dashboard/admin");
      }
      else if(status==500){}
      console.log(lead);
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
    }
  };
  let validateid = (event) => {
    setLead({ ...lead, id: event.target.value });
    let regExp = /^[0-9]+$/;
    !regExp.test(event.target.value)
      ? setLeadError({ ...leadError, idError: "Enter a proper id" })
      : setLeadError({ ...leadError, idError: "" });
      console.log(lead.id);
      console.log(leadError.idError);

  };
  let validatename = (event) => {
    setLead({ ...lead, name: event.target.value });
    let regExp = /^[a-zA-Z]+$/;
    !regExp.test(event.target.value)
      ? setLeadError({ ...leadError, nameError: "Enter a proper leadname" })
      : setLeadError({ ...leadError, nameError: "" });
  };

  let validateEmail = (event) => {
    setLead({ ...lead, email: event.target.value });
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value) || event.target.value.trim() == ""
      ? setLeadError({ ...leadError, emailError: "Enter a proper Email" })
      : setLeadError({ ...leadError, emailError: "" });
  };
  let validatephone = (event) => {
    setLead({ ...lead, phone: event.target.value });
    let regExp = /^[0-9]+$/;
    !regExp.test(event.target.value)
      ? setLeadError({ ...leadError, phoneError: "Enter a proper Phone number" })
      : setLeadError({ ...leadError, phoneError: "" });
  };
  let validatesource = (event) => {
    setLead({ ...lead, source: event.target.value });
    let regExp = /^[a-zA-Z]+$/;
    !regExp.test(event.target.value)
      ? setLeadError({ ...leadError, sourceError: "Enter a proper source" })
      : setLeadError({ ...leadError, sourceError: "" });
  };
  return (
    <div className="main">
      <section className="pt-2 d-flex justify-content-center">
        <div className="container  homebg">
          <div className="row animated zoomIn m-2">
          <div className="col">
            <p className="h3 text-primary">Lead</p>
            <p>Edit a lead</p>
          </div>
          </div>
        
          <div className="row pt-2 ps-2">
            <div className="col-md-8 animated zoomIn m-2">
              <form onSubmit={submitLead}>
              <div className="form-group">
                  <input
                    required
                    name="lead_id"
                    value={lead.id}
                    onChange={validateid}
                    type="text"
                    className={`form-control mb-3 ${
                      leadError.idError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Id"
                  />
                  {leadError.idError.length > 0 ? (
                    <small className="text-danger">{leadError.idError}</small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="name"
                    value={lead.name}
                    onChange={validatename}
                    type="text"
                    className={`form-control mb-3 ${
                      leadError.nameError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Name"
                  />
                  {leadError.nameError.length > 0 ? (
                    <small className="text-danger">{leadError.nameError}</small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="email"
                    value={lead.email}
                    onChange={validateEmail}
                    type="email"
                    className={`form-control mb-3 ${
                      leadError.emailError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                  />
                  {leadError.emailError.length > 0 ? (
                    <small className="text-danger">
                      {leadError.emailError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="phone"
                    value={lead.phone}
                    onChange={validatephone}
                    type="text"
                    className={`form-control mb-3 ${
                      leadError.phoneError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Phone"
                  />
                  {leadError.phoneError.length > 0 ? (
                    <small className="text-danger">{leadError.phoneError}</small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="source"
                    value={lead.source}
                    onChange={validatesource}
                    type="text"
                    className={`form-control mb-3 ${
                      leadError.sourceError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Source"
                  />
                  {leadError.sourceError.length > 0 ? (
                    <small className="text-danger">{leadError.sourceError}</small>
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
                <Link to="/dashboard/admin" className="font-weight-bold text-primary">
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
}

export default Editlead