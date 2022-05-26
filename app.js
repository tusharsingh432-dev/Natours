const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');
const userRoute = require(`./routes/userRoute`);
const tourRoute = require(`./routes/tourRoute`);
const errorControl = require(`./controllers/errorControl`);
const { static } = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const app = express();
////////////////////////////////Global Middleware////////////////////////////
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'price', 'maxGroupSize', 'difficulty', 'ratingsAverage']
}));
app.use(express.json());
if (process.env.NODE_ENV === `development`) app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Rate limit exceeded',
})
app.use('/api', limiter);
app.use(mongoSanitize());
app.use(xss());
////////////////////////////////Routes///////////////////////////////////////
app.use('/api/v1/tours', tourRoute);
app.use(`/api/v1/users`, userRoute);
app.all(`*`, (req, res, next) => {
    next(new AppError(`There is no defined route for ${req.originalUrl}`, 404));
})

app.use(errorControl);

module.exports = app;