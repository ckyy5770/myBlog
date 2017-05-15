var User = require("./models/user");
var Blog = require("./models/blog");


function config(){
    // clear db
    User.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("cleared collection: User");
        }
    });
    Blog.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("cleared collection: Blog");
        }
    });
    
    // admin user config
    User.register(new User({username: "test"}), "password", function(err, user){
        if(err){
            console.log(err);
        }else{
            console.log(user);
        }
    });
    
    // make some fake blog
    for(var i=0; i<20; i++){
        Blog.create({
            title: "Test Blog" + i.toString(),
            image: "http://dreamicus.com/data/cat/cat-01.jpg",
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }, function(err, newBlog){
            if(err){
                console.log(err);
            }
        });
    }
}

module.exports = config;

