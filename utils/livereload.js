function livereload(app) {
    const path = require('path')
    const livereload = require('livereload')
    const connectLivereload = require('connect-livereload')
    const liveServer = livereload.createServer()

    liveServer.watch(path.resolve(__dirname, '../public'))
    liveServer.server.once('connection', () => {
        setTimeout(() => {
            liveServer.refresh('/')
            console.log('Livereloader reload successfully 🔨')
            console.log('Waiting for static file change...')
        }, 100)
    })
    app.use(connectLivereload())
}

module.exports = livereload
