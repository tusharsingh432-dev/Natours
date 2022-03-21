const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');
const userRoute = require(`./routes/userRoute`);
const tourRoute = require(`./routes/tourRoute`);
const errorControl = require(`./controllers/errorControl`);
const { static } = require('express');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === `development`) app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

////////////////////////////////Routes///////////////////////////////////////
app.use('/api/v1/tours', tourRoute);
app.use(`/api/v1/users`, userRoute);
app.all(`*`, (req, res, next) => {
    next(new AppError(`There is no defined route for ${req.originalUrl}`, 404));
})

app.use(errorControl);

module.exports = app;