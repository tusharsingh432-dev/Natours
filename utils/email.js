const nodemailer = require('nodemailer');
const { options } = require('../routes/userRoute');

const sendMail = options => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
}