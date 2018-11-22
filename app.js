const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/nodejs-interview-db');

const User = require('./models/users');

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.post('/login', (req, res) => {

});

app.get('/register', (req, res) => {
  res.render('register.pug', { });
})

app.post('/register', (req, res) => {
  if (!req.body.email) {
    res.send('The email is required');
  }
  if (!req.body.password) {
    res.send('The password is requried');
  }
  if (!req.body.confirm_password) {
    res.send('The password confirmation is required');
  }
  const email = req.body.email;
  let password = req.body.password;
  let passwordConfirm = req.body.confirm_password;
  if (password !== passwordConfirm) {
    res.send('The passwords doesn\'t match.');
  }
  const user = new User();
  user.email = email;
  user.password = bcrypt.hashSync(password, 10);
  user.save();
  res.render('register.pug', { message: 'You are successfully registred!'});
});

app.put('/verify', (req, res) => {

})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});