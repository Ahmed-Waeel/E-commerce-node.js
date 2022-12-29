const Coupon = require('./../../Models/coupon')

const index = async (req, res) => {
    const coupons = await Coupon.find()

    return res.status(200).send({
        code: 200,
        success: true,
        message: "All Coupons",
        payload: {
            admin: req.admin,
            coupons: coupons
        }
    })
}

const show = async (req, res) => {
    const { coupon_id } = req.query

    const coupon_data = await Coupon.findOne({ _id: coupon_id })

    if (!coupon_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Coupon Not Found"
        })
    }

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Singl Coupon",
        payload: {
            admin: req.admin,
            coupon: coupon_data
        }
    })
}

const store = async (req, res) => {
    const { code, value, percentage, expire } = req.body

    const old_coupon = await Coupon.findOne({ code: code })
    if (old_coupon) { 
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Coupon Code Already Exists"
        })
    }

    const new_coupon = new Coupon({
        code: code,
        value: value,
        percentage: percentage ?? false,
        expire: typeof expire == Date ? expire : new Date(expire)
    })

    await new_coupon.save()

    return res.status(201).send({
        code: 201,
        success: true,
        message: "Coupon created Successfully",
        payload: {
            admin: req.admin,
            coupon: new_coupon
        }
    })
}

const update = async (req, res) => {
    const { coupon_id, code, value, percentage, expire } = req.body

    const old_coupon = await Coupon.findOne({code: code, _id: {$ne : coupon_id} })
    if (old_coupon) { 
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Coupon Code Already Exists"
        })
    }
    const coupon_data = await Coupon.findOne({ _id: coupon_id })
    if (!coupon_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Coupon Not Found",
        })
    }

    coupon_data.code = code;
    coupon_data.value = value;
    coupon_data.percentage = percentage ?? false,
    coupon_data.expire = typeof expire == Date ? expire : new Date(expire);
    await Coupon.updateOne({_id: coupon_id}, {
        code: code,
        value: value,
        percentage: percentage ?? false,
        expire: typeof expire == Date ? expire : new Date(expire)
    }).save()

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Coupon Updateed Successfully",
        payload: {
            admin: req.admin,
            coupon: coupon_data
        }
    })
}

const destroy = async (req, res) => {
    const { coupon_id } = req.query

    const coupon_data = await Coupon.findOne({ _id: coupon_id })
    
    if (!coupon_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Coupon Not Found",
        })
    }

    await Coupon.deleteOne({ _id: coupon_id })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Coupon Deleted Successfully",
        payload: {
            admin: req.admin,
            deleted_coupon: coupon_data
        }
    })
}

const expire = async (req, res) => {
    const { coupon_id } = req.query

    const coupon_data = await Coupon.findOne({ _id: coupon_id })

    if (!coupon_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Coupon Not Found"
        })
    }

    const now = Date.now()
    await Coupon.updateOne({ _id: coupon_id }, { expire: now })

    coupon_data.expire = now
    return res.status(200).send({
        code: 200,
        success: true,
        message: "Coupon Expired",
        payload: {
            admin: req.admin,
            coupon: coupon_data
        }
    })
}

module.exports = {
    index, show, store, update, destroy, expire
}