// Not found handler
function notfoundHandler(req, res, next) {
    res.status(404).render('404notFound', {
        title: 'Error 404'
    })
}

// Default error handler
function internalErrorHandler(err, req, res, next) {
    let message
    if (res.app.get('env') !== 'development') {
        message = err.stack
    }
    res.status(500).render('500internalError', {
        title: 'Something went wrong',
        message
    })
}

module.exports = {
    notfoundHandler,
    internalErrorHandler
}
