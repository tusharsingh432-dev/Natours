const fs = require('fs');
const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/../../configure.env` });
const mongoose = require('mongoose');
const Tour = require(`${__dirname}/../../models/tourModel`);
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
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

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log(`Imported..`);
    } catch (error) {
        console.log(error);
    }
    process.exit();
}
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log(`Deleted..`);
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if (process.argv[2] == `--import`) importData();
if (process.argv[2] == `--delete`) deleteData();
