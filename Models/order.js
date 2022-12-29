var mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: true,
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    index: true,
    required: true
  },
  quantity: Number,
  cost: Number,
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coupons",
    required: false
  },
  after_discount: Number,
  Satus: Number,
}, {timestamps: true});
  
module.exports = mongoose.model('Order', orderSchema);