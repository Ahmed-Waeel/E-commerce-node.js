const app = require('express')
const router = app.Router()
const { index, show, updateStatus } = require('./../../Controllers/dashboard/OrdersController')
const { mustBeAdmin } = require('./../../Middlewares/authenticatedAdmin')

router.get('/', mustBeAdmin, index)

router.get('/order/:order_id', mustBeAdmin, show)

router.post('/order/status', mustBeAdmin, updateStatus)

module.exports = router
