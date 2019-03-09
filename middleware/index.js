// all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentid, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
             //does user own the comment?
             if(foundComment.author.id.equals(req.user._id)){
                //  res.render("campgrounds/edit", {campground: foundCampground});
                next();
             }else{
                req.flash("error", "You Don't Have premission.");
                res.redirect("back");
         }
        }
    });
    }else{
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
};
    


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //flash should be put before redirect
    //and we need to pass a key "success" and a value "Please Login First" 
    //in the route which get "/login", we need to put the key word as message and pass it to the ejs file
    //the flash message will be trigger only the event is happen.
    req.flash("error", "Please Login First"); //show up on the next page
    res.redirect("/login");
};

middlewareObj.isAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        }else{
             //does user own the campground?
             if(foundCampground.author.id.equals(req.user._id)){
                //  res.render("campgrounds/edit", {campground: foundCampground});
                next();
             }else{
                req.flash("error", "You dont have the right.");
                res.redirect("back");
         }
        }
    });
    }else{
        req.flash("error", "Please Login first.");
        res.redirect("back");
        
    }
};

module.exports = middlewareObj ;