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

// Local Library
const nodemailerConfig = require("./lib/nodemailer");
let data = require("./lib/data");
const currentYear = require("./lib/getYear");
const bio = require("./lib/bio");

const app = express();

// EJS LOOKS IN VIEWS DIR
app.set("view engine", "ejs");

// SERVE STATIC FILES FROM PUBLIC DIR
app.use(express.static("public"));
app.use(express.static("cms/public"));

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));

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

    axios.all([
        data("blog-posts"),
        data("portfolios")
    ])
    .then(axios.spread((blogRes, portfolioRes) => {
        blogs = blogRes.data;
        portfolios = portfolioRes.data;
    }))            
    .then(() => {
        res.render("index", {
            year: currentYear, 
            bioArray: bio, 
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
            })
        })
        .then(() => {
            res.render("piece", {
                year: currentYear,
                portfolios: portfolios
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

app.post("/subscribe", (req, res) => {

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





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});