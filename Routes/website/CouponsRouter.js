const app = require('express')
const router = app.Router()
const { mustBeAuthenticated } = require('./../../Middlewares/authenticatedUser')
const { randomCoupon } = require('./../../Controllers/website/CouponsController')

router.get('/random-coupon', mustBeAuthenticated, randomCoupon)

module.exports = router
