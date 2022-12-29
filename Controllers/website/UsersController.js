// Dependencies
const { cloudinary } = require('./../../helpers/imageUploader')
const User = require('./../../Models/user')

// Show the Logged in User Profile
const profile = (req, res) => {
    const auth_user = req.user

    return res.status(200).send({
        code: 200,
        success: true,
        message: "User data",
        payload: {
            user: auth_user
        }
    })
}

// Update the logged in user Profile
const update = async (req, res) => {
    const auth_user = req.user
    const { name, email, photo } = req.body
    let photo_url = false

    const duplicated_user = await User.findOne({ email: email, _id: { $ne: auth_user._id } })
    if (duplicated_user) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "This Email Has Been Taken Before"
        })
    }

    if (photo) {
        await cloudinary.uploader.upload(
            photo,
            { public_id: `users/${email.split('@')[0]}`}, 
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

    await User.updateOne({ '_id': auth_user._id }, {
        name: name,
        email: email.toLowerCase(),
        photo: photo_url || ''
    });

    auth_user.name = name
    auth_user.email = email
    auth_user.photo = photo_url || ''
    return res.status(200).send({
        code: 200,
        success: true,
        message: "Profile Updated Successfully",
        payload: {
            user: auth_user
        }
    })
}

// Export the Fuctions
module.exports = { profile, update }