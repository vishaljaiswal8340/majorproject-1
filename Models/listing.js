const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
    
            filename:{
                type:String,
                
            },
            url:{
                type:String,
               
            }
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
           type:Schema.Types.ObjectId,
           ref:"Review",
        }
    ],
    owner:{
         type:Schema.Types.ObjectId,
          ref:"User",
    },
    

})

//post mongoose middleware used for cascading of deletion which delete all reviews of a listing when that particular listing delete
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});


const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;