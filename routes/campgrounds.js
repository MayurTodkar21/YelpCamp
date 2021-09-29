const express = require('express');
const router = express.Router();
const campgrounds = require('../controller/campgrounds');
const Joi = require('joi')
const {number} = require('joi')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({storage});

const {isLoggedIn} = require('../middleware');



router.get('/',  catchAsync(campgrounds.index));



router.post('/',isLoggedIn, upload.array('image') ,  catchAsync(campgrounds.createCampground));
//router.post('/', upload.single('image') ,(req,res) =>{
//    console.log(req.body, req.file)
//    res.send("successful");
//})
router.get('/new',isLoggedIn, campgrounds.loggedIn);
router.get('/:_id', catchAsync(campgrounds.getform));

router.get('/:_id/edit', catchAsync(campgrounds.editroute));

router.post('/:id', catchAsync(campgrounds.postform));

router.delete('/:id',catchAsync(campgrounds.deleteform));

module.exports = router;