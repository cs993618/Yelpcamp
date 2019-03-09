var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");

//====Root route=====
router.get("/",function(req,res){
    res.render("landing");
});

//===================
//=====auth routes===
//===================

//show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle signup logic
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campground");
        });
    });
});

//login form!
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
    
}), function(req, res){
    
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campground");
});

// //middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
    
// }

module.exports = router;
