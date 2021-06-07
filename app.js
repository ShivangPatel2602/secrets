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

//Creating the schema of the database 
const userSchema = {
    email: String,
    password: String
};

//Now we need to create a model by specifying the database and which schema it will follow
const User = new mongoose.model("User", userSchema);


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

//When the post request is made from the register page
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    //After creating the newUser data, we will save it and check for errors
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

//when the post request is made from the login page
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        //Checking if there are any errors
        if (err) {
            console.log(err);
        } else {
            //If no errors, then go to the foundUsers parameter
            if (foundUser) {
                //If the below code is true, then it confirms that the user has a data stored in the database and that he/she can login and go ahead to submit the secret
                if (foundUser.password === password) {
                    //Then the next obvious thing is to render the secrets page
                    res.render("secrets");
                }
            }
        }
    });
});

//Initialising the port where the website is hosted
app.listen(3000, function () {
    console.log("Server successfully started at port 3000.")
});