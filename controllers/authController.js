const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const Flash = require('../utils/Flash')

// Render signup page
exports.getSignupHandler = (req, res, next) => {
    res.render('pages/signup', {
        title: 'Signup',
        values: {},
        errors: {},
        message: null
    })
}

// Signup form handler
exports.postSignupHandler = async (req, res, next) => {
    const { username, email, password, terms } = req.body
    const errors = validationResult(req).formatWith(({ msg }) => msg)

    if (!errors.isEmpty()) {
        req.flash('error', 'Please try again with valid information')
        return res.render('pages/signup', {
            title: 'Signup',
            values: { username, email, password, terms },
            errors: errors.mapped(),
            message: Flash.getMsg(req)
        })
    }

    try {
        const newUser = new User({ username, email, password })
        await newUser.save()
        req.flash('success', 'User is created successfully')
        res.render('pages/login', {
            title: 'Login',
            values: { username },
            errors: {},
            message: Flash.getMsg(req)
        })
    } catch (err) {
        next(err)
    }
}

// Render login page
exports.getLoginHandler = (req, res, next) => {
    res.render('pages/login', {
        title: 'Login',
        values: {},
        errors: {},
        message: Flash.getMsg(req)
    })
}

// Login form handler
exports.postLoginHandler = async (req, res, next) => {
    const { username, password, remember } = req.body
    const errors = validationResult(req).formatWith(({ msg }) => msg)

    if (!errors.isEmpty()) {
        req.flash('error', 'Please provide valid information')
        return res.render('pages/login', {
            title: 'Login',
            values: { username },
            errors: errors.mapped(),
            message: Flash.getMsg(req)
        })
    }

    try {
        const user = await User.findOne({ username })
        if (!user) {
            req.flash('error', 'Invalid Credentials')
            return res.render('pages/login', {
                title: 'Login',
                values: { username },
                errors: { username: 'Invalid Credentials' },
                message: Flash.getMsg(req)
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            req.flash('error', 'Invalid Credentials')
            return res.render('pages/login', {
                title: 'Login',
                values: { username },
                errors: { password: 'Invalid Credentials' },
                message: Flash.getMsg(req)
            })
        }

        const token = await jwt.sign({ username, id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        })
        const cookieOptions = {
            httpOnly: true,
            signed: true
        }

        if (remember === 'on') {
            cookieOptions.maxAge = +process.env.JWT_EXPIRE
        }

        res.cookie(process.env.JWT_TOKEN_NAME, token, cookieOptions)
        req.flash('success', 'You are logged in successfully')
        res.redirect(`/todo/${username}`)
    } catch (err) {
        next(err)
    }
}

// Logout form handler
exports.postLogoutHandler = (req, res, next) => {
    res.clearCookie(process.env.JWT_TOKEN_NAME)
    req.flash('success', 'Log out successful')
    res.redirect('/')
}
