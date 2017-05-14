var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
// models
var User = require("./models/user");

// app config
var app = express();
mongoose.connect("mongodb://localhost/chuilianblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// passport config
app.use(require("express-session")({
    secret: "test-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for passing current user to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// admin user config
User.register(new User({username: "test"}), "password", function(err, user){
    if(err){
        console.log(err);
    }else{
        console.log(user);
    }
});

// mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String, 
    body: String,
    created: {type: Date, default: Date.now()}
});
var Blog = mongoose.model("Blog", blogSchema);

// routes
app.get("/",function(req, res){
    res.redirect("/blogs");
});
// index route
app.get("/blogs",function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});
// new route
app.get("/blogs/new", isLoggedIn, function(req, res){
    res.render("new");
});
// create route
app.post("/blogs", isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
// show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    });
});
// edit route
app.get("/blogs/:id/edit", isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    });
});
// update route
app.put("/blogs/:id", isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
   });
});
// delete route
app.delete("/blogs/:id", isLoggedIn, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs");
        }
    });
});
// authentication routes
app.get("/login", function(req, res){
   res.render("login"); 
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}) ,function(req, res){
});
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/blogs");
});
// verification function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/blogs");
}
//

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running!");
});


