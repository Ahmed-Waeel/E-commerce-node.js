const Order = require('./../../Models/order')
const User = require('./../../Models/user')
const Product = require('./../../Models/product')
const Coupon = require('./../../Models/coupon')
const usersCoupons = require('./../../Models/users_coupons')
const Inventory = require('../../Models/inventory')

const checkQuantity = async (product_id, quantity) => {
    const products = await Inventory.find({ product_id: product_id })

    const in_stock = products.reduce((a, b) => a + b.quantity, 0)

    return {
        in_stock: in_stock,
        enough: quantity <= in_stock
    }
}

// Get All Logged User Orders
const index = async (req, res) => {
    const auth_user = req.user

    const orders = await Order.find({ user_id: auth_user._id })
    
    return res.status(200).send({
        code: 200,
        success: true,
        message: "All Authenticated User Orders",
        payload: {
            user: auth_user,
            orders: orders
        }
    })
}

// Get the Info About Some Order with its Id
const show = async (req, res) => {
    const auth_user = req.user 
    const order_data = await Order.findOne({ _id: req.query.order_id })

    if (!order_data) {
        return res.send(400).send({
            code: 400,
            success: false,
            messsage: "Order Not Found"
        })
    }

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Order Data",
        payload: {
            user: auth_user,
            order: order_data
        }
    })
}

// Make New Order
const store = async (req, res) => {
    const auth_user = req.user
    const { product_id, quantity, coupon_code } = req.body

    const product_data = await Product.findOne({ _id: product_id })

    if (!product_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Product Not Found .. it might be deleted"
        })
    }

    const check_result = await checkQuantity(product_id, quantity) 

    if (!check_result.in_stock) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Product out of stock"
        })
    }

    const cost = product_data.price * quantity

    var after_discount = cost
    if (coupon_code) { 
        var coupon_data = await Coupon.findOne({ code: coupon_code })

        // if coupon used before
        const isUsedCoupon = await usersCoupons.findOne({user_id: auth_user._id, coupon_id: coupon_data._id}).length
        if (isUsedCoupon) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "User Used this Coupon Before"
            })
        }

        // if expired coupon
        if (coupon_data.expire < Date.now()) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "Expired Coupon"
            })
        }

        const percentage = coupon_data.percentage
        const value = coupon_data.value
        if (percentage) {
            after_discount = Math.max(cost - (cost * value / 100), 0)
        } else {
            after_discount = Math.max(cost - value, 0)
        }

        const coupon_usage = new usersCoupons({
            user_id: auth_user._id,
            coupon_id: coupon_data._id
        })
        await coupon_usage.save()
    }

    // if balance not enough 
    if (auth_user.balance < after_discount) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Not Enough Balance"
        })
    }

    await User.updateOne({_id: auth_user._id}, {balance: auth_user.balance - after_discount})
    await new Inventory({
        product_id: product_id,
        quantity: -quantity
    }).save()

    const new_order = new Order({
        user_id: auth_user._id,
        product_id: product_id,
        quantity: quantity ?? 1,
        cost: cost,
        coupon_id: coupon_data._id,
        coupon_code: coupon_code,
        after_discount: Math.min(after_discount, cost)
    }) 
    await new_order.save()



    return res.status(201).send({
        code: 201,
        success: true,
        message: "Order Created Successfully",
        payload: {
            user: auth_user,
            order: new_order
        }
    })
}

// Cancel An Order with its Id
const destroy = async (req, res) => {
    const auth_user = req.user
    const { order_id } = req.query

    const order_data = await Order.findOne({ _id: order_id })
    if (!order_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Order Not Found",
        })
    }

    await Order.deleteOne({ _id: order_id })

    await User.updateOne({_id: auth_user._id}, {balance: auth_user.balance + order_data.after_discount})
    await new Inventory({
        product_id: order_data.product_id,
        quantity: -(order_data.quantity)
    }).save()

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Ordered Cancelled successfully and Money turned Back to your Balance",
        payload: {
            user: auth_user,
            order: order_data
        }
    })
}

// Export the Functions
module.exports = { index, show, store, destroy }