// Dependencies
const { cloudinary } = require('./../../helpers/imageUploader')
const Product = require('../../Models/product')
const Cart = require('../../Models/cart')


// Get All Products
const index = async (req, res) => {
    const auth_admin = req.admin
    const products = await Product.find()

    res.status(200).send({
        code: 200,
        success: true,
        message: "All Products",
        payload: {
            admin: auth_admin,
            products: products
        }
    })
}

// Get Some Product with its Id
const show = async (req, res) => {
    const auth_admin = req.admin
    const { product_id } = req.query
    const product_data = await Product.findOne({ '_id': product_id })

    if (!product_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Product Not Found"
        })
    }

    return res.status(200).send({
        code: 200,
        success: true,
        message: "single Product",
        payload: {
            admin: auth_admin,
            Product: product_data
        }
    })

}

// Store New Product
const store = async (req, res) => {
    const auth_admin = req.admin
    const { title, price, description, image } = req.body
    let image_url = false

    if (image) {
        await cloudinary.uploader.upload(
            image,
            { public_id: `products/${title}-${(Math.random() + 1).toString(36).substring(10)}`}, 
            (err, result) => {
                if (err) return
                image_url = result.secure_url
            }
        );
    }

    if (image && !image_url) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Can't Upload the Image due to error... please try again later"
        })
    }

    const new_product = new Product({
        title: title,
        price: price,
        description: description,
        image: image_url || ''
    })

    await new_product.save()

    res.status(201).send({
        code: 201,
        success: true,
        message: "Product Saved Successfully",
        payload: {
            admin: auth_admin,
            Product: new_product
        }
    })
}

// Update Some Product with its ID
const update = async (req, res) => {
    const auth_admin = req.admin
    const { product_id, title, price, description, image } = req.body
    let image_url = false
    const product_data = await Product.find({ _id: product_id })

    if (!product_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Product Not Found"
        })
    }

    if (image) {
        await cloudinary.uploader.upload(
            image,
            { public_id: `products/${product_id}`}, 
            (err, result) => {
                if (err) return
                image_url = result.secure_url
            }
        );
    }

    if (image && !image_url) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Can't Upload the Image due to error... please try again later"
        })
    }

    await Product.updateOne({ _id: product_id }, {
        title: title,
        price: price,
        description: description,
        image: image_url || ''
    })

    product_data.title = title
    product_data.price = price
    product_data.description = description
    product_data.image = image_url || ''

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Product Updated Successfully",
        payload: {
            admin: auth_admin,
            product: product_data
        }
    })
}

// Remove Some Product With its ID
const destroy = async (req, res) => {
    const auth_admin = req.admin
    const { product_id } = req.body
    const product_data = await Product.find({ _id: product_id })

    if (!product_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Product Not Found"
        })
    }

    await Cart.deleteMany({product_id: product_id})
    await Product.deleteOne({ _id: product_id })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Product Deleted Successfully",
        payload: {
            admin: auth_admin,
            deleted_product: product_data
        }
    })
}


// Export the Functions
module.exports = {
    index, show, store, update, destroy
}