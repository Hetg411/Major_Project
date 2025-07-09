let mongoose=require("mongoose");

let sh=new mongoose.Schema({
    email:{
     type:String,
     required:true
    },
    username:{
        type:String,
     required:true
    },
    password:{
        type:String,
     required:true,
     minlength:8
    }
})

let accounts=new mongoose.model("accounts",sh);

module.exports =accounts;