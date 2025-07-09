let mongoose=require("mongoose");
let accounts=require("../Models/account.js");
const URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
  console.log("Connected to database");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(URL);
}

function funck(em,um,pass){
    const data=new accounts({
        email:em,
        username:um,
        password:pass
    })

    data.save();
}

model.exports=funck;