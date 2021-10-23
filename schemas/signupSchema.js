const { body } = require('express-validator')
const User = require('../models/User')

module.exports = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username should not empty')
        .isLength({ min: 4, max: 12 })
        .withMessage('Username must contains between 4 and 12 characters')
        .isAlphanumeric('en-US', { ignore: '-_.' })
        .withMessage('Username must contains only alphanumeric(a-z)(0-9)(-_.) characters')
        .custom(async (username) => {
            const user = await User.findOne({ username })
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
