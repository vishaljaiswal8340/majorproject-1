const express=require("express");
//router object
const router=express.Router({mergeParams:true});


const wrapAsync=require("../utils/wrapAsync.js");

const Review=require("../Models/review.js");
const Listing=require("../Models/listing.js");
const {validateReview,isLoggedin,isreviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//post reviews route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedin,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;