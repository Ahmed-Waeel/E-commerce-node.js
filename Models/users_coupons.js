var mongoose = require('mongoose');

const usersCouponsSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
      required: true
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupons",
      index: true,
      required: true
    },
  }, {timestamps: true});
  
module.exports = mongoose.model('usersCoupons', usersCouponsSchema);