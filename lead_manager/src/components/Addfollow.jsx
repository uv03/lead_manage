import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Addfollow = () => {
  const id = useParams().leadid;
  let navigate = useNavigate();
  let [follow, setFollow] = useState({
    lead_id: id,
    due_date: "",
    description: "",
    status: "",
  });
  let [followError, setFollowError] = useState({
    due_dateError: "",
    statusError: "",
  });

  let validatedate = (event) => {
    setFollow({ ...follow, due_date: event.target.value });
    let regExp = /^\d{4}-\d{2}-\d{2}$/;
    !regExp.test(event.target.value)
      ? setFollowError({
          ...followError,
          due_dateError: "Enter a proper content",
        })
      : setFollowError({ ...followError, due_dateError: "" });
  };

  let setdescription = (event) => {
    setFollow({ ...follow, description: event.target.value });
  };

  const setstatus = (event) => {
    setFollow({ ...follow, status: event.target.value });
    if (event.target.value == "Select current status") {
      setFollowError({ ...followError, statusError: "Select a status" });
    } else {
      setFollowError({ ...followError, statusError: "" });
    }
    // console.log(event.target.value);
  };

  const submitfollow = async (event) => {
    event.preventDefault();

    if (
      follow.lead_id &&
      follow.due_date.trim() &&
      follow.description.trim() &&
      follow.status
    ) {
      // console.log("4");
      let leadId = follow.lead_id;
      let due_date = follow.due_date.trim();
      let description = follow.description.trim();
      let status = follow.status;

      status = await axios.post(
        "https://leadmanager.onrender.com/api/lead/followup/new",
        { leadId, description, due_date, status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("leadmanager")}`,
          },
        }
      );
      // console.log(status.status);
      if (status.status == 200) {
        Swal.fire("followup scheduled successful", "", "success");
        navigate(`/lead/admin/follow/${id}`);
      }
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
    }
  };
  return (
    <div className="main">
      <section className="pt-2 d-flex justify-content-center">
        <div className="container homebg">
          <div className="row animated zoomIn">
            <div className="col">
              <p className="h3 text-primary">Follow UP</p>
              <p>Add a Followup Schedule</p>
            </div>
          </div>
          <div className="row pt-2">
            <div className="col-md-8 animated zoomIn">
              <form onSubmit={submitfollow}>
                <div className="form-group">
                  <input
                    required
                    name="due_date"
                    value={follow.due_date}
                    onChange={validatedate}
                    type="text"
                    className={`form-control mb-3 ${
                      followError.due_dateError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Due Date(YYYY-MM-DD)"
                  />
                  {followError.due_dateError.length > 0 ? (
                    <small className="text-danger">
                      {followError.due_dateError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="description"
                    value={follow.description}
                    onChange={setdescription}
                    type="text"
                    className={`form-control mb-3`}
                    placeholder="Content"
                  />
                </div>
                <div
                  className={`mb-3 ${
                    followError.statusError.length > 0 ? "is-invalid" : ""
                  }`}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={setstatus}
                  >
                    <option defaultValue>Select current status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {followError.statusError.length > 0 ? (
                    <small className="text-danger">
                      {followError.statusError}
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
              <div className="d-flex flex-column">
                <small>
                  Go to Dashboard?
                  <Link
                    to="/dashboard/admin"
                    className="font-weight-bold text-primary"
                  >
                    {" "}
                    Dashboard
                  </Link>
                </small>
                <small>
                  Go Back to Followups?
                  <Link
                    to={`/lead/admin/follow/${id}`}
                    className="font-weight-bold text-primary"
                  >
                    {" "}
                    Follow up
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Addfollow;
