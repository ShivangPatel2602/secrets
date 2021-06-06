//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//After we require the mongoose modules, it is time to connect it to the MongoDB database server
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

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

//Initialising the port where the website is hosted
app.listen(3000, function () {
    console.log("Server successfully started at port 3000.")
});