const { body } = require('express-validator')

module.exports = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Please enter your username')
        .isLength({ min: 4, max: 12 })
        .withMessage('Username should be between 4-12 characters')
        .isAlphanumeric('en-US', { ignore: '-_.' })
        .withMessage(
            'Username can contain any letters from a to z and any numbers from 0 through 9, including . (period) - (hyphen or dash) _ (underscore)'
        ),
    body('email')
        .isEmail()
        .withMessage('Please enter your valid email address')
        .normalizeEmail()
]
