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
                // default:"listingimage",
            },
            url:{
                type:String,
                // default:"https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
                // set:(v)=>v==="" ? "https://media.istockphoto.com/id/1202093022/photo/the-concept-of-unity-cooperation-teamwork-and-charity.webp?a=1&b=1&s=612x612&w=0&k=20&c=GXwd4m-EEHyI3o8VT1BvpMuAjpumTVhYQdmjFpjyCE4=":v,
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
    // category:{
    //     type:String,
    //     enum:["mountains","arctic","farms","deserts"]

    // }

})

//post mongoose middleware used for cascading of deletion which delete all reviews of a listing when that particular listing delete
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});


const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;