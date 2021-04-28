const express = require('express')
const { authenticateToken } = require('../../middelware')
const {
  signUp, login, token, logout, testing,
} = require('./user')

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/login', login)
router.get('/', authenticateToken, testing)
router.post('/token', token)
router.delete('/logout', logout)

module.exports = router
