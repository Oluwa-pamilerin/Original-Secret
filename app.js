//jshint esversion:6

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();
console.log(process.env.SECRET);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB")
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});
const secret=process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret ,  encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home")
});

app.get("/login", function(req, res) {
  res.render("login")
});
app.post("/login", function(req, res) {
  User.findOne({
    email: req.body.username
  }, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render("secrets")
        } else {
          res.send("Wrong Email or password!")
        }
      } else {
        res.send("No user with the email: " + req.body.username)
      }
    } else {
      console.log(err);
    }
  })
});

app.get("/register", function(req, res) {
  res.render("register")
});
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

app.listen(3000, function() {
  console.log("Working!");
})
