const express = require("express");
const router = express.Router();
const requireadmin = require("../middlewares/requireadmin");
const Lead = require("../models/Lead");
const authenticate = require("../middlewares/authenticate");
const Follow = require("../models/followup");
const Comm = require("../models/Communication");

/*
    @usage : to enter new lead to database
    @url : /api/lead/newlead
    @fields : id, name , email , password , phone ,sorce
    @method : POST
    @access : admin
*/
router.post("/newlead", requireadmin, async (req, res) => {
  try {
    let { id, name, email, phone, source } = req.body;
    let lead = await Lead.findOne({ email: email });
    if (lead) {
      return res.status(201).json({ msg: "Email already exsist" });
    }
    lead = await Lead.findOne({ id: id });
    if (lead) {
      return res.status(201).json({ msg: "id already exsist" });
    }
    lead = new Lead({ id, name, email, phone, source });
    await lead.save();
    res.status(200).json({ msg: "lead inserted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong!" });
  }
});

/*
    @usage : to get all lead
    @url : /api/lead/
    @fields : NULL
    @method : GET
    @access : private
*/
router.get("/", authenticate, async (req, res) => {
  try {
    let lead = await Lead.find().populate("id", [
      "name",
      "email",
      "phone",
      "source",
    ]);
    if (!lead) {
      return response.status(400).json({ errors: [{ msg: "No lead Found" }] });
    }
    res.status(200).json({ lead: lead, user: req.user });
  } catch (e) {
    console.log(e);
  }
});
/*
    @usage : to get a lead
    @url : /api/lead/:leadid
    @fields : NULL
    @method : GET
    @access : private
*/
router.get("/:leadid", authenticate, async (req, res) => {
  try {
    let leadId = req.params.leadid;
    let lead = await Lead.findById(leadId);
    if (!lead) {
      return response.status(400).json({ errors: [{ msg: "No lead Found" }] });
    }
    res.status(200).json({ lead: lead, user: req.user });
  } catch (e) {
    console.log(e);
  }
});
/*
    @usage : to delete a lead by id
    @url : /api/lead/:leadId
    @fields : NULL
    @method : DELETe
    @access : private
*/
router.delete("/:leadId", requireadmin, async (req, res) => {
  try {
    let leadId = req.params.leadId;

    let lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(400).json({ errors: [{ msg: "No lead Found" }] });
    }
    lead = await Lead.findByIdAndRemove(leadId);
    res.status(200).json({ msg: "lead deleted", lead: lead });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage : to update a lead
    @url : /api/lead/:leadId
    @fields : 
    @method : PUT
    @access : private
*/
router.put("/:leadId", requireadmin, async (req, res) => {
  try {
    let leadId = req.params.leadId;
    let lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(400).json({ errors: [{ msg: "No Post Found" }] });
    }
    let { id, name, email, phone, source } = req.body;
    let nlead = await Lead.findOne({ email: email });
    if (nlead && leadId != nlead._id) {
      return res.status(201).json({ msg: "Email already exsist" });
    }
    nlead = await Lead.findOne({ id: id });
    if (nlead && leadId != nlead._id) {
      return res.status(202).json({ msg: "Id already exsist" });
    }
    let leadobj = {};
    leadobj.id = id;
    leadobj.name = name;
    if (email) leadobj.email = email;
    if (phone) leadobj.phone = phone;

    if (source) leadobj.source = source;

    lead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: leadobj },
      { new: true }
    );
    res.status(200).json({ msg: "lead updated successfully", lead: lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

module.exports = router;


