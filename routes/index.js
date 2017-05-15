var express = require("express");
var router = express.Router();
var passport = require("passport");

// models
var User = require("../models/user");

// root route
router.get("/",function(req, res){
    res.redirect("/blogs");
});
// authentication routes
router.get("/register", function(req, res){
   res.render("register"); 
});
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/blogs");
        });
    });
});
router.get("/login", function(req, res){
   res.render("login"); 
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}) ,function(req, res){
});
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/blogs");
});

module.exports = router;