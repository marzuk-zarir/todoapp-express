// Not found handler
function notfoundHandler(req, res, next) {
    res.status(404).render('errors/404notFound', {
        title: 'Error 404'
    })
}

// Default error handler
function internalErrorHandler(err, req, res, next) {
    let message
    if (res.app.get('env') === 'development') {
        message = err.stack
        console.error(err.stack)
    }

    // Handle CSRF errors
    if (err.code === 'EBADCSRFTOKEN') {
        res.clearCookie(process.env.JWT_TOKEN_NAME)
        res.clearCookie(process.env.SESSION_NAME)
        return res.status(403).render('security/csrf', {
            title: 'CSRF Attack Detected',
            appurl: req.headers.origin
        })
    }

    res.status(500).render('errors/500internalError', {
        title: 'Something went wrong',
        message
    })
}

module.exports = {
    notfoundHandler,
    internalErrorHandler
}
