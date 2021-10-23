const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.checkToken = async (req, res, next) => {
    try {
        const userData = await jwt.verify(
            req.signedCookies[process.env.JWT_TOKEN_NAME],
            process.env.JWT_SECRET
        )
        res.locals.user = {
            data: userData,
            isLoggedIn: true,
            fetch: false,
            error: null
        }
        next()
    } catch (err) {
        const localsUser = {
            data: null,
            isLoggedIn: false,
            fetch: false
        }
        if (err.name === 'JsonWebTokenError') {
            localsUser.error = 'Invalid token id. Please login again'
            res.locals.user = localsUser
            return next()
        }
        if (err.name === 'TokenExpiredError') {
            localsUser.error = 'Your session expired. Please login again'
            res.locals.user = localsUser
            return next()
        }
        next(err)
    }
}

exports.requireAuth = async (req, res, next) => {
    try {
        const user = res.locals.user
        if (!user.isLoggedIn) {
            req.flash('error', user.error)
            return res.redirect('/auth/login')
        }
        res.locals.user = {
            data: await User.findById(user.data.id, '-password -email -__v'),
            isLoggedIn: true,
            fetch: true,
            error: null
        }
        next()
    } catch (err) {
        next(err)
    }
}

exports.requireUnAuth = (req, res, next) => {
    if (res.locals.user.isLoggedIn) {
        req.flash('success', 'You are already logged in')
        return res.redirect(`/todo/${res.locals.user.data.username}`)
    }
    next()
}
