const reviewControllers=require('../controllers/reviews');
const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview,isLoggedIn,isreviewAuthor}=require('../middleware.js')
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.addReview));
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewControllers.deleteReview));
module.exports=router;