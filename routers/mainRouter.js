const mainRouter = require('express').Router()
const Flash = require('../utils/Flash')

mainRouter.get('/', (req, res) => {
    res.render('pages/home', { title: 'Home', message: Flash.getMsg(req) })
})

module.exports = mainRouter
