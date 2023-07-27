import axios from "axios";
import React from "react";
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";



const Resetpass = () => {
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [emailError,setEmailError]=useState("")
    const [sentotp,setSentotp]=useState(false)
    const [otp,setOtp]=useState(0);
    // const [userotp,setUserotp]=useState("")
    const [timerCount, setTimer] = useState(60);
    const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
    const [disable, setDisable] = useState(true);
    useEffect(() => {
        let interval = setInterval(() => {
          setTimer((lastTimerCount) => {
            lastTimerCount <= 1 && clearInterval(interval);
            if (lastTimerCount <= 1) setDisable(false);
            if (lastTimerCount <= 0) return lastTimerCount;
            return lastTimerCount - 1;
          });
        }, 1000); //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval);
        
      }, [disable]);
    const submitLogin=async(e)=>{
        e.preventDefault();
        const cOTP = Math.floor(Math.random() * 9000 + 1000);
        setOtp(cOTP);
        console.log(otp)
        let  recipient_email=email;
        let OTP=cOTP;
        let { status,data } = await axios.post("http://127.0.0.1:5000/api/users/reset",{recipient_email,OTP});
        // console.log(status,data)
        if(status==200){setSentotp(true)}
        else {
            setEmailError(data.errors[0].msg)
        }
    }
    const submitOTP=(e)=>{
        e.preventDefault();
        if (parseInt(OTPinput.join("")) === otp) {
            navigate(`/users/changepassword/${email}`)
            return;
          }
          alert(
            "The code you have entered is not correct, try again or re-send the link"
          );
          return;
    }
    const resendOtp=async(e)=>{
        setEmail(email);
        if (disable) return;
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => setDisable(true))
      .then(() => alert("A new OTP has succesfully been sent to your email."))
      .then(() => setTimer(60))
      .catch(console.log);
    }
    let validateEmail = (event) => {
        setEmail(event.target.value);
        let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
        !regExp.test(event.target.value)
          ? setEmailError("Enter a proper Email")
          : setEmailError("");
      };
  return (
    <div className="main">
         <section className="pt-2 d-flex justify-content-center">
        <div className="container homebg">
          <div className="row animated zoomIn">
            <div className="col">
              <p className="h3 text-teal">
                <i className="fa fa-sign-in-alt" /> Forgot Password
              </p>
              <p>Reset Password Lead-Manager</p>
            </div>
          </div>
        
          <div className="row pt-2">
            <div className="col-md-8 animated zoomIn">
              <form onSubmit={!sentotp ? (submitLogin):(submitOTP)}>
                <div className="form-group">
                  <input
                    name="email"
                    required
                    value={email}
                    onChange={validateEmail}
                    type="email"
                    className={`form-control mb-3 ${
                        emailError.length > 0 ? "is-invalid" : ""
                      }`}
                    placeholder="Email"
                  />
                  {emailError.length > 0 ? (
                    <small className="text-danger">
                      {emailError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
               {sentotp && <div><div className="form-group mb-3 ">
                <div className="label">OTP Sent to your Email:</div>
                <div className="w-75">
                <div className="d-flex w-50">
                <input
                      maxLength="1"
                      className="form-control w-25 rounded-2 input-lg items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 me-1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          e.target.value,
                          OTPinput[1],
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                    <input
                      maxLength="1"
                      className="form-control w-25 rounded-2 input-lg items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 me-1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          e.target.value,
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                     <input
                      maxLength="1"
                      className="form-control w-25 rounded-2 input-lg items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 me-1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          e.target.value,
                          OTPinput[3],
                        ])
                      }
                    ></input>
                    <input
                      maxLength="1"
                      className="form-control w-25 rounded-2 input-lg items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          OTPinput[2],
                          e.target.value,
                        ])
                      }
                    ></input>
                </div>
                </div>
                </div>
                <div className="form-group mb-3">
                <p>Didn't recieve code?</p>{" "}
                <a
                  className=""
                  style={{
                    color: disable ? "gray" : "blue",
                    cursor: disable ? "none" : "pointer",
                    textDecorationLine: disable ? "none" : "underline",
                  }}
                  onClick={() => resendOtp()}
                >
                  {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                </a>
              </div>
                </div>
                }
                <div>
                  <input
                    type="submit"
                    className="btn btn-teal btn-sm"
                    value="Submit"
                  />
                </div>
              </form>

              <small>
                Don't have an account ?
                <Link
                  to="/users/register"
                  className="font-weight-bold text-primary"
                >
                  {" "}
                  Register
                </Link>
              </small>
              
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Resetpass