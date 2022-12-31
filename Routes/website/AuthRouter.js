const app = require('express')
const router = app.Router()
const { login, register } = require('./../../Controllers/website/AuthController')
const { forgetPassword, resetPassword } = require('./../../Controllers/website/forgetPasswordController')
const { mustBeGuest } = require('./../../Middlewares/guestMiddleware')

router.post('/login', mustBeGuest, login);

router.post('/register', mustBeGuest, register);

router.post('/forget-password', mustBeGuest, forgetPassword);

router.post('/reset-password', mustBeGuest, resetPassword);

module.exports = router
