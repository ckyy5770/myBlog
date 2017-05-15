var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

// routes config
var blogRoutes = require("./routes/blog");
var indexRoutes = require("./routes/index");

// models config
var User = require("./models/user");
var Blog = require("./models/blog");

// app config
var app = express();
mongoose.connect("mongodb://localhost/chuilianblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// passport and session config
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

// testing db seeds config
var db_test_config = require("./db_test_config");
db_test_config();

// middleware for passing current user to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// routes
app.use(blogRoutes);
app.use(indexRoutes);

//
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running!");
});


