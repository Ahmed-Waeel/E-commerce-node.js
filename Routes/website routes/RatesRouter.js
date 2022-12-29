const app = require('express')
const router = app.Router()
const { getProductRate, getUserProductRate, store } = require('./../../Controllers/website/RatesController')
const { mustBeAuthenticated } = require('./../../Middlewares/authenticatedUser')

router.get('/:product_id', getProductRate)

router.get('/user/:product_id', mustBeAuthenticated, getUserProductRate)

router.post('/store', mustBeAuthenticated, store)

module.exports = router
