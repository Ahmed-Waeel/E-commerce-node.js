var mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: String,
    value: Number,
    percentage: {
        type: Boolean,
        default: false
    },
    expire: Date,
}, {timestamps: true});
  
module.exports = mongoose.model('Coupon', couponSchema);