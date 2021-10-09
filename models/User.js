const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 12,
        trim: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minlength: 7,
        maxlength: 20,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    todos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
})

// Hash password before will user save
userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (err) {
        next(err)
    }
})

module.exports = model('User', userSchema)
