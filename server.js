const dotenv = require(`dotenv`);
const mongoose = require(`mongoose`);
dotenv.config({ path: `${__dirname}/configure.env` });
//console.log(process.env);
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
})

const app = require("./app");

const db = process.env.DATABASE;

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to Database...`);
})

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`The app has started in ${process.env.NODE_ENV} mode`);
    console.log(`Listening on ${port}...`);
});

process.on('unhandledRejection', (err, promise) => {

    console.log(err.name, err.message);
    //console.log(`Called unhandledRejection`);
    server.close(() => {
        process.exit(1);
    })
})