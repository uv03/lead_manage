const mongoose=require('mongoose');

const Followupschema=new mongoose.Schema({
    lead_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"lead",
        required:true,
    },
    description:{type:String,required:true},
    due_date:{type:String,required:true},
    status:{type:String,required:true,default:"pending"},
});

const Follow=mongoose.model("follow",Followupschema);

module.exports=Follow;


// id	INTEGER	Unique identifier for each follow-up task
// lead_id	INTEGER	Foreign key referencing the lead table
// description	TEXT	Description of the follow-up task
// due_date	DATE	Due date for completing the follow-up task
// status	VARCHAR(20)	Status of the follow-up task (e.g., pending, completed)