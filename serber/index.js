const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer=require("nodemailer")
const moment = require("moment");
const Follow = require("./models/followup");

app.use(cors());


app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

// dotEnv Configuration
dotEnv.config({ path: "./.env" });

const port=process.env.PORT || 5000
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // stop the process if unable to connect to mongodb
  });

app.use("/api/users",require("./routes/userRouter"));
app.use("/api/lead",require("./routes/input"));
app.use("/api/lead/communication",require("./routes/comHistory"));
app.use("/api/lead/followup",require("./routes/followup"));
let follow={};
function sendEmail(email,name,date,description) {
  console.log("inemail")
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Lead Manager Follow up notification",
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
        
      
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Lead Manager</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>You have a follow up scheduled for upcoming days.Check it out and request admin to mark status Completed</p>
          <p>Here are details of your followup</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"><p>Name:${name}</p><p>Date:${date}</p><p>Description:${description}</p></h2>
          <p style="font-size:0.9em;">Regards,<br />Lead Manager</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Lead Manager</p>
            
          </div>
        </div>
      </div>
      <!-- partial -->
        
      </body>
      </html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: error });
      }
      console.log("done");
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}
const checkAndSendEmails=async()=>{
  const today = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const currentDate = today.toLocaleDateString('en-GB', options);

  for (let i = 0; i < follow.length; i++) {
   
    if(follow[i].status.toLowerCase()=="pending"){
      // console.log(follow[i]);
      // console.log(follow[i].due_date.split("-")[0],currentDate.split("/")[2]);
      // console.log(follow[i].due_date.split("-")[1],currentDate.split("/")[1]);
      // console.log(parseInt(follow[i].due_date.split("-")[2]),parseInt(currentDate.split("/")[0]));

        if(follow[i].due_date.split("-")[0]==currentDate.split("/")[2] && follow[i].due_date.split("-")[1]==currentDate.split("/")[1] && parseInt(follow[i].due_date.split("-")[2])-parseInt(currentDate.split("/")[0])<7){
            sendEmail(follow[i].lead_id.email,follow[i].lead_id.name,follow[i].due_date,follow[i].description)
        }
    }
  }
}
const getfollowup=async()=>{
  follow = await Follow.find().populate("lead_id");
}
const emailCheckInterval = setInterval(checkAndSendEmails, 600000);
const getbooking = setInterval(getfollowup, 500000);

app.listen(port ,()=>{
    console.log(`server started at port ${port}`);
})