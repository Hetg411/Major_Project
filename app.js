let express=require("express");
let app=express();
require('dotenv').config();
let multer=require("multer");
let engine = require('ejs-mate');
let accounts=require("./Models/account.js");
let mongoose=require("mongoose");
var methodOverride = require('method-override')
let listing=require("./Models/testlisting.js");
let path=require("path");

const session = require('express-session');
const MongoStore = require('connect-mongo');
app.locals.googleMapKey = process.env.Google_Map_Key;




const Client=require("@googlemaps/google-maps-services-js").Client;
const client=new Client({});

const axios = require('axios');
const address = "Delhi,India";

let login=false;

 let Atlas_Url=process.env.Atlas_URL;
let URL=Atlas_Url;
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs', engine); 
const upload=multer({dest:'uploads/'});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const store=MongoStore.create({
    mongoUrl:URL,
    crypto:{
        secret:process.env.sec,
    },
    touchAfter:24*3600,
});
app.use(session({
    store,
  secret: process.env.sec,
  resave: false,
  saveUninitialized: false
}));


main().then(()=>{console.log("connect to database")}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));



app.post("/home/adduser",(req,res)=>{
    const { email, username, password } = req.body;
    let account=new accounts({
        email:email,
        username:username,
        password:password
    })
  account.save();
  req.session.user=username;
  res.redirect("/home");

})
app.get("/home/signin",(req,res)=>{
    res.render("accounts/signin.ejs",{user:req.session.user});
})
app.post("/home/checkaccount", async (req, res) => {
    let { username, password } = req.body;

    try {
        const user = await accounts.findOne({ username, password });

        if (user) {
            req.session.user = user;
            let redirectTo = req.session.redirectTo || "/home";
            delete req.session.redirectTo;  // Clear the session value
            res.redirect(redirectTo);
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Server error");
    }
});

app.get("/home/login",(req,res)=>{
    res.render("accounts/loginform.ejs",{user:req.session.user});
})

app.get("/home/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Logout failed");
        res.clearCookie("connect.sid");
        res.redirect("/home");
    });
});



// function isLoggedIn(req, res, next) {
   
  
//         ;  // Save the URL to go back after login
//         res.redirect("/home/login");
    
// }

app.delete("/home/delete/:id",  async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/home");
});


app.use(express.static(path.join(__dirname,"/public")));
const API_KEY = process.env.Google_Map_Key;
app.post("/home/addnew",upload.single('listing[img]'), async(req,res)=>{ 
    
    const address = req.body.listing.location; // or use req.body.listing.location
        const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: API_KEY
            }
        });
        const location = geoRes.data.results[0].geometry.location;
        let geometrys=[location.lng,location.lat];
        console.log("Latitude:", location.lat);
        console.log("Longitude:", location.lng);
    let list=new listing(req.body.listing);
      list.image={
        url:`/uploads/${req.file.filename}`,
        filename:req.file.originalname
      }
      list.geometry=geometrys;
    await list.save();
    console.log(list);
    res.redirect("/home");
    
})

app.put("/updateindex/:id",upload.single('listing[img]'),async (req,res)=>{
    let {id}=req.params;
    let updateddata=req.body.listing;
    if(req.file){
        updateddata.image={
            url:`/uploads/${req.file.filename}`,
            filename: req.file.originalname
        }
    }
    await listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/home/${id}`);
})

app.get("/home/update/:id",async (req,res)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    let originalurl=data.image.url;
    originalurl = originalurl.replace("/uploads", "/uploads/h_200,w_300,e_blur300");
   // console.log(data);
   let user=req.session.user;
   if(user){
      res.render("listing/updateform.ejs",{data,originalurl,user:req.session.user});
   }else{
    req.session.redirectTo=req.originalUrl;
res.render("accounts/loginform.ejs",{user:req.session.user});
   }
})

app.get("/home/new",(req,res)=>{
     user=req.session.user;
     
     if(user){
res.render("listing/form.ejs",{user:req.session.user});
     }else{
        res.render("accounts/loginform.ejs",{user:req.session.user});
     }
    
//res.send("workinh");
})

app.get("/home/:id",async(req,res)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    console.log(data.geometry);
    res.render("listing/show.ejs",{data,user:req.session.user});
})

app.get("/home",async(req,res)=>{
    let alldata=await listing.find();
    res.render("listing/index.ejs",{alldata,user:req.session.user});
})

// app.get("/testlisting",async(req,res)=>{
   
//     let data=new listing({
//         title:"My new villa",
//         description:"near beach",
//         price:900,
//         location:"goa",
//         country:"India"
//     })

//     await data.save().then((res)=>{
//         console.log(res);
//     }).catch((err)=>{
//         console.log(err);
//     });
    
// })

app.get('/', async (req, res) => {
  let alldata=await listing.find();
    res.render("listing/index.ejs",{alldata,user:req.session.user});
});
app.listen(8080,()=>{
    console.log("listning");
})