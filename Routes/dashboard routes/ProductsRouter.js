const app = require('express')
const router = app.Router()
const { index, show, store , update, destroy } = require('./../../Controllers/dashboard/ProductsController')
const { mustBeAdmin } = require('./../../Middlewares/authenticatedAdmin')

router.get('/', mustBeAdmin, index)

router.get('/product/:product_id', mustBeAdmin, show)

router.post('/store', mustBeAdmin, store)

router.put('/update', mustBeAdmin, update)

router.delete('/delete/:product_id', mustBeAdmin, destroy)

module.exports = router
