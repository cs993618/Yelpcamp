var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware= require("../middleware");

//node 如果沒有註記存取檔案 在路徑中會直接抓index



router.get("/",function(req,res){
    Campground.find({},function(err,allCamp){
        if(err){
            console.log("wrong!");
            console.log(err);
        }else{
                res.render("campgrounds/index",{campgrounds:allCamp});
        }
    });
});

//create
router.post("/", middleware.isLoggedIn, function(req,res){
   //var name = req.body.name;
   //var image = req.body.image;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var nameImage = {name:req.body.name, image:req.body.image,description:req.body.description, author:author};
   
   
   // Save the new data to DB;
   Campground.create(nameImage,function(err,newitem){
       if(err){
           console.log(err);
       }else{
           req.flash("success", "Campground Created!");
           res.redirect("/campground");
       }
   })
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

router.get("/:id",function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground}); 
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.isAuthor, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//update campground route
router.put("/:id", middleware.isAuthor, function(req, res){
    //find and update the correct campgound
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        // console.log(req.body.campground);
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campground/"+ req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.isAuthor, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campground");
        }else{
            res.redirect("/campground");
        }
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
    
// }

function isAuthor(req, res, next){
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
                res.redirect("back");
         }
        }
    });
    }else{
        res.redirect("back");
    }
}

module.exports = router;
