const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");

const app = express();
const port = 8000;
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/nodejs-interview-db");

const User = require("./models/users");
const Token = require("./models/tokens");

const PASSWORD_SALT = 10;

app.get("/", (req, res) => {
  res.render("index.pug", { message: "Welcome!" });
});

app.get("/login", (req, res) => {
  res.render("login.pug", { message: "Login", errors: [] });
});

app.post("/login", async (req, res) => {
  const errors = [];
  if (!req.body.email) {
    errors.push("Email is required");
  }
  if (!req.body.password) {
    errors.push("Password is required");
  }
  if (errors.length !== 0) {
    return res.render("login.pug", { message: "Login", errors: errors });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log("Wrong user");
    return res.render("login.pug", {
      message: "Login",
      errors: ["Wrong email or passwrod"]
    });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.render("login.pug", {
      message: "Login",
      errors: ["Wrong email or passwrod"]
    });
  }
  res.render("index.pug", {
    message: "You are successfully logged in."
  });
});

app.get("/register", (req, res) => {
  res.render("register.pug", {});
});

app.post("/register", async (req, res) => {
  if (!req.body.email) {
    res.send("The email is required");
  }
  if (!req.body.password) {
    res.send("The password is requried");
  }
  if (!req.body.confirm_password) {
    res.send("The password confirmation is required");
  }
  const email = req.body.email;
  let password = req.body.password;
  let passwordConfirm = req.body.confirm_password;
  if (password !== passwordConfirm) {
    res.send("The passwords doesn't match.");
  }
  const user = new User();
  user.email = email;
  user.password = bcrypt.hashSync(password, PASSWORD_SALT);
  await user.save();
  const token = new Token();
  token.token = uuidv4();
  token.userEmail = user.email;
  await token.save();
  res.render("register.pug", { message: "You are successfully registred!" });
});

app.get("/verify/:token", async (req, res) => {
  if (!req.params.token) {
    res.status(400);
  }
  const token = await Token.findOne({ token: req.params.token });
  if (!token) {
    res.send("There isn't any token.");
  }
  const user = await User.findOne({ email: token.userEmail });
  user.verified = true;
  await user.save();
  await token.remove();
  res.render("index.pug", { message: "You are successfully verified!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
