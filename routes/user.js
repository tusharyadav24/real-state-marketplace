const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/users.js');
router.route("/signup")
.get(userController.rednerSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureMessage:true}),userController.login);

router.get("/logout",userController.logout);
module.exports=router;
