const authRouter = require('express').Router()
const {
    getSignupHandler,
    postSignupHandler,
    getLoginHandler,
    postLoginHandler,
    postLogoutHandler
} = require('../controllers/authController')
const { requireUnAuth, requireAuth } = require('../middlewares/auth')
const loginSchema = require('../schemas/loginSchema')
const signupSchema = require('../schemas/signupSchema')

authRouter.get('/signup', requireUnAuth, getSignupHandler)
authRouter.post('/signup', requireUnAuth, signupSchema, postSignupHandler)
authRouter.get('/login', requireUnAuth, getLoginHandler)
authRouter.post('/login', requireUnAuth, loginSchema, postLoginHandler)
authRouter.post('/logout', requireAuth, postLogoutHandler)

module.exports = authRouter
