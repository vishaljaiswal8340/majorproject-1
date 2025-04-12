const express=require("express");
//router object
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../Models/review.js");
const Listing=require("../Models/listing.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            // throw new ExpressError(400,error);
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

//post reviews route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let listing=await Listing.findById(req.params.id);

    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    //if you want to change existing document in db then you have to save it.
    await listing.save();
    res.redirect(`/listings/${id}`);

}))

//delete review route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await  Review.findByIdAndDelete(reviewId);


    res.redirect(`/listings/${id}`);

}))

module.exports=router;