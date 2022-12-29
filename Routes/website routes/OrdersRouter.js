const app = require('express')
const router = app.Router()
const { index, show, store, destroy } = require('./../../Controllers/website/OrdersController')
const { mustBeAuthenticated } = require('./../../Middlewares/authenticatedUser')

router.get('/', mustBeAuthenticated, index)

router.get('/:order_id', mustBeAuthenticated, show)

router.post('/store', mustBeAuthenticated, store)

router.delete('/delete/:order_id', mustBeAuthenticated, destroy)

module.exports = router
