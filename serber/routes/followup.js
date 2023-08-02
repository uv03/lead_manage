const express = require("express");
const router = express.Router();
const requireadmin = require("../middlewares/requireadmin");
const Lead = require("../models/Lead");
const authenticate=require("../middlewares/authenticate");
const Follow=require("../models/followup");
const nodemailer = require("nodemailer");


/*
    @usage : to add new followup
    @url : /api/lead/followup/new
    @fields : id, name , email , password , phone ,sorce
    @method : POST
    @access : admin
*/
router.post("/new",requireadmin,async(req,res)=>{
    try{
        let {leadId,description,due_date,status}=req.body;
        let lead= await Lead.findOne({id:leadId});
        if(!lead){
            return res.status(201).json({msg:"lead not found"});
        }
        let lead_id=lead._id;

        let follow=new Follow({lead_id,description,due_date,status});
        await follow.save();
        res.status(200).json({msg:"followup schedule entered"});
    }catch(e){
        console.log(e);
        res.status(500).json({msg:e.message});
    }
});

/*
    @usage : to get followups
    @url : /api/lead/followup
    @fields : leadid,date-time,type,content
    @method : get
    @access : private
*/
router.get("/:leadid",authenticate,async(req,res)=>{
    try{
        let leadId=req.params.leadid;
        let lead=await Lead.findOne({id:leadId})
        if(!lead){
            return res.status(400).json({msg:"lead not found"});
        }
        leadId=lead._id;
        let follow=await Follow.find({lead_id:leadId}).populate("lead_id",["name","email"]);
        if(!follow){
            return res.status(400).json({msg:"no follow scheduled not found"});
        }
        res.status(200).json({follow:follow});
    }catch(e){
        console.log(e);
        res.status(500).json({msg:e.message});
    }
});

/*
    @usage : to get followup
    @url : /api/lead/followup
    @fields : leadid,date-time,type,content
    @method : get
    @access : private
*/
router.get("/follow/:followid",authenticate,async(req,res)=>{
    try{
        let followId=req.params.followid;
        
        let follow=await Follow.findById(followId).populate("lead_id",["id","name","email"]);
        if(!follow){
            return res.status(400).json({msg:"no follow scheduled not found"});
        }
        res.status(200).json({follow:follow});
    }catch(e){
        console.log(e);
        res.status(500).json({msg:e.message});
    }
});

/*
    @usage : to delete followup
    @url : /api/lead/followup/:followId
    @fields : leadid,date-time,type,content
    @method : delete
    @access : admin
*/
router.delete("/:followId",requireadmin,async(req,res)=>{
    try{
        let followId=req.params.followId;

        let follow=await Follow.findById(followId);
        if(!follow){
            return res.status(400).json({msg:"no followup found"});
        }
        follow=await Follow.findByIdAndRemove(followId);
        res.status(200).json({msg:"followup deleted",follow:follow});
    }catch(e){
        console.log(e);
        res.status(500).json({msg:e.message});
    }
})

/*
    @usage : to update followup schedueled
    @url : /api/lead/followup/:followId
    @fields : leadid,date-time,type,content
    @method : put
    @access : admin
*/
router.put("/:followId",requireadmin,async(req,res)=>{
    try{
        let followId=req.params.followId;

        let follow=await Follow.findById(followId);
        if(!follow){
            return res.status(400).json({msg:"no followup history"});
        }
        let {description,due_date,status}=req.body;

        let followobj={};
        followobj.description=description;
        followobj.due_date=due_date;
        followobj.status=status;

        follow=await Follow.findByIdAndUpdate(followId,{$set:followobj},{new:true});

        res.status(200).json({msg:"updated followup history",follow:follow})        
    }catch(e){
        console.log(e);
        res.status(500).json({msg:e.message});
    }
})

/*
    @usage : to notify followup schedueled
    @url : /api/lead/followup/notify/:followId
    @fields : name,date,description
    @method : post
    @access : user
*/
function sendEmail(email,name,date,description) {
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
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  }
router.post("/notify/:email",authenticate,async(req,res)=>{
    try{
        let email=req.params.email;
        let { name,date,description } = req.body;
        let lead = await Lead.findOne({ email: email });
        if (!lead) {
          return res.status(201).json({ errors: [{ msg: "invalid email" }] });
        }
        sendEmail(email,name,date,description)
          .then((response) => res.status(200).send(response.message))
          .catch((error) => res.status(500).send(error.message));
    }catch(e){
        console.log(e);
        res.status(500).json({msg:e.message});
    }
    
})
module.exports=router;