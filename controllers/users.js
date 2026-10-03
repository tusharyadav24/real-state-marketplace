const User=require('../models/user');
module.exports.rednerSignupForm=(req,res)=>{
    res.render("./users/signup.ejs");
}
module.exports.signup=async(req,res,next)=>{
try{
    let {username,email,password}=req.body;
    let registeredUser=new User({username,email,password});
    await User.register(registeredUser,password);
    req.login(registeredUser,(err)=>{
     if(err){
        next(err);
     }
     req.flash("success","welcome to wanderlust !");
     res.redirect("/listings");
    })
}catch(err){
    req.flash("error",err.message);
    res.redirect("/signup")
};
};
module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs")
};
module.exports.login=async(req,res)=>{
   req.flash("success","welcome back to wanderlust");
   let redirectUrl=res.locals.redirectUrl || "/listings";
   if (redirectUrl === "/login") {
      redirectUrl = "/listings";
    }
   res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        };
        req.flash("success","logged out successfully");
        res.redirect("/listings");
    })
}