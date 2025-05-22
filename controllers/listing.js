const Listing=require("../Models/listing.js");

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

};

module.exports.renderNewForm=(req,res)=>{
   
  
    res.render("listings/new.ejs");

};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");

    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
   
        
        let url=req.file.path;
        let filename=req.file.filename;
        console.log(req.body);
        console.log(req.file);
        console.log(url,"....",filename);
        
        let newListing=new Listing(req.body.listing);
        console.log(newListing);
        newListing.owner=req.user._id;

        newListing.image={filename,url};
        console.log(newListing);
        await newListing.save();
        req.flash("success","new listing created!");
        res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalimageurl})
};

module.exports.updateListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }

    let {id}=req.params;

   
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
         let url=req.file.path;
       let filename=req.file.filename;
        listing.image={filename,url};
       await listing.save();
    }
   
     req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
    
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
     req.flash("success","Listing deleted!");
    res.redirect("/listings");
};