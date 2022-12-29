var mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    photo: String,
    email: String,
    password: String,
    type: {
        type: String,
        default: "admin"
    },
    role: {
        type: Number,
        default: 0
    },
}, {timestamps: true} );
  
module.exports = mongoose.model('Admin', adminSchema);