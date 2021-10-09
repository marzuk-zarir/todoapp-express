const session = require('express-session')
const MongoStore = require('connect-mongo')

const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: +process.env.SESSION_EXPIRE },
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        ttl: +process.env.SESSION_EXPIRE
    })
}

module.exports = session(sessionOptions)
