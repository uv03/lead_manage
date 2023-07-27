const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Lead = require("../models/Lead");
const Comm = require("../models/Communication");

const authenticate = require("../middlewares/authenticate");
const requireadmin = require("../middlewares/requireadmin");

/*
    @usage : to enter communication history
    @url : /api/lead/communication/new
    @fields : leadid,date-time,type,content
    @method : POST
    @access : admin
*/

router.post("/new", requireadmin, async (req, res) => {
  try {
    let { leadId, date_time, type, content } = req.body;
    console.log(leadId);
    let lead = await Lead.findOne({ id: leadId });
    if (!lead) {
      return res.status(201).json({ msg: "lead not found" });
    }
    let lead_id = lead._id;

    let comm = new Comm({ lead_id, date_time, type, content });
    await comm.save();
    res.status(200).json({ msg: "communication history entered" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: e.message });
  }
});

/*
    @usage : to get communication history
    @url : /api/lead/communication
    @fields : leadid,date-time,type,content
    @method : get
    @access : private
*/
//direct _id rather find and get
router.get("/:leadId", authenticate, async (req, res) => {
  try {
    let leadId = req.params.leadId;
    console.log(leadId);
    let lead = await Lead.findOne({ id: leadId });
    if (!lead) {
      return res.status(400).json({ msg: "lead not found" });
    }
    leadId = lead._id;
    let comm = await Comm.find({ lead_id: leadId }).populate("lead_id", [
      "name",
      "email",
    ]);
    if (!comm) {
      return res.status(400).json({ msg: "communication history not found" });
    }
    res.status(200).json({ comm: comm });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: e.message });
  }
});
/*
    @usage : to get communication history
    @url : /api/lead/communication/comm/:commId
    @fields : 
    @method : get
    @access : private
*/
//direct _id rather find and get
router.get("/comm/:commid", authenticate, async (req, res) => {
  try {
    let commId = req.params.commid;

    let comm = await Comm.findById(commId).populate("lead_id", [
      "id",
      "name",
      "email",
    ]);
    if (!comm) {
      return res.status(400).json({ msg: "communication history not found" });
    }
    res.status(200).json({ comm: comm });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: e.message });
  }
});
/*
    @usage : to delete communication history
    @url : /api/lead/communication/:commId
    @fields : leadid,date-time,type,content
    @method : delete
    @access : admin
*/

router.delete("/:commId", requireadmin, async (req, res) => {
  try {
    let commId = req.params.commId;

    let commhis = await Comm.findById(commId);
    if (!commhis) {
      return res.status(400).json({ msg: "no communication history" });
    }
    commhis = await Comm.findByIdAndRemove(commId);
    res
      .status(200)
      .json({ msg: "Communication history deleted", commhis: commhis });
  } catch (e) {
    console.log(e);
    res.status(5801).json({ msg: e.message });
  }
});

/*
    @usage : to update communication history
    @url : /api/lead/communication/:commId
    @fields : leadid,date-time,type,content
    @method : put
    @access : admin
*/

router.put("/:commId", requireadmin, async (req, res) => {
  try {
    let commId = req.params.commId;

    let commhis = await Comm.findById(commId);
    if (!commhis) {
      return res.status(400).json({ msg: "no communication history" });
    }
    let { date_time, type, content } = req.body;

    let commobj = {};
    commobj.date_time = date_time;
    commobj.type = type;
    commobj.content = content;

    commhis = await Comm.findByIdAndUpdate(
      commId,
      { $set: commobj },
      { new: true }
    );

    res
      .status(200)
      .json({ msg: "updated communication history", commhis: commhis });
  } catch (e) {
    console.log(e);
    res.status(5801).json({ msg: e.message });
  }
});
module.exports = router;
