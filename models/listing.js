const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
//DEFINING SCHEMA
const listingSchema = new Schema({
 title: {
    type:String,
    required:true
 },
 description: String,
 image: {
   url: String,
   filename: String,
 },
 price: Number,
 location: String,
 country: String,
 reviews:[                 //one to many
    {
      type: Schema.Types.ObjectId,
      ref:"Review"     //reference model
    }
 ],
 owner:{
   type: Schema.Types.ObjectId,
   ref:"User"
 },
 
//  geometry:{
//    type: {
//       type: String, // Don't do `{ location: { type: String } }`
//       enum: ['Point'], // 'location.type' must be 'Point'
//       required: true
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     },
//  },

});


//if we delete the listing then the reviews of that listing will also be deleted
listingSchema.post('findOneAndDelete',async(listing)=>{
   if(listing){
      
      await Review.deleteMany({_id:{$in: listing.reviews} });
   }
});

//CREATING MODEL OF SCHEMA
const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;