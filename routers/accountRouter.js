const accountRouter = require('express').Router()
const {
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword
} = require('../controllers/accountController')
const forgotPasswordSchema = require('../schemas/forgotPasswordSchema')
const checkForgotPassword = require('../middlewares/checkForgotPassword')
const {
    jwtValidationSchema,
    postValidationSchema
} = require('../schemas/resetPasswordSchema')

accountRouter.get('/forgot-password', getForgotPassword)
accountRouter.post(
    '/forgot-password',
    forgotPasswordSchema,
    checkForgotPassword,
    postForgotPassword
)
accountRouter.get('/reset-password', jwtValidationSchema, getResetPassword)
accountRouter.post(
    '/reset-password',
    jwtValidationSchema,
    postValidationSchema,
    postResetPassword
)

module.exports = accountRouter
