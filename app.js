const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.engine('ejs',ejsMate);

main()
.then(()=>console.log("connected to DB"))
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));


        


app.get("/",(req,res)=>{
    res.send("Hi i am root");
})





   



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);




//if getting api request to route other then mention in route folder

app.all("*",(req,res,next)=>{
    next(new ExpressError(405,"Page not found"));
})

// error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");

})
console.log("vishal");
