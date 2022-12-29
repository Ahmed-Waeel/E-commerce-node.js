const app = require('express')
const router = app.Router()

const authRoutes = require('./AuthRouter');
const userRoutes = require('./UsersRouter');
const productRoutes = require('./ProductsRouter');
const cartRoutes = require('./CartsRourter');
const rateRoutes = require('./RatesRouter');
const couponRoutes = require('./CouponsRouter');
const orderRoutes = require('./OrdersRouter');

router.use('/', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/carts', cartRoutes)
router.use('/rates', rateRoutes)
router.use('/coupons', couponRoutes)
router.use('/orders', orderRoutes)

module.exports = router