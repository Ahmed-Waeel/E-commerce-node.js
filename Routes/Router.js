const express = require('express')
const router = express.Router()

const website = require('./website routes/website_router')
const dashboard = require('./dashboard routes/dashboard_router')

router.use(website)
router.use(dashboard)

module.exports = router
