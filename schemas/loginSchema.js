const { body } = require('express-validator')

module.exports = [
    body('username').trim().notEmpty().withMessage('Username should not empty'),
    body('password').notEmpty().withMessage('Password should not empty')
]
