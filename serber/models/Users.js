const  mongoose=require('mongoose');

const Userschema=new mongoose.Schema({
    "name":{type:String,required:true},
    "email":{type:String,required:true},
    "password":{type:String,required:true},
    "role":{type:String,default:"user"},
    "phone":{type:Number,required:true}
},{timestamps:true});

const Users=mongoose.model("user",Userschema);
module.exports=Users;