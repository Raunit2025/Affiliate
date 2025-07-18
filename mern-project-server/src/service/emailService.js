const nodemailer = require('nodemailer');
require('dotenv').config();
// Configure transporter to use explicit Gmail SMTP settings


const send = async (to, subject, body) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST, // Use host from .env
            //port: process.env.GMAIL_PORT, // Use port from .env
            //secure: false, // Use STARTTLS (port 587 typically uses secure: false)
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
        return res.status(500).json({ message: "Error while sending mail" }); // Re-throw the error so the calling function can handle it
    }

};

module.exports = send;
