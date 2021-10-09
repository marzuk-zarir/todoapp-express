const authRouter = require('express').Router()
const {
    getSignupHandler,
    postSignupHandler,
    getLoginHandler,
    postLoginHandler,
    postLogoutHandler
} = require('../controllers/authController')
const { requireUnAuth, requireAuth } = require('../middlewares/auth')
const { validateSignup, validateLogin } = require('../middlewares/validator')

authRouter.get('/signup', requireUnAuth, getSignupHandler)
authRouter.post('/signup', requireUnAuth, validateSignup, postSignupHandler)
authRouter.get('/login', requireUnAuth, getLoginHandler)
authRouter.post('/login', requireUnAuth, validateLogin, postLoginHandler)
authRouter.post('/logout', requireAuth, postLogoutHandler)

module.exports = authRouter
