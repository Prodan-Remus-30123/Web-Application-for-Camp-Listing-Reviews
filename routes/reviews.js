const express = require('express')
const router = express.Router({mergeParams: true}); //so that the router doesnt differentiatiate between routers. It loses the params from the campground router.

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')



router.post('/',isLoggedIn, validateReview,catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req,res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }}) //operatorul $pull for mongoDB, sterge pe baza filtrului, in acest caz reviews care au id =  reviewID
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;