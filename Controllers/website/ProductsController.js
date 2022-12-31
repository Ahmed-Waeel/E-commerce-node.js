// Dependencies
const Product = require('../../Models/product')
const Inventory = require('../../Models/inventory')

const checkQuantity = async (product_id, quantity) => {
    const products = await Inventory.find({ product_id: product_id })

    const in_stock = products.reduce((a, b) => a + b.quantity, 0)

    return {
        in_stock: in_stock,
        enough: quantity <= in_stock
    }
}

// Get All Products
const index = async (req, res) => {
    const products = await Product.find();

    products.forEach(async (product_data) => {
        product_data.quantity = (await checkQuantity(product_data._id, 0)).in_stock
    })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "All Products",
        payload: {
            products: products
        }
    })
}

// Get Some Product with its Id
const show = async (req, res) => {
    const product_id = req.query.product_id

    const product_data = await Product.findOne({ '_id': product_id })

    if (!product_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Product Not Found ... it Might be deleted by admins"
        })
    }

    product_data.quantity = (await checkQuantity(product_id, 0)).in_stock

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Single Product",
        payload: {
            product: product_data
        }
    })
}

// Export the Functions
module.exports = {index, show }