const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync'); // Correct for CommonJS // Import the wrapAsync utility
const ExpressError = require('../utils/expressError.js'); // Import the ExpressError class
const {listingSchema , reviewSchema} = require("../schema.js"); 
const Review = require("../models/review"); // Import the Listing model
const Listing = require('../models/listing'); // Import the Listing model
const {isLoggedIn } = require("../middleware.js");


const validateReview = (req, res, next) => {             //server side validation to prevent unotherized requests from postman , or hoppscoth
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400, errMsg); 
  } else {
    next(); 
  }
};
const reviewController = require("../controller/review.js"); // Import the review controller
const review = require('../models/review');

// review route 
router.post(
  "/", 
  isLoggedIn, 
  validateReview, 
   wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router; 