const { validationResult } = require('express-validator')
const Todo = require('../models/Todo')
const User = require('../models/User')
const Flash = require('../utils/Flash')

// Render new todo page
exports.getNewTodo = (req, res, next) => {
    res.render('pages/newTodo', {
        title: 'Create Todo',
        heading: 'Create New Todo',
        errors: {},
        values: {},
        message: Flash.getMsg(req)
    })
}

// Submit new todo
exports.postNewTodo = async (req, res, next) => {
    const { todo_title, todo_description, todo_color } = req.body
    const errors = validationResult(req).formatWith(({ msg }) => msg)

    if (!errors.isEmpty()) {
        req.flash('error', 'Please try again')
        return res.render('pages/newTodo', {
            title: 'Create Todo',
            heading: 'Create New Todo',
            values: { todo_title, todo_description, todo_color },
            errors: errors.mapped(),
            message: Flash.getMsg(req)
        })
    }

    try {
        const userId = res.locals.user.data.id
        const todo = new Todo({
            title: todo_title,
            description: todo_description,
            color: todo_color,
            author: userId
        })
        await todo.save()
        await User.findByIdAndUpdate(userId, { $push: { todos: todo.id } })
        req.flash('success', 'Todo is created successfully')
        res.redirect(`/todo/${res.locals.user.data.username}`)
    } catch (err) {
        next(err)
    }
}

// Render user specific todo
exports.getUserTodo = async (req, res, next) => {
    const username = req.params.username
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next()
    }
    try {
        const user = await User.findOne(
            { username },
            '-password -email -__v'
        ).populate('todos', '-author -__v')
        user.date = new Date(user.date)
        res.render('pages/userTodo', {
            title: 'My todo',
            todos: user.todos,
            active: true,
            message: Flash.getMsg(req)
        })
    } catch (err) {
        next(err)
    }
}

// Remove todo
exports.postRemoveTodo = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next()

    try {
        const todo = await Todo.findByIdAndDelete(req.query.id)
        if (!todo) return next()
        req.flash('success', 'Todo is deleted successfully')
        res.redirect(`/todo/${res.locals.user.data.username}`)
    } catch (err) {
        next(err)
    }
}

// Get update todo page
exports.getUpdateTodo = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next()
    try {
        const todo = await Todo.findById(req.query.id)
        const todoValue = {
            todo_title: todo.title,
            todo_description: todo.description,
            todo_color: todo.color
        }
        res.render('pages/newTodo', {
            title: 'Edit Todo',
            heading: 'Edit Existing Todo',
            values: todoValue,
            errors: {},
            message: Flash.getMsg(req)
        })
    } catch (err) {
        next(err)
    }
}

// Update existing todo
exports.postUpdateTodo = async (req, res, next) => {
    const { todo_title, todo_description, todo_color } = req.body
    const todoId = req.query.id
    const errors = validationResult(req).formatWith(({ msg, location }) => {
        return { msg, location }
    })
    const mappedError = errors.mapped()

    // If errors in query string handover to notFound
    for (let field in mappedError) {
        if (mappedError[field].location !== 'body') {
            return next()
        }
    }

    if (!errors.isEmpty()) {
        return res.render('pages/newTodo', {
            title: 'Edit Todo',
            heading: 'Edit Existing Todo',
            values: { todo_title, todo_description, todo_color },
            errors: validationResult(req)
                .formatWith(({ msg }) => msg)
                .mapped(),
            message: Flash.getMsg(req)
        })
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, {
            $set: {
                title: todo_title,
                description: todo_description,
                color: todo_color
            }
        })
        if (!updatedTodo) return next()
        req.flash('success', 'Todo is updated successfully')
        res.redirect(`/todo/${res.locals.user.data.username}`)
    } catch (err) {
        next(err)
    }
}
