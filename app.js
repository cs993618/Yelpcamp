var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    SeedDB     = require("./seeds");
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

    var commentRoutes   = require("./routes/comments"),
        campgoundRoutes = require("./routes/campgrounds"),
        indexRoutes     = require("./routes/index");


// SeedDB(); //Seed the database


//passport configuration
app.use(require("express-session")({
    secret: "Rusty is cute",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//available in every template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



app.use("/", indexRoutes);
app.use("/campground/:id/comments/", commentRoutes);
app.use("/campground", campgoundRoutes);

mongoose.connect("mongodb://localhost:27017/YelpcampV12", { useNewUrlParser: true });


// Campground.create(
//     {
//         name:"River and sky", 
//         image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkU9cJEprzKczrQriDBXZzf4_pCxK7YOZBmwbQ49OqX7r298u",
//         description:"River and sky is the oldest campground. It has a very cool histroy, but the device and environment are well maintained."
//     },
//     function(err,campground){
//         if(err){
//             console.log("Something wrong");
//             console.log(err);
//         }else{
//             console.log("New Campground Create!!");
//             console.log(campground);
//         }
//     });







app.listen(process.env.PORT, process.env.IP,function(){
   console.log("The Yelpcamp server start!"); 
});




// var campgrounds = [
//         {name:"Geoge Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuNGp_kOfvJr7uX91BV5QQJCw1gvNtBLUtNO1PQNDO6maX3-0"},
//         {name:"River and sky", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkU9cJEprzKczrQriDBXZzf4_pCxK7YOZBmwbQ49OqX7r298u"},
//         {name:"Sky Mountain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT36ItVw1D9nu9Z0l9JQfPaWKTZjkqPb_x3PoHBANo8PcxuYmYY"},
//         {name:"Geoge Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuNGp_kOfvJr7uX91BV5QQJCw1gvNtBLUtNO1PQNDO6maX3-0"},
//         {name:"River and sky", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkU9cJEprzKczrQriDBXZzf4_pCxK7YOZBmwbQ49OqX7r298u"},
//         {name:"Sky Mountain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT36ItVw1D9nu9Z0l9JQfPaWKTZjkqPb_x3PoHBANo8PcxuYmYY"},
//         {name:"Geoge Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuNGp_kOfvJr7uX91BV5QQJCw1gvNtBLUtNO1PQNDO6maX3-0"},
//         {name:"River and sky", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkU9cJEprzKczrQriDBXZzf4_pCxK7YOZBmwbQ49OqX7r298u"},
//         {name:"Sky Mountain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT36ItVw1D9nu9Z0l9JQfPaWKTZjkqPb_x3PoHBANo8PcxuYmYY"}
//         ];