//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//After we require the mongoose modules, it is time to connect it to the MongoDB database server
mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

//Creating the schema of the database 
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

//Now we need to create a model by specifying the database and which schema it will follow
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Rendering the home page
app.get("/", function (req, res) {
    res.render("home");
});

//Rendering the register page
app.get("/register", function (req, res) {
    res.render("register");
});

//Rendering the login page
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

//When the post request is made from the register page
app.post("/register", function (req, res) {
    User.register({
        username: req.body.username
    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })

});

//when the post request is made from the login page
app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    })
});

//Initialising the port where the website is hosted
app.listen(3000, function () {
    console.log("Server successfully started at port 3000.")
});