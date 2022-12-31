const app = require('express')
const router = app.Router()
const { show, update } = require('./../../Controllers/dashboard/AdminProfileController')
const { mustBeAdmin } = require('./../../Middlewares/authenticatedAdmin')

router.get('/', mustBeAdmin, show)

router.put('/update', mustBeAdmin, update)

module.exports = router