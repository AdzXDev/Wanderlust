const Listing = require("../models/listing");
const Review = require("../models/review.js");


//create review route
module.exports.createReview = async (req,res)=>{
   
    let listing= await Listing.findById(req.params.id) //accessing listing by id
    //module instance 
    //when form will be submited-> review object passed to backend
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await  newReview.save();
    await listing.save();     //await bcoz as save() asynchronous func
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

//delete or destroy review route  
module.exports.destroyReview = async(req,res)=>{
   
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate( id,{$pull:{reviews:reviewId}} )
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}; 