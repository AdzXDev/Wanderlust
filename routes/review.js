const { Router } = require("express");
const express = require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review=  require("../models/review.js"); //requiring review model
const Listing =  require("../models/listing.js"); //requiring listing model 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Post Route Review
//validateReview middleware
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor , wrapAsync(reviewController.destroyReview));
  
module.exports= router;