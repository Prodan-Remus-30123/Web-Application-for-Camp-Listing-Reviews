const express = require('express')
const router = express.Router({mergeParams: true}); //so that the router doesnt differentiatiate between routers. It loses the params from the campground router.

const reviews = require('../controllers/reviews')

const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')



router.post('/',isLoggedIn, validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;