// Dependencies
const Cart = require('./../../Models/cart')
const Inventory = require('./../../Models/inventory')

// Helper Function
const checkQuantity = async (product_id, quantity) => {
    const products = await Inventory.find({ product_id: product_id })

    const in_stock = products.reduce((a, b) => a + b.quantity, 0)

    return {
        in_stock: in_stock,
        enough: quantity <= in_stock
    }
}

// Get All User Cart Items
const index = async (req, res) => {
    const auth_user = req.user

    const cart_items = await Cart.find({ user_id: auth_user._id })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "All Cart Items",
        payload: {
            user: auth_user,
            items: cart_items
        }
    })
}

const store = async (req, res) => {
    const auth_user = req.user
    const { product_id, quantity } = req.body

    const check_result = await checkQuantity(product_id, quantity) 

    if (!check_result.in_stock) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Product out of stock"
        })
    }

    const new_item = new Cart({
        user_id: auth_user._id,
        product_id: product_id,
        quantity: check_result.enough ? quantity : check_result.in_stock
    })

    await new_item.save()

    return res.status(201).send({
        code: 201,
        success: true,
        message: "Item Saved in Cart",
        payload: {
            user: auth_user,
            item: new_item,
            enough: check_result.enough,
            in_stock: check_result.in_stock
        }
    })
}

const update = async (req, res) => {
    const auth_user = req.user
    const { item_id, quantity } = req.body

    const item = await Cart.findOne({ _id: item_id })

    if (!item) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "item Not Found"
        })
    }

    const check_result = await checkQuantity(item.product_id, quantity)

    await Cart.updateOne({ _id: item_id }, { quantity: check_result.enough? quantity : check_result.in_stock })

    
    res.status(200).send({
        code: 200,
        success: true,
        message: "Item Quantity Updated",
        payload: {
            user: auth_user,
            item: item,
            enough: check_result.enough,
            in_stock: check_result.in_stock
        }
    })
}

const destroy = async (req, res) => {
    const auth_user = req.user
    const { item_id } = req.query

    const deleted_item = await Cart.findOne({ _id: item_id })
    await Cart.deleteOne({ _id: item_id })

    res.status(200).send({
        code: 200,
        success: true,
        message: "Cart Item Deleted Successfully",
        payload: {
            user: auth_user,
            deleted_item: deleted_item
        }
    })
}

module.exports = {
    index, store, update, destroy
}