const { param } = require('express-validator')
const User = require('../models/User')

module.exports = [
    param('username')
        .isLength({ min: 4, max: 12 })
        .isAlphanumeric('en-US', { ignore: '-_.' })
        .custom(async (username) => {
            try {
                const existingUser = await User.findOne({ username })
                if (!existingUser) {
                    return Promise.reject()
                }
                return true
            } catch (err) {
                next(err)
            }
        })
]
