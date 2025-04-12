const express=require("express");
//router object
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../Models/listing.js");


const validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    // console.log(result.error.details);
    let {error}=result;
        
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            // throw new ExpressError(400,error);
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

//index route
router.get("/",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}))

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");

})

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//create route
router.post("/",validateListing,
    wrapAsync(async (req,res,next)=>{
   
        // let result=listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error)
        // }
        let newListing=new Listing(req.body.listing);
        // console.log(newListing);
        
        await newListing.save();
        res.redirect("/listings");
}))

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))
//update route
router.put("/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }

    let {id}=req.params;
  
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
    
}))
//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}))


module.exports=router;

