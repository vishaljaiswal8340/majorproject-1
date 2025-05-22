const Listing=require("./Models/listing.js");
const Review=require("./Models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedin=(req,res,next)=>{
    console.log(req.path,"...",req.originalUrl);
    console.log(req.user);
    if (!req.isAuthenticated()) {
        //we are adding a new method in req.session
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged-in to create listing.edit and delete listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{

    let {id}=req.params;

    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listings/${id}`);

    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    
    let result=listingSchema.validate(req.body);
    console.log(result);
   
    let {error}=result;
        
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
           
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

module.exports.isreviewAuthor=async(req,res,next)=>{

    let {id,reviewId}=req.params;

    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listings/${id}`);

    }
    next();
};