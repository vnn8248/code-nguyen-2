const express = require("express");
const router = express.Router();
const axios = require("axios");

// Axios config
let data = require("../lib/data");
// Copyright year
const currentYear = require("../lib/getYear");

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