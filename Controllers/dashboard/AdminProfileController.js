const { cloudinary } = require('./../../helpers/imageUploader')
const Admin = require('./../../Models/admin')

const show = async (req, res) => {
    const auth_admin = req.admin

   return res.status(200).send({
        code: 200,
        success: true,
        message: "Profile Data",
        payload: {
            admin: auth_admin,
        }
    })
}

const update = async (req, res) => {
    const auth_admin = req.admin
    const { name, email, photo } = req.body
    let photo_url = false

    const old_admin = await Admin.findOne({ email: email.toLowerCase(), _id: { $ne: auth_admin._id } })
    if (old_admin) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "This Email Token Before"
        })
    }

    if (photo) {
        await cloudinary.uploader.upload(
            photo,
            { public_id: `admins/${email.split('@')[0]}`}, 
            (err, result) => {
                if (err) return
                photo_url = result.secure_url
            }
        );
    }

    if (photo && !photo_url) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Can't Upload the Image due to error... please try again later"
        })
    }

    auth_admin.name = name
    auth_admin.email = email
    auth_admin.role = role ?? 0
    auth_admin.photo =  photo_url || ''
    await Admin.updateOne({_id: auth_admin._id}, {
        name: name,
        email: email.toLowerCase(),
        role: role ?? 0,
        photo: photo_url || ''
    })

    return res.status(200).send({
        code: 200,
        success: true,
        message: "admin Profile Updateed Successfully",
        payload: {
            admin: auth_admin
        }
    })

}

module.exports = {
    show, update
}