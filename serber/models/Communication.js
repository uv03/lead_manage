const mongoose=require("mongoose");

const Commschema=new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "lead",
        required: true,
    },
    date_time:{type:String,required:true},
    type:{type:String,required:true},
    content:{type:String,required:true},
},{timestamps:true});

const Comm=mongoose.model("comm",Commschema);

module.exports=Comm;