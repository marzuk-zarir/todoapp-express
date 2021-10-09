const mainRouter = require('express').Router()
const Flash = require('../utils/Flash')

mainRouter.get('/', (req, res) => {
    console.log(res.locals.user.data)
    res.render('home', { title: 'Home', message: Flash.getMsg(req) })
})

module.exports = mainRouter
