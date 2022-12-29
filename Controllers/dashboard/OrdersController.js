const Order = require('./../../Models/order')

const index = async (req, res) => {
    const orders = await Order.find()

    return res.status(200).send({
        code: 200,
        success: true,
        message: "All Orders",
        payload: {
            admin: req.admin,
            products: orders
        }
    })
}

const show = async (req, res) => {
    const { order_id } = req.query
    
    const order_data = await Order.find({ _id: order_id })
    
    if (!product_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Single Order",
            payload: {
                admin: req.admin,
                order: order_data
            }
        })
    }
}

const updateStatus = async (req, res) => {
    const { order_id, status } = req.body

    const order_data = await Order.findOne({ _id: order_id })

    if (!order_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Order Not Fount"
        })
    }

    await Order.updateOne({ _id: order_id }, { status: status })

    return res.status(200).send({
        code: 200, success: true, 
        message: "Order Status Updated Successfullty",
        payload: {
            admin: req.admin,
            deleted_order: order_data
        }
    })
}

module.exports = {
    index, show, updateStatus
}