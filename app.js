if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require("express");

const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
// const Listing = require("./Models/listing.js")
// const Review = require("./Models/review.js")

const ejsMate = require("ejs-mate");

//  const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

// const {listingSchema}=require("./schema.js");
// const {reviewSchema}=require("./schema.js");

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
        secret:"mysupersecretcode"
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOptions={
    store:store,
    secret:"mysupersecretcode",
   resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

// app.get("/", (req, res) => {
//     res.send("Hi i am root");
// })




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
     res.locals.currUser=req.user || false;

    // console.log(res.locals.successmsg);
    next();
})


//server side schema validation using joi when sending req through hoopscotch
// const validateListing=(req,res,next)=>{
//     //  let result=listingSchema.validate(req.body);
//     //   console.log(result);
//     //  if(result.error){
//     //     throw new ExpressError(400,result.error)
//     // }
//      let {error}=listingSchema.validate(req.body);

//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         // throw new ExpressError(400,error)
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }

// }


// const validateReview=(req,res,next)=>{

//     let {error}=reviewSchema.validate(req.body);

//         if(error){
//             let errMsg=error.details.map((el)=>el.message).join(",");
         
//             throw new ExpressError(400,errMsg);
//         }else{
//             next();
//         }
// };




//listing route
// app.get("/listings",wrapAsync( async (req, res) => {
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });

// }))

// //new route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");

// })
// //show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// }))


// //create route
// app.post("/listings",validateListing, wrapAsync(async (req, res,next) => {

    
   
//     // let {title,descrition,image,price,country,location}=req.body;

//     //  if(!req.body.listing){
//     //     //this error throw when using hoopscotch sending req without entering the listing parameter in body
//     //     throw new ExpressError(400,"send valid data for listing")
//     //  }
     
//         const newListing = new Listing(req.body.listing);


//     //     if(!newListing.description){
//     //     //this error throw when using hoopscotch sending req without entering the listing ka description parameter in body
//     //     throw new ExpressError(400,"description is missing")
//     //    }

//         console.log(newListing);
//         await newListing.save();
//         res.redirect("/listings");
    
    
// }));
// //edit route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing })
// }))
// //update route
// app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {

//     if(!req.body.listing){
//         //this error throw when using hoopscotch sending req without entring the listing parameter in body
//         throw new ExpressError(400,"send valid data for listing");
//     }

//     let { id } = req.params;

//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);



// }))
// //delete route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedlisting = await Listing.findByIdAndDelete(id);
//     console.log(deletedlisting);
//     res.redirect("/listings");
// }))


//reviews

//post reviews route
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     console.log(id);
//     let listing=await Listing.findById(req.params.id);

//     let newReview=new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     //if you want to change existing document in db then you have to save it.
//     await listing.save();
//     res.redirect(`/listings/${id}`);

// }))

// //delete review route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//     let {id,reviewId}=req.params;

//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

//     await  Review.findByIdAndDelete(reviewId);


//     res.redirect(`/listings/${id}`);

// }))

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"catalangute , Goa",
//         country:"india",

//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successfully testing")

// })



// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student1"
//     });
//     //to store this fakeUser in db we use static method register in 1st parameter is user objext and 2nd parameter is password

//    let registeredUser=await User.register(fakeUser,"helloworld");
   
//    res.send(registeredUser);

// })



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
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
})



app.listen(8080, () => {
    console.log("server is listening to port 8080");

})
console.log("vishal");
