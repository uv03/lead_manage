const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const authenticate = require("../middlewares/authenticate");
/*
    @usage : to Register a User
    @url : /api/users/register
    @fields : name , email , password , phone , role
    @method : POST
    @access : PUBLIC
*/

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, phone, role } = req.body;
    let user = await Users.findOne({ email: email });
    if (user) {
      return res.status(201).json({ msg: "User already exsist" });
    }
    //salt generation with cost factor 10
    let salt = await bcrypt.genSalt(10);

    //hashing password using salt
    password = await bcrypt.hash(password, salt);

    user = new Users({ name, email, password, phone, role });
    await user.save();
    res.status(200).json({ msg: "registration success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage:to login a user
    @url : /api/users/login
    @feilds: email, password
    @method: post
    @access: public
*/

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(201).json({ errors: [{ msg: "invalid email" }] });
    }

    //to check password that is encrypted
    let ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      return res.status(201).json({ errors: [{ msg: "incorrect password" }] });
    }

    //creating jwt token for further authentications
    let payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.SECRET_KEY, (error, token) => {
      if (error) throw error;
      res.status(200).json({ msg: "login success", token: token });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage :  to get user Info
    @url : /api/users/me
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    let user = await Users.findById(req.user.id).select("-password");
    res.status(200).json({
      user: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "eror" });
  }
});
/*
    @usage :  to send authencation otp
    @url : /api/users/reset
    @fields : email,otp
    @method : POST
    @access : Public
 */
function sendEmail({ recipient_email, OTP }) {
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
      to: recipient_email,
      subject: "Lead Manager Password Reset",
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
          <p>Do not share Your OTP with anyone.If u havent requested it Contact Us. OTP is valid for 5 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
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
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}
router.post("/reset", async (req, res) => {
  let { recipient_email, OTP } = req.body;
  let user = await Users.findOne({ email: recipient_email });
  if (!user) {
    return res.status(201).json({ errors: [{ msg: "invalid email" }] });
  }
  sendEmail(req.body)
    .then((response) => res.status(200).send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

/*
    @usage :  to change password
    @url : /api/users/changepassword
    @fields : email,password
    @method : POST
    @access : Public
 */
router.put("/changepassword", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(201).json({ errors: [{ msg: "invalid email" }] });
    }
    //salt generation with cost factor 10
    let salt = await bcrypt.genSalt(10);

    //hashing password using salt
    password = await bcrypt.hash(password, salt);
    let userobj={};
    userobj.password=password;
    let id=user._id;
    user = await Users.findByIdAndUpdate(
      id,
      { $set: userobj },
      { new: true }
    );
    res.status(200).json({ msg: "password updated successfully", user: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "eror" });
  }
});
module.exports = router;

/*"name":"a",
   "email":"a",
   "password":"1a",
   "phone":5565,
   "role":"admin"*/
