

let mongoose=require("mongoose");
let link="https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D";
let sh=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
  image: {
  filename: String,
  url: String
},

    price:{
      type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    geometry:{
        type:[Number]
    }
})

let listing=new mongoose.model("listing",sh);

module.exports=listing;