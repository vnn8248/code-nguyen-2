const express = require("express");
const router = express.Router();
const axios = require("axios");

// -- Axios config
let data = require("../lib/data");
const currentYear = require("../lib/getYear");

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get("/", (req, res) => {
    let portfolios = [];
    let blogs = [];

    axios.all([
        data("blogs"),
        data("portfolios")
    ])
    .then(axios.spread((blogRes, portfolioRes) => {
        blogs = blogRes.data;
        portfolios = portfolioRes.data;      
    }))            
    .then(() => {
        res.render("index", {
            year: currentYear, 
            portfolios: portfolios,
            blogs: blogs
        })
    })
    .catch(error => {
        console.log(error);
    })
});


module.exports = router