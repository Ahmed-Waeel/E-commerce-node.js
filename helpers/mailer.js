require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
});

const send = (mailData) => {
    const res = transporter.sendMail(mailData, async (err) => {
        if (err) console.log(err);
        return true;
    });

    console.log(res)
}

module.exports = {
    send
}