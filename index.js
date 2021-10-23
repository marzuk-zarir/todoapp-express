require('dotenv').config()
const express = require('express')
const { dbConnect } = require('./config/config')
const setMiddlewares = require('./middlewares')
const { notfoundHandler, internalErrorHandler } = require('./middlewares/error')
const setRouters = require('./routers')
const app = express()
const port = process.env.PORT || 3000

// Database configure
dbConnect()

// Development livereload
if (app.get('env') === 'development') {
    require('./utils/livereload')(app)
}

// Static directory
app.use('/static', express.static(__dirname + '/public'))

// View engine
app.set('views', __dirname + '/views')
app.set('view options', {
    rmWhitespace: true
})
app.set('view engine', 'ejs')

// Hide backend technology
app.disable('x-powered-by')

// Middlewares
setMiddlewares(app)

// Routers
setRouters(app)

// Error handler
app.use(notfoundHandler)
app.use(internalErrorHandler)

app.listen(port, () => {
    console.log(`Server is listening on port ${port} 🚀`)
})
