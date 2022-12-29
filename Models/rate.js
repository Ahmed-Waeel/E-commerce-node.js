var mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
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
    rate: Number
  }, {timestamps: true});
  
module.exports = mongoose.model('Rate', rateSchema);