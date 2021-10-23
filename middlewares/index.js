const express = require('express')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const flash = require('connect-flash')
const session = require('./session')
const setLocals = require('./setLocals')
const { checkToken } = require('./auth')

function setMiddlewares(app) {
    const middlewares = [
        express.urlencoded({ extended: true }),
        express.json(),
        cookieParser(process.env.COOKIE_SECRET, {
            httpOnly: true,
            signed: true,
            maxAge: +process.env.JWT_EXPIRE
        }),
        csurf({ cookie: true }),
        session,
        flash(),
        checkToken,
        setLocals
    ]
    app.use(middlewares)
}

module.exports = setMiddlewares
