// Dependencies
const Rate = require('./../../Models/rate')

// Store New Rate For Some Product With the Logged in User
const store = async (req, res) => {
    const { product_id, rate } = req.body
    const auth_user = req.user;

    const old_rate = await Rate.findOne({ user_id: auth_user._id, product_id: product_id });
    if (old_rate) {
        return res.status(200).send({
            code: 200,
            success: true,
            message: "Rate Updated Successfully",
            payload: {
                user: auth_user,
                rate: old_rate,
            }
        })
    }

    const rateObj = new Rate({
        'product_id': product_id,
        'user_id': auth_user._id,
        'rate': rate
    });

    await rateObj.save()
    return res.status(201).send({
        code: 201,
        success: true,
        message: "Rate Saved Successfully",
        payload: {
            user: auth_user,
            rate: rateObj
        }
    });
}

// Get the Final Rate of Some Product with its Id
const getProductRate = async (req, res) => {
    const product_id = req.query.product_id

    const rates = await Rate.find({ product_id: product_id })
    const rate = rates.reduce((a, b) => a + b.rate, 0);

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Total Rate of the product",
        payload: {
            rates: rates,
            rate: rate / rates.length
        }
    })
}

const getUserProductRate = async (req, res) => {
    const product_id = req.query.product_id
    const auth_user = req.user

    const rate = await Rate.findOne({ product_id: product_id, user_id: auth_user._id })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "User Rate on this product",
        payload: {
            user: req.user,
            rate: rate.rate,
        }
    })
}

// Export the Functions
module.exports = {
    store, getProductRate, getUserProductRate
}