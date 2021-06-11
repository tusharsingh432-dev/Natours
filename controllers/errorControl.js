module.exports = (err, req, res, next) => {
    console.log(err.statusCode);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || `Undefined Error`;
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    next();
}