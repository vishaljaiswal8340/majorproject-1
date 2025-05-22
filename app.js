if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require("express");

const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");

app.engine('ejs', ejsMate);
const session=require("express-session");
const flash=require("connect-flash");

const MongoStore = require('connect-mongo');

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./Models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


main()
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err));

//now mongoose connect our backend server to  atlasdb(cloud) insted of localsystem mongodb db.
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));


//method to create new mongo store
const store= MongoStore.create({ 
    mongoUrl: dbUrl, 
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
   resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success");
     res.locals.errormsg=req.flash("error");
     res.locals.currUser=req.user;
    next();
})



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//if getting api request to route other then mention in above route then

app.all("*",(req,res,next)=>{
    next(new ExpressError(405,"Page not found!"));
})

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=506,message="Something went wrong!"}=err;
    
    res.status(statusCode).render("error.ejs",{err});
})



app.listen(8080, () => {
    console.log("server is listening to port 8080");

});
