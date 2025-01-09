// models/emailService.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'esmshelpline@gmail.com',
        pass: 'twri tgyn qlej qpyc'
    }
});

export const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: 'esmshelpline@gmail.com',
        to,
        subject,
        text: message
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                reject(error);
            } else {
                console.log("Email sent:", info.response);
                resolve(info.response);
            }
        });
    });
};
