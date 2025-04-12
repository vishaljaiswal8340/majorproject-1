const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
    
            filename:{
                type:String,
                default:"listingimage",
            },
            url:{
                type:String,
                default:"https://media.istockphoto.com/id/2152515127/photo/southern-lights-over-lake-te-anau.webp?a=1&b=1&s=612x612&w=0&k=20&c=jw-iKB4Beau2CTargKPi6VjZSAj4wTsZ7-5s7bqpX2I=",
                set:(v)=>v==="" ? "https://media.istockphoto.com/id/2152515127/photo/southern-lights-over-lake-te-anau.webp?a=1&b=1&s=612x612&w=0&k=20&c=jw-iKB4Beau2CTargKPi6VjZSAj4wTsZ7-5s7bqpX2I=":v,
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
    ]
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;