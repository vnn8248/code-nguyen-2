require('dotenv').config();
const nodemailer = require("nodemailer");

module.exports.output = (req) => {
    return `
    <p>New request for proposal.</p>
    <h3>Contact Info</h3>
    <ul>
        <li>Business Name: ${req.body.businessName}</li>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phoneNumber}</li>
        <li>Budget: ${req.body.budget}</li>
        <li>Deadline: ${req.body.deadline}</li>
    </ul>
    <h3>Details</h3>
    <p>${req.body.details}</p>
    <h3>How did you hear about Code Nguyen?</h3>
    <p>${req.body.source}</p>
    `;
}

//Sending the inputs on the contact form
module.exports.transporter = () => {
    return nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: process.env.ZOHO_PORT,
        secure: true,
        auth: {
            user: process.env.ZOHO_UN, 
            pass: process.env.ZOHO_PW, 
        },
    });
};

// send mail with defined transport object
module.exports.mailOptions= (output) => {
    return {
        from: process.env.ZOHO_UN, // sender address
        to: process.env.ZOHO_UN, // list of receivers
        subject: "New Request For Proposal", // Subject line
        html: output, // html body
    };
}
