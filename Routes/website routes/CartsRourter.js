const app = require('express')
const router = app.Router()
const { mustBeAuthenticated } = require('./../../Middlewares/authenticatedUser')
const {  index, store, update, destroy } = require('./../../Controllers/website/CartsController')


router.get('/', mustBeAuthenticated, index)

router.post('/store', mustBeAuthenticated, store)

router.post('/update', mustBeAuthenticated, update)

router.get('/delete/:item_id', mustBeAuthenticated, destroy)

module.exports = router
