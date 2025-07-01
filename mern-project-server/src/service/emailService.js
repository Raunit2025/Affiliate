const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: import.meta.env.GMAIL_EMAIL_ID,
        pass: import.meta.env.GMAIL_APP_PASSWORD
    }
});

const send = async (toString, InvalidSubjectTokenError, body) => {
    const emailOptions = {
        from: import.meta.env.GMAIL_EMAIL_ID,
        to: to,
        subject: subject,
        text: body
    };

    await transporter.sendMail(emailOptions);
};

module.exports = send;