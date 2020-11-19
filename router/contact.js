const express = require("express");
const router = express.Router();
const session = require("express-session");
const nodemailer = require("nodemailer");

// -- Nodemailer config
const nodemailerConfig = require("../lib/nodemailer");

const currentYear = require("../lib/getYear");

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// SESSION MIDDLEWARE
router.use(session({ 
    secret: 'keyboard cat', 
    cookie: { maxAge: 60000 }, 
    saveUninitialized: true,
    resave: true
}));

router.get("/", (req, res) => {
    const emptyMessage = "";
    const submitResult = req.session.valid;

    if (submitResult === true) {
        const successMessage = "Success! Thanks for sending."
        res.render("contact", {
            year: currentYear,
            resultMessage: successMessage
        })
    } else if (submitResult === false) {
        const errorMessage = "There was an error";
        res.render("contact", {
            year: currentYear,
            resultMessage: errorMessage
        })
    } else {
        res.render("contact", {
            year: currentYear,
            resultMessage: emptyMessage
        })
    }
});

router.post("/", (req, res) => {
    const output = nodemailerConfig.output(req);
    const mailOptions = nodemailerConfig.mailOptions(output)
    const transporter = nodemailerConfig.transporter();
 

    transporter.sendMail(mailOptions, (error, info) => {
        // Check for errors
        if (error) {
            console.log(error);
            req.session.valid = false;
            res.redirect("/contact");
        } else if (!error) {
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            req.session.valid = true;
            res.redirect("/contact");
        }
    });
});

module.exports = router