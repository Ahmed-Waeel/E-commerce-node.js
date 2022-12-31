const app = require('express')
const router = app.Router()
const { index, show, store, update, expire, destroy } = require('./../../Controllers/dashboard/CouponsController')
const { mustBeAdmin } = require('./../../Middlewares/authenticatedAdmin')

router.get('/', mustBeAdmin, index)

router.get('/coupon/:coupon_id', mustBeAdmin, show)

router.post('/store', mustBeAdmin, store)

router.put('/update', mustBeAdmin, update)

router.get('/expire/:coupon_id', mustBeAdmin, expire)

router.delete('/delete/:coupon_id', mustBeAdmin, destroy)

module.exports = router
