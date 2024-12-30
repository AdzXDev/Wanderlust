// as we are taking listing from database so we need to require it. 
const Listing = require("./models/listing");
const ExpressError= require("./utils/ExpressError.js");
const{listingSchema}= require("./schema.js") //for joi server side validation i.e requiring joi schema
const{reviewSchema}= require("./schema.js"); //for joi server side validation i.e requiring joi schema
const Review = require("./models/review");

module.exports.isLoggedIn= (req,res,next)=>{
     
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
       }
       next();
};  

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    } 
   next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
   // equals - method to check that the data are eq or not
   //to check listing owner and then only the listing can be edited  
   if(!listing.owner.equals(res.locals.currUser._id)){
       req.flash("error", "You are not the owner of this listing");
      return  res.redirect(`/listings/${id}`);
    }
     next();
};

//function for listing validation (server-side) using joi
module.exports.validateListing= (req,res,next)=>{
    let {error}=listingSchema.validate(req.body); 
    if(error)
    {    
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//function for review validation (server-side) using joi
module.exports.validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
    if(error)
    {    
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//review authorization

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review= await Review.findById(reviewId);
   // equals - method to check that the data are eq or not
   //to check listing owner and then only the listing can be edited  
   if(! review.author.equals(res.locals.currUser._id)){
       req.flash("error", "You are not the author of this review");
      return  res.redirect(`/listings/${id}`);
    }
     next();
};