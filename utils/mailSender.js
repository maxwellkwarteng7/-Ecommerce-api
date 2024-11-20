const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    }

});


// Function to send email
const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // array of recipient email
        subject, // string message for email header
        html: htmlContent, //either string or html
    };

    return transporter.sendMail(mailOptions, (error  , info) => {
        if (error) {
            console.log("Error Occured while sending the email", error); 
        } else {
            console.log("Email sent", info.response); 
        }
    });
};

module.exports = sendEmail;