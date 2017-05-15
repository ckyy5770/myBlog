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
    if(req.body.invitation!=process.env.INVITATIONCODE){
        req.flash("error", "The invitation code does not exist. Please send a email to iloveyoukcl5770@gmail.com to get one.");
        return res.redirect('/register');
    }
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/blogs");
        });
    });
});
router.get("/login", function(req, res){
   res.render("login"); 
});
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}) ,function(req, res){
    req.flash("success", "Welcome back, " + req.user.username + "!");
    res.redirect("/blogs");
});
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/blogs");
});

module.exports = router;