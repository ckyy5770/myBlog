var Blog = require("../models/blog");

// verification functions -- middleware
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
};
middlewareObj.isAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err,foundBlog){
            if(err){
                req.flash("error", "Blog not found");
                res.redirect("back");
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash("error", "You are not the author of the blog!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;