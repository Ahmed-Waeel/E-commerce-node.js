const app = require('express')
const router = app.Router()
const { setStatus, userBalance } = require('./../../Controllers/dashboard/UsersController')
const { mustBeAdmin } = require('./../../Middlewares/authenticatedAdmin')

router.post('/status/', mustBeAdmin, setStatus)

router.post('/balance/', mustBeAdmin, userBalance)

module.exports = router
