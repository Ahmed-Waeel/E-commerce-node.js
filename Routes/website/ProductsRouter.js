const router = require('express').Router()
const { index, show } = require('./../../Controllers/website/ProductsController')

// Get All products  
router.get('/', index);

// Get Product By Id
router.get('/product/:product_id', show);

module.exports = router
