//here we are writing the db initialization code
const mongoose=require("mongoose");
const initData=require("./data.js");

const Listing=require("../Models/listing.js");

main()
.then(()=>console.log("connected to DB"))
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("database was initialized");

}

initDB();