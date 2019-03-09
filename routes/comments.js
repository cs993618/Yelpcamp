var express = require("express");
var router = express.Router({mergeParams: true}); 
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//===============================
//comments route
//===============================
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

//post route [comment]
router.post("/", middleware.isLoggedIn , function(req, res){
   Campground.findById(req.params.id, function(err, campground) {
       if(err){
           console.log(err);
           res.redirect("/campground");
       }else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               }else{
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   console.log(comment);
                   req.flash("success", "Comment create!");
                   res.redirect("/campground/" + campground._id);
               }
           });
       }
   }) ;
});

//edit comment
router.get("/:commentid/edit", middleware.checkCommentOwner, function(req, res){
    // This ID is defined in app.js (means campground id)
    Comment.findById((req.params.commentid), function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "comment have been edited!");
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        }
    })
});

router.put("/:commentid", middleware.checkCommentOwner, function(req, res){
   Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/campground/" + req.params.id);
       }
   });
});

//delete comment
router.delete("/:commentid", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.commentid, function(err){
        if(err){
            req.flash("error", err)
            res.redirect("Back");
        }else{
            //req.params.id refer to campground id
            req.flash("success","Comment Delete");
            res.redirect("/campground/" + req.params.id);
        }
    });
});


// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
    
// }

// function checkCommentOwner(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.commentid, function(err, foundComment){
//         if(err){
//             res.redirect("back");
//         }else{
//              //does user own the comment?
//              if(foundComment.author.id.equals(req.user._id)){
//                 //  res.render("campgrounds/edit", {campground: foundCampground});
//                 next();
//              }else{
//                 res.redirect("back");
//          }
//         }
//     });
//     }else{
//         res.redirect("back");
//     }
// }

module.exports = router;
