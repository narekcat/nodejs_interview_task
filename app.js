const express = require('express');
const app = express();

const port = 8000;

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.post('/login', (req, res) => {

});

app.post('/register', (req, res) => {
  
});

app.put('/verify', (req, res) => {

})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});