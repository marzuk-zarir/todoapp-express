const mainRouter = require('express').Router()

mainRouter.get('/', (req, res) => {
    res.render('home', { title: 'Home', message: 'Hello world' })
})

module.exports = mainRouter
