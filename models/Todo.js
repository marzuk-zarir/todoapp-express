const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
    title: {
        type: String,
        minlength: 4,
        maxlength: 20,
        trim: true,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 50,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

exports.Todo = model('Todo', todoSchema)
