require('dotenv').config();
const express = require("express");
const router = express.Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");

router.post("/", (req, res) => {
    const email = req.body.email;
        
    const subscribingUser = {
        email: email
    };

    mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_APIKEY,
        server: process.env.MAILCHIMP_SERVER
    });

    const listId = process.env.MAILCHIMP_LISTID;

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed"
        });
        if (response.id) {
            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
            res.send("Subscribed!");
        } else if (!response.id) {
            res.send("An error occurred. Contact me and I'll take a look.")
        }
    }
    run();
});

module.exports = router