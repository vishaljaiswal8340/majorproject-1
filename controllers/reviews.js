const Review=require("../Models/review.js");
const Listing=require("../Models/listing.js");


module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let listing=await Listing.findById(req.params.id);

    let newReview=new Review(req.body.review);
   
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    //if you want to change existing document in db then you have to save it.
    await listing.save();
     req.flash("success","new review created!");
    res.redirect(`/listings/${id}`);

};

module.exports.deleteReview=async (req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await  Review.findByIdAndDelete(reviewId);

    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);

}