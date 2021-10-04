const mongoose = require('mongoose')

// Database connection
async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Database connected successfully 🔥')
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = {
    dbConnect
}
