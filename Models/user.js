var mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: String,
  photo: String,
  email: String,
  password: String,
  banned: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: "user"
  },
  balance: {
    type: Number,
    default: 50000
  }
  }, {timestamps: true});

module.exports = mongoose.model('User', User);