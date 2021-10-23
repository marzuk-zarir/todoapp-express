const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Flash = require('../utils/Flash')

module.exports = async (req, res, next) => {
    const { username, email } = req.body
    const errors = validationResult(req).formatWith(({ msg }) => msg)

    if (!errors.isEmpty()) {
        req.flash('error', 'Please provide valid information')
        return res.render('pages/forgot-password', {
            title: 'Forgot Password',
            values: { username, email },
            errors: errors.mapped(),
            sendEmail: false,
            message: Flash.getMsg(req)
        })
    }

    try {
        const user = await User.findOne(
            { username, email },
            '-todos -createdAt -updatedAt -__v'
        )
        if (!user) {
            req.flash(
                'error',
                'Please provide username and email address which you used for signup'
            )
            return res.render('pages/forgot-password', {
                title: 'Forgot Password',
                values: { username, email },
                errors: { error: 'Username and email address is not match' },
                sendEmail: false,
                message: Flash.getMsg(req)
            })
        }

        const passwordSecret = process.env.JWT_SECRET + user.password
        const token = await jwt.sign(
            { username: user.username, email: user.email },
            passwordSecret,
            {
                expiresIn: '10m'
            }
        )
        req.resetPasswordUser = {
            id: user.id,
            token,
            username: user.username,
            email: user.email
        }
        next()
    } catch (err) {
        next(err)
    }
}
