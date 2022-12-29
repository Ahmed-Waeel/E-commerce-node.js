const router = require('express').Router()
const { profile, update } = require('./../../Controllers/website/UsersController')
const { mustBeAuthenticated } = require('../../Middlewares/authenticatedUser')

// Get User By Id
router.get('/profile', mustBeAuthenticated,  profile);

// Update User
router.post('/update', mustBeAuthenticated, update);

module.exports = router
