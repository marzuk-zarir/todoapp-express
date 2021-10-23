const path = require('path')
const nodemailer = require('nodemailer')
const ejs = require('ejs')
const { google } = require('googleapis')
const { validationResult } = require('express-validator')
const Flash = require('../utils/Flash')
const User = require('../models/User')

exports.getForgotPassword = (req, res, next) => {
    res.render('pages/forgot-password', {
        title: 'Forgot Password',
        values: {},
        errors: {},
        sendEmail: false,
        message: Flash.getMsg(req)
    })
}

exports.postForgotPassword = async (req, res, next) => {
    const { username, email, id, token } = req.resetPasswordUser
    const config = {
        domain: `${req.protocol}://${req.hostname}:${process.env.PORT || 3000}`,
        senderEmail: process.env.GMAIL_SENDER,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
    }
    const resetPasswordLink = `${config.domain}/account/reset-password?id=${id}&reset_password_token=${token}`

    // Receiver's email options
    const emailOptions = {
        from: `TodoApp team<${config.senderEmail}>`,
        to: email,
        subject: 'Reset Password',
        text: `
        Hello ${username},
        Reset password link ${resetPasswordLink}.
        If you don’t use this link within 5 minutes, it will expire.
        `
    }

    // Sender gmail oAuth object
    const oAuth2Client = new google.auth.OAuth2({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUrl
    })
    oAuth2Client.setCredentials({ refresh_token: config.refreshToken })

    try {
        // Generate new access token for auth
        const accessToken = await oAuth2Client.getAccessToken()

        // Ejs to html email template render
        const emailHtml = await ejs.renderFile(
            path.resolve(__dirname, '../templates/email.ejs'),
            {
                domain: config.domain,
                username: username.split(/[-_.]+/)[0],
                resetPasswordLink
            }
        )
        emailOptions.html = emailHtml

        // Nodemailer transport
        const transport = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: config.senderEmail,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                refreshToken: config.refreshToken,
                accessToken: accessToken
            }
        })
        await transport.sendMail(emailOptions)
        // @todo development test
        // await new Promise((resolve) => setTimeout(resolve, 5000))
        // console.log('\n' + resetPasswordLink)
        req.flash('success', 'Email sent successfully')
        res.render('pages/forgot-password', {
            title: 'Forgot Password',
            values: { username, email },
            errors: {},
            sendEmail: true,
            message: Flash.getMsg(req)
        })
    } catch (err) {
        next(err)
    }
}

exports.getResetPassword = (req, res, next) => {
    // As a 'Get' request there is no payload, so if error occur it should be jwt related error
    // If error than handover to not found handler
    const errors = validationResult(req).formatWith(({ msg }) => msg)
    if (!errors.isEmpty()) return next()
    res.render('pages/resetPassword', {
        title: 'Change Password',
        errors: {},
        values: {},
        message: Flash.getMsg(req)
    })
}

exports.postResetPassword = async (req, res, next) => {
    const { password, confirm_password } = req.body
    const userId = req.query.id
    const errors = validationResult(req).formatWith(({ msg, location }) => {
        return { msg, location }
    })
    const mappedError = errors.mapped()

    // If jwt related error than handover to not found handler
    for (let field in mappedError) {
        if (mappedError[field].location !== 'body') {
            return next()
        }
    }

    // Check request payload related errors
    if (!errors.isEmpty()) {
        req.flash('error', 'Please provide valid information')
        return res.render('pages/resetPassword', {
            title: 'Change Password',
            errors: mappedError,
            values: { password, confirm_password },
            message: Flash.getMsg(req)
        })
    }
    try {
        // Check old password is same with new password
        const isNewPasswordSame = await User.comparePassword(userId, password)
        if (isNewPasswordSame) {
            return res.render('pages/resetPassword', {
                title: 'Change Password',
                errors: {
                    error: 'Your new password cannot be the same as your current password'
                },
                values: { password, confirm_password },
                message: Flash.getMsg(req)
            })
        }

        // Update user password into our database and redirect to login route
        await User.updatePassword(userId, password)
        req.flash('success', 'Your password change successfully')
        res.redirect('/auth/login')
    } catch (err) {
        next(err)
    }
}
