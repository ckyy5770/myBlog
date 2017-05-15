var express = require("express");
var router = express.Router();

// models
var Blog = require("../models/blog");

// verification functions -- middleware
var middleware = require("../middleware/index");

// index route
router.get("/blogs",function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});
// new route
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("new");
});
// create route
router.post("/blogs", middleware.isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var newBlog = {
        title: req.body.blog.title,
        image: req.body.blog.image,
        body: req.body.blog.body,
        author: {
            id:  req.user._id,
            username: req.user.username 
        }
    }
    Blog.create(newBlog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
// show route
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    });
});
// edit route
router.get("/blogs/:id/edit", middleware.isAuthor, function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    });
});
// update route
router.put("/blogs/:id", middleware.isAuthor, function(req, res){
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
router.delete("/blogs/:id", middleware.isAuthor, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs");
        }
    });
});

module.exports = router;