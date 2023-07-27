const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer=require("nodemailer")
// const path = require("path");


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
app.listen(port ,()=>{
    console.log(`server started at port ${port}`);
})