const app = require('express')
const router = app.Router()

const adminRoutes = require('./AdminsRouter');
const adminProfileRoutes = require('./AdminsProfileRouter');
const authRoutes = require('./AuthRouter');
const couponRoutes = require('./CouponsRouter');
const inventoryRoutes = require('./InventoryRouter');
const orderRoutes = require('./OrdersRouter');
const productRoutes = require('./ProductsRouter');
const userRoutes = require('./UsersRouter');

router.use('/admin', adminRoutes)
router.use('/admin/profile', adminProfileRoutes)
router.use('/admin', authRoutes)
router.use('/admin/coupons', couponRoutes)
router.use('/admin/inventory', inventoryRoutes)
router.use('/admin/orders', orderRoutes)
router.use('/admin/products', productRoutes)
router.use('/admin/users', userRoutes)

module.exports = router