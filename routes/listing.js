const express=require("express");
//router object
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../Models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")

const listingController=require("../controllers/listing.js");

const multer  = require("multer");
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createListing));
  

//new route
router.get("/new",isLoggedin,listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner,upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;

