const express=require("express");
//router object
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema}=require("../schema.js");
const Listing=require("../Models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")

const listingController=require("../controllers/listing.js");

const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createListing));
    // .post(upload.single('listing[image][url]'),(req,res)=>{
    //     console.log(req.body);
    //     console.log(req.file);
    //     res.send(req.file);
    // });

//new route
router.get("/new",isLoggedin,listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner,upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

//index route
// router.get("/",wrapAsync(listingController.index));



//show route
// router.get("/:id",wrapAsync(listingController.showListing));

//create route
// router.post("/",isLoggedin,validateListing,wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));

//update route
// router.put("/:id",isLoggedin,isOwner,validateListing,wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;

