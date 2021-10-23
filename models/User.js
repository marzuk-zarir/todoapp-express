const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema(
    {
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
        todos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Todo'
            }
        ]
    },
    {
        timestamps: true
    }
)

// Hash password before save
userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (err) {
        next(err)
    }
})

// Compare old and new hash password
userSchema.statics.comparePassword = async function (userId, newPassword) {
    const user = await this.findById(userId)
    return await bcrypt.compare(newPassword, user.password)
}

// Update password
userSchema.statics.updatePassword = async function (userId, newPassword) {
    newPassword = await bcrypt.hash(newPassword, 10)
    await this.findByIdAndUpdate(userId, { $set: { password: newPassword } })
}

module.exports = model('User', userSchema)
