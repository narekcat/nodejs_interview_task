const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    index: true
  },
  userEmail: String
});

module.exports = mongoose.model('Token', TokenSchema);