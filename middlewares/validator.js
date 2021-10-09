const { body } = require('express-validator')
const User = require('../models/User')

// Validate signup form data
module.exports.validateSignup = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username should not empty')
        .isLength({ min: 4, max: 12 })
        .withMessage('Username must contains between 4 and 12 characters')
        .isAlphanumeric()
        .withMessage('Username must contains only alphanumeric(a-z)(0-9) characters')
        .custom(async (username) => {
            const user = await User.findOne({ username })
            console.log(user)
            if (user) {
                return Promise.reject()
            }
            return true
        })
        .withMessage('Username is already taken'),

    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password should not be empty')
        .isLength({ min: 7, max: 20 })
        .withMessage('Password must contains between 7 and 20 characters'),

    body('cpassword')
        .custom((cpassword, { req }) => {
            if (cpassword !== req.body.password) {
                throw Error()
            }
            return true
        })
        .withMessage('Password confirmation does not match password'),

    body('terms').equals('on').withMessage('Terms and condition must required')
]

// Validate login form data
module.exports.validateLogin = [
    body('username').trim().notEmpty().withMessage('Username should not empty'),
    body('password').notEmpty().withMessage('Password should not empty')
]
