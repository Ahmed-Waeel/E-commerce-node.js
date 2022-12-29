const app = require('express')
const router = app.Router()
const { add, remove } = require('./../../Controllers/dashboard/InventoryController')
const { mustBeAdmin } = require('./../../Middlewares/authenticatedAdmin')

router.post('/add', mustBeAdmin, add)

router.post('/remove', mustBeAdmin, remove)

module.exports = router
