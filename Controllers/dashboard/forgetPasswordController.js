require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const Admin = require('./../../Models/admin')
const ResetPassword = require('./../../Models/reset_password')
const { generateToken, hash } = require('./../../Controllers/website/AuthController')
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});


const forgetPassword = async (req, res) => {
    const { email, base_url } = req.body

    const exist_admin = await Admin.findOne({ email: email }).select('-password')
    
    if (!exist_admin) {
        res.status(400).send({
            code: 400,
            success: false,
            message: "Email doesn't exist in our records"
        })
    }

    const token =  crypto.randomBytes(15).toString("hex")
    const reset_password = new ResetPassword({
        email: exist_admin.email,
        token: token,
        expire: Date.now() + 3600000
    })

    const reset_url = base_url + "/reset-password/" + token
    await reset_password.save()

    const mailData = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: `${exist_admin.email}`,
        subject: 'Reset Password',
        html: ` <h1> Hi ${exist_admin.name} </h1> <br>,
                <h3> There was a request to change your password! </h3> <br>
                
                <h3> If you did not make this request then please ignore this email.</h3> <br>
                
                <h3> Otherwise, please click this link to change your password: <a herf='`+ reset_url +`' >Click Here</a></h3> <br>

                <h5> the reset password link will expire after 1 hour from the time you recieved this mail.</h5>
        `,
    }

    transporter.sendMail(mailData, function (err) {
        if (err) {
            return res.status(400).send({
                code: 400,
                success: false,
                message: "Something went wrong... please try again later."
            })
        }

        return res.status(200).send({
            code: 200,
            success: true,
            message: "Check your Email, We have sent you reset password link",
            payload: {
                admin: exist_admin
            }
        })
    });
}

const resetPassword = async (req, res) => {
    const { token, new_password } = req.body

    const data = await ResetPassword.findOne({ token: token })
    if (!data) {
        return res.status(404).send({
            code: 404,
            success: false,
            message: "Not a Valid Token"
        })
    }

    if (data.expire < Date.now()) {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "Expired Token"
        })
    }

    const exist_admin = await Admin.findOne({ email: data.email }).select("-password")
    if (!exist_admin) {
        res.status(400).send({
            code: 400,
            success: false,
            message: "Something Went Wrong.... please try again later",
        })
    }

    await Admin.updateOne({email: data.email}, { password: await hash(new_password) })

    const authToken = await generateToken(exist_admin)
    return res.status(200).send({
        code: 200,
        success: true,
        message: "Password Changed Successfully and you have Logged in",
        payload:{
            token: authToken,
            admin: exist_admin
        }
    })
}

module.exports = {
    forgetPassword, resetPassword
}