var mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
}, {timestamps: true});
  
module.exports = mongoose.model('Product', productSchema);