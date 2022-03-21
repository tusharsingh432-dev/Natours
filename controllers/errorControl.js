const AppError = require(`../utils/appErrors`);
const castErrorHandle = (err) => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const duplicateErrorHandle = (err) => {
    const value = err.keyValue;
    return new AppError(`Seems that the unique key ${JSON.stringify(value)} is being reused.`, 400);
}

const validationErrorHandle = (err) => {
    const error = Object.values(err.errors).map((val) => {
        return `Field: ${val.properties.path} Cause: ${val.properties.message}`;
    })
    return new AppError(`Validation Error occoured in [ ${error} ]`, 400);
}

const jsonWebTokenErrorHandle = (err) => {
    return new AppError(`Invalid Token, Please login again`, 401);
}

const tokenExpiredErrorHandle = (err) => {
    return new AppError(`Login Expired, Please login again`, 401);
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
        //console.log(`development`)
        console.log(err.name);
        errSendDev(err, res);
    } else {
        let error = err;
        console.log(error);
        if (error.name === 'CastError') {
            console.log(`CastError Identified`);
            error = castErrorHandle(error);
        }
        if (error.code === 11000) {
            console.log(`Duplicate Id Error`);
            error = duplicateErrorHandle(error);
        }
        if (error.name === "ValidationError") {
            console.log(`Vlaidation Error`);
            error = validationErrorHandle(error);
        }
        if (error.name === "JsonWebTokenError") {
            console.log(`JsonWebToken Error`);
            error = jsonWebTokenErrorHandle(error);
        }
        if (error.name === "TokenExpiredError") {
            console.log(`TokenExpired Error`);
            error = tokenExpiredErrorHandle(error);
        }

        errSendProd(error, res);
    }
    next();
}