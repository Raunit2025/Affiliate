const nodemailer = require('nodemailer');
require('dotenv').config();

const send = async (to, subject, body) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            auth: {
                user: process.env.GMAIL_EMAIL_ID,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
        console.log("yha tk chala");
        
        const emailOptions = {
            from: "raunit",
            to: `${to}`,
            subject: `${subject}`,
            html: `${body}`,

        };


        const info = await transporter.sendMail(emailOptions);
        console.log(`Email sent to ${to} successfully.`);
        return info;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return res.status(500).json({ message: "Error while sending mail" });
    }

};

module.exports = send;
