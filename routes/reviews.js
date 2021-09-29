const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi')
const reviews = require('../controller/reviews')
const {isLoggedIn} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn, catchAsync(reviews.deletReview))

module.exports = router;