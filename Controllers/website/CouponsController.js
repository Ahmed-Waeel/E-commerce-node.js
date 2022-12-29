// Dependencies
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });
const Coupon = require('./../../Models/coupon')
const User = require('./../../Models/user')
const usersCoupons = require('./../../Models/users_coupons')

const randomCoupon = async (req, res) => {
    const auth_user = req.auth_user
    let random_coupon = {}
     let found = false

    Coupon.count().exec((_err, count) => {
        while (count--) {
            const random = Math.floor(Math.random() * count)
    
            Coupon.findOne().skip(random).exec(
                (_err, result) => {
                    random_coupon = result
                }
            )

            const coupon_usage = usersCoupons.findOne({ coupon_id: random_coupon._id })

            if (coupon_usage.user_id != auth_user._id) {
                found = true
            }
        }
    })

    if (found) {
        const mailData = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: `${auth_user.email}`,
            subject: 'Random Coupon',
            html: ` <h1> Hi ${auth_user.name} </h1> <br>,
                    <h3> There was a request to get a random coupon! </h3> <br>
                    
                    <h3> Coupon Code: ${random_coupon.code}</h3> <br>
                    <h3> Coupon expiration: ${new Date(random_coupon.expire)}</h3> <br>
                    
                    <h3> Otherwise, please click this link to change your password: <a herf='`+ reset_url +`' >Click Here</a></h3> <br>
    
                    <h4> 500 EGP has been deducted from your Balance for this Coupon </h4>
                    
                    <p> thanks, </p>
            `,
        }

        transporter.sendMail(mailData, async (err) => {
            if (err) {
                return res.status(400).send({
                    code: 400,
                    success: false,
                    message: "Something went wrong... please try again later."
                })
            }

            await User.updateOne({_id: auth_user._id}, {balance: auth_user.balance - 500})
            return res.status(200).send({
                code: 200,
                success: true,
                message: "Check your Email, We have sent you the Coupon",
            })
        });
    } else {
        return res.status(400).send({
            code: 400,
            success: false,
            message: "There's no available Coupons Right Now ... Please try again later"
        })
    }
}

// Export the Functions
module.exports = { randomCoupon }