
const mongoose=require('mongoose');
const schemaOptions = {
    strictPopulate: false, // Set strictPopulate to false
  };
const Leadschema = new mongoose.Schema({
    "id":{type:Number,required:true,unique:true},
    "name":{type:String,required:true},
    "email":{type:String,required:true,unique:true},
    "phone":{type:String},
    "source":{type:String}
    
},{timestamps:true},schemaOptions); 

const Lead = mongoose.model("lead", Leadschema);
module.exports = Lead;


// id	INT	PRIMARY KEY
// name	VARCHAR(100)	NOT NULL
// email	VARCHAR(100)	NOT NULL, UNIQUE
// phone	VARCHAR(20)	
// source	VARCHAR(50)	
// created_at