const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controller/users');

router.get('/register',users.renderRegister);
router.post('/register', catchAsync(users.register))
router.get('/login',users.renderLogin)

router.post('/login', passport.authenticate('local', {failureFlash: true, falureRedirect:'/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;