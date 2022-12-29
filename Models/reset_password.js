var mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
    email: String,
    token: String,
    expire: Date,
  }, {timestamps: true});

module.exports = mongoose.model('ResetPassword', resetPasswordSchema);