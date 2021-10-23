const { Schema, model } = require('mongoose')

const todoSchema = new Schema(
    {
        title: {
            type: String,
            minlength: 4,
            maxlength: 30,
            trim: true,
            required: true
        },
        description: {
            type: String,
            minlength: 10,
            maxlength: 120,
            trim: true,
            required: true
        },
        color: {
            type: String,
            enum: [
                '#fcd34d',
                '#fca5a5',
                '#34d399',
                '#4d7c0f',
                '#6366f1',
                '#7c3aed',
                '#f97316',
                '#ef4444'
            ],
            trim: true,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
)

module.exports = model('Todo', todoSchema)
