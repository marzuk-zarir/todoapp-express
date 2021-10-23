const { body, query } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.jwtValidationSchema = [
    query('id')
        .notEmpty()
        .isMongoId()
        .custom(async (id, { req }) => {
            try {
                const user = await User.findById(id)
                if (!user) return Promise.reject()
                req.oldPassword = user.password
                return true
            } catch (err) {
                next(err)
            }
        }),

    query('reset_password_token')
        .notEmpty()
        .isJWT()
        .custom(async (token, { req }) => {
            try {
                const verifyToken = await jwt.verify(
                    token,
                    process.env.JWT_SECRET + req.oldPassword
                )
                req.verifiedUserPayload = verifyToken
                return true
            } catch (err) {
                if (
                    err.name === 'JsonWebTokenError' ||
                    err.name === 'TokenExpiredError'
                ) {
                    return Promise.reject()
                }
                next(err)
            }
        })
]

exports.postValidationSchema = [
    body('password')
        .isLength({ min: 7, max: 20 })
        .withMessage('Password should be between 7-20 characters'),

    body('confirm_password')
        .custom((confirmPass, { req }) => {
            if (confirmPass !== req.body.password) {
                throw Error()
            }
            return true
        })
        .withMessage('Password confirmation does not match with password')
]
