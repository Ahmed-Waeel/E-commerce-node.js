var mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        index: true,
        required: true
    },
    quantity: Number
}, {timestamps: true});
  
module.exports = mongoose.model('Inventory', inventorySchema);