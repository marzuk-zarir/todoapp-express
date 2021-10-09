const authRouter = require('./authRouter')
const mainRouter = require('./mainRouter')
const todoRouter = require('./todoRouter')
const { requireAuth } = require('../middlewares/auth')

const routers = [
    {
        path: '/auth',
        handler: authRouter
    },
    {
        path: '/todo',
        middlewares: [requireAuth],
        handler: todoRouter
    },
    {
        path: '/',
        handler: mainRouter
    }
]

function setRouters(app) {
    routers.forEach((router) => {
        router.middlewares
            ? app.use(router.path, router.middlewares, router.handler)
            : app.use(router.path, router.handler)
    })
}

module.exports = setRouters
