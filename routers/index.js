const mainRouter = require('./mainRouter')

const routers = [
    {
        path: '/',
        handler: mainRouter
    }
]

function setRouters(app) {
    routers.forEach(({ path, handler }) => {
        app.use(path, handler)
    })
}

module.exports = setRouters
