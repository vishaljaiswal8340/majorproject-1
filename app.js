const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./Models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./Models/review.js");

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


// const validateListing=(req,res,next)=>{
//     let result=listingSchema.validate(req.body);
//     console.log(result);
//     // console.log(result.error.details);
//     let {error}=result;
        
//         if(error){
//             let errMsg=error.details.map((el)=>el.message).join(",");
//             // throw new ExpressError(400,error);
//             throw new ExpressError(400,errMsg);
//         }else{
//             next();
//         }
// };

// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);

//         if(error){
//             let errMsg=error.details.map((el)=>el.message).join(",");
//             // throw new ExpressError(400,error);
//             throw new ExpressError(400,errMsg);
//         }else{
//             next();
//         }
// };

app.get("/",(req,res)=>{
    res.send("Hi i am root");
})

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"calangute Goa",
//         country:"India"

//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

//index route
// app.get("/listings",wrapAsync(async(req,res)=>{
//     let allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});

// }))

// //new route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");

// })

// //show route
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
// }))

// //create route
// // app.post("/listings",wrapAsync(async (req,res,next)=>{
// //     // let {title,description,url,price,location,country}=req.body;
        
// //         if(!req.body.listing){
// //             throw new ExpressError(400,"send valid data for listing");
// //         }

// //         let newListing=new Listing(req.body.listing);
// //         console.log(newListing);
// //         if(!newListing.title){
// //             throw new ExpressError(400,"Title is missing");
// //         }
// //         if(!newListing.description){
// //             throw new ExpressError(400,"description is missing");
// //         }
// //         if(!newListing.price){
// //             throw new ExpressError(400,"price is missing");
// //         }
// //         if(!newListing.location){
// //             throw new ExpressError(400,"location is missing");
// //         }
// //         await newListing.save();
// //         res.redirect("/listings");
// // }))

// app.post("/listings",validateListing,
//     wrapAsync(async (req,res,next)=>{
   
//         // let result=listingSchema.validate(req.body);
//         // console.log(result);
//         // if(result.error){
//         //     throw new ExpressError(400,result.error)
//         // }
//         let newListing=new Listing(req.body.listing);
//         // console.log(newListing);
        
//         await newListing.save();
//         res.redirect("/listings");
// }))

// //edit route
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// }))
// //update route
// app.put("/listings/:id",wrapAsync(async (req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"send valid data for listing");
//     }

//     let {id}=req.params;
  
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
    
// }))
// //delete route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let deletedlisting=await Listing.findByIdAndDelete(id);
//     console.log(deletedlisting);
//     res.redirect("/listings");
// }))


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


//post reviews route
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let {id}=req.params;
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

//if getting api request to route other then mention above

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