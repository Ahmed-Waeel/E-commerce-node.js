var mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);