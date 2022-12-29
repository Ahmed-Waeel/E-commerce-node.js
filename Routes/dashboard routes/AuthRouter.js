const app = require('express')
const router = app.Router()
const { login } = require('./../../Controllers/dashboard/AuthController')
const { forgetPassword, resetPassword } = require('./../../Controllers/dashboard/forgetPasswordController')
const { mustBeGuest } = require('../../Middlewares/guestMiddleware')

router.post('/login', mustBeGuest, login);

router.post('/forget-password', mustBeGuest, forgetPassword);

router.post('/reset-password', mustBeGuest, resetPassword);

module.exports = router
