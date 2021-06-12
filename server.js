const dotenv = require(`dotenv`);
const mongoose = require(`mongoose`);
dotenv.config({ path: `${__dirname}/configure.env` });
//console.log(process.env);
const server = require("./app");

const db = process.env.DATABASE;

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to Database...`);
}).catch((err) => {
    console.log(err);
})

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`The app has started in ${process.env.NODE_ENV} mode`);
    console.log(`Listening on ${port}...`);
});