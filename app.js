require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const ejs = require("ejs");
const axios = require("axios");
const marked = require("marked");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const mailchimp = require("@mailchimp/mailchimp_marketing");

// Local Library
// -- Nodemailer config
const nodemailerConfig = require("./lib/nodemailer");
// -- Axios config
let data = require("./lib/data");
// -- Copywrite year
const currentYear = require("./lib/getYear");
const skillsLogos = require("./lib/skills");

const app = express();

// EJS LOOKS IN VIEWS DIR
app.set("view engine", "ejs");

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SERVE STATIC FILES FROM PUBLIC DIR
app.use(express.static("public"));
app.use(express.static("cms/public"));



// SESSION MIDDLEWARE
app.use(session({ 
    secret: 'keyboard cat', 
    cookie: { maxAge: 60000 }, 
    saveUninitialized: true,
    resave: true
}));


//CONNECT TO MONGODB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB Atlas.");
});




// ROUTES
app.get("/", (req, res) => {
    let portfolios = [];
    let blogs = [];
    let bio = [];

    axios.all([
        data("blog-posts"),
        data("portfolios"),
        data("bio")
    ])
    .then(axios.spread((blogRes, portfolioRes, bioRes) => {
        blogs = blogRes.data;
        portfolios = portfolioRes.data;
        bio = bioRes.data;
        
        bio.bio = marked(bio.bio);
        
    }))            
    .then(() => {
        res.render("index", {
            year: currentYear, 
            bio: bio, 
            portfolios: portfolios,
            blogs: blogs
        })
    })
    .catch(error => {
        console.log(error);
    })
});

app.get("/contact", (req, res) => {
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



app.get("/portfolio", (req, res) => {
    let portfolios = [];
    
    data("portfolios")
        .then(response => {
            portfolios = response.data;
        })
        .then(() => {
            res.render("portfolio", {
                year: currentYear,
                portfolios: portfolios
            });
        })
        .catch(error => {
            console.log(error);
        })
});

    

app.get("/portfolio/:slug", (req, res) => {
    const requestedPiece = _.kebabCase(req.params.slug);
    let portfolios = [];

    data("portfolios?slug=" + requestedPiece)
        .then(response => {
            portfolios = response.data;
            
            portfolios.forEach(piece => {
                piece.description = marked(piece.description);
            });
            
        })
        .then(() => {
            res.render("piece", {
                year: currentYear,
                portfolios: portfolios,
                skillsLogos: skillsLogos
            });
        })
        .catch(error => {
            console.log(error);
        })
});


app.get("/blog", function(req, res) {
    let allPosts = [];
    let feature = [];
    let otherPosts = [];

    data("blog-posts")
        .then(response => {
            allPosts = response.data;
              
            allPosts.forEach(function(post){
                // Convert Strapi content markup to html
                post.content = marked(post.content);   
            });

            feature = allPosts.filter(post => post.tag);
            otherPosts = allPosts.filter(post => !post.tag);
        })
        .then(() => {
            res.render("blog", {
                year: currentYear, 
                feature: feature,
                otherPosts: otherPosts
            });
        })
        .catch(error => {
            console.log(error);
        }) 
});



app.get("/blog/:slug", (req, res) => {
    const requestedPost = _.kebabCase(req.params.slug);
    let post = [];

    data("blog-posts?slug=" + requestedPost)
        .then(response => {
            post = response.data;
                           
            post.forEach(function(post){
                // Convert Strapi content markdown to html
                post.content = marked(post.content);       
            });
        })
        .then(() => {
            res.render("post", {
                year: currentYear,
                post: post
            });
        })
        .catch(error => {
            console.log(error);
        })
});

app.post("/subscribe", function(req, res) {
    console.log("Server side.");
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

app.post("/contact", (req, res) => {
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






let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});