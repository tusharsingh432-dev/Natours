const AppError = require(`../utils/appErrors`);
const castErrorHandle = (err) => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const errSendDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        err,
        message: err.message,
        stack: err.stack
    });
}

const errSendProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log(`//////////////////////////Error//////////////////////`);
        console.log(err.name);
        res.status(500).json({
            status: `error`,
            message: `Somthing must have went wrong....`
        });
    }
}

module.exports = (err, req, res, next) => {
    //console.log(err.statusCode + `  errctrl`);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || `Undefined Error`;
    if (process.env.NODE_ENV === 'development') {
        console.log(`development`)
        console.log(err.name);
        errSendDev(err, res);
    } else {
        let error = err;
        console.log(error);
        if (error.name === 'CastError') {
            console.log(`CastError Identified`);
            error = castErrorHandle(error);
        }
        errSendProd(error, res);
    }
    next();
}