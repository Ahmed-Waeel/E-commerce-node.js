const app = require('express')
const router = app.Router()
const {index, show, store, update, destroy } = require('./../../Controllers/dashboard/AdminsController')
const { mustBeSuperAdmin } = require('./../../Middlewares/authenticatedSuperAdmin')

router.get('/', mustBeSuperAdmin, index)

router.get('/admin/:admin_id', mustBeSuperAdmin, show)

router.post('/store', mustBeSuperAdmin, store)

router.put('/update', mustBeSuperAdmin, update)

router.get('/delete/:admin_id', mustBeSuperAdmin, destroy)

module.exports = router
