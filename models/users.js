const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true
  },
  password: String,
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);