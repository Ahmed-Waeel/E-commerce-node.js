const Admin = require('./../../Models/admin')
const bcrypt = require('bcrypt');

const hash = async (str) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(str, salt)
}

const index = async(req, res) => {
    const admins = await Admin.find()

    res.status(200).send({
        code: 200,
        success: true,
        message: "ALl Admins",
        payload: {
            admin: req.admin,
            admins: admins
        }
    })
}

const show = async (req, res) => {
    const { admin_id } = req.query
    const admin_data = await Admin.find({ _id: admin_id })
    
    if (!admin_data) {
        return res.status(404).send({
            code: 404,
            success: false, 
            message: "Admin Not Found"
        })
    }

   return res.status(200).send({
        code: 200,
        success: true,
        message: "Single Admin",
        payload: {
            admin: admin_data,
        }
    })
}

const store = async(req, res) => {
    const { name, email, password, role } = req.body

    const exist_admin = await Admin.findOne({ email: email.toLowerCase() })

    if (exist_admin) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "This Email has been Taken Before"
        });
    } 

    const hashed_password = await hash(password)
    const new_admin = new User({
        name: name,
        email: email.toLowerCase(),
        password: hashed_password,
        role: role
    });
    await new_admin.save();

    new_admin.password = undefined;

    return res.status(201).send({
        code: 201,
        success: true,
        message: "Admin Created Successfully",
        payload: {
            new_admin: new_admin
        }
    })
}

const update = async (req, res) => {
    const { name, email, password, role } = req.body
    let {  admin_id, } = req.body
    
    
    if (!admin_id) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Missing The Admin id"
        })
    }

    const old_admin = await Admin.findOne({ email: email, _id: { $ne: admin_id } })
    if (old_admin) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Email already exists"
        })
    }

    const admin_data = await Admin.findOne({ _id: admin_id })
    if (!admin_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "admin Not Found",
        })
    }

    const hashed_password = await hash(password)
    admin_data.name = name
    admin_data.email = email
    admin_data.password = hashed_password
    admin_data.role = role ?? 0
    await Admin.updateOne({_id: admin_id}, {
        name: name,
        email: email,
        password: hashed_password,
        role: role ?? 0
    }).save()

    return res.status(200).send({
        code: 200,
        success: true,
        message: "admin Profile Updateed Successfully",
        payload: {
            admin: admin_data
        }
    })

}

const destroy = async(req, res) => {
    const { admin_id } = req.query

    const admin_data = await Coupon.findOne({ _id: admin_id })
    
    if (!admin_data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Admin Not Found",
        })
    }

    await Admin.deleteOne({ _id: admin_id })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "Admin Deleted Successfully",
        payload: {
            admin: req.admin,
            deleted_admin: admin_data
        }
    })
}

module.exports = {
    index, show, store, update, destroy
}