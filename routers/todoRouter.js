const todoRouter = require('express').Router()
const Flash = require('../utils/Flash')

todoRouter.get('/user', (req, res) => {
    res.render('todo', {
        title: 'Todo',
        message: Flash.getMsg(req),
        errors: {}
    })
})

module.exports = todoRouter
