const express = require('express');
const morgan = require('morgan');

const userRoute = require(`./routes/userRoute`);
const tourRoute = require(`./routes/tourRoute`);
const { static } = require('express');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === `development`) app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

////////////////////////////////Routes///////////////////////////////////////
app.use('/api/v1/tours', tourRoute);
app.use(`/api/v1/users`, userRoute);
app.all(`*`, (req, res) => {
    // res.status(404).json({
    //     status: `Not found`,
    //     message: `There is no defined route for ${req.originalUrl}`
    // });

    const err = new Error(`There is no defined route for ${req.originalUrl}`);
    err.statusCode = 404;
    err.status = `fail`;
    next(err);
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || `Undefined Error`;
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    next();
});

module.exports = app;