var Blog = require("../models/blog");

// verification functions -- middleware
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("back");
    }
}
middlewareObj.isAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err,foundBlog){
            if(err){
                res.redirect("back");
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                    return next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

module.exports = middlewareObj;