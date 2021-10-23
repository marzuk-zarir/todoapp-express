const todoRouter = require('express').Router()
const {
    getNewTodo,
    postNewTodo,
    getUserTodo,
    postRemoveTodo,
    getUpdateTodo,
    postUpdateTodo
} = require('../controllers/todoController')
const {
    createTodoSchema,
    removeTodoSchema,
    updateTodoSchema
} = require('../schemas/todoSchema')
const userSchema = require('../schemas/userSchema')

todoRouter.get('/new', getNewTodo)
todoRouter.post('/new', createTodoSchema, postNewTodo)
todoRouter.post('/remove', removeTodoSchema, postRemoveTodo)
todoRouter.get('/edit', updateTodoSchema, getUpdateTodo)
todoRouter.post('/edit', updateTodoSchema, createTodoSchema, postUpdateTodo)

todoRouter.get('/:username', userSchema, getUserTodo)

module.exports = todoRouter
