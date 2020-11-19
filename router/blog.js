const express = require("express");
const router = express.Router();
const _ = require("lodash");
const marked = require("marked");

// -- Axios config
let data = require("../lib/data");
const currentYear = require("../lib/getYear");


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


router.get("/", (req, res) => {
    let allPosts = [];
    let feature = [];
    let otherPosts = [];

    data("blogs")
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
})

router.get("/:slug", (req, res) => {
    const requestedPost = _.kebabCase(req.params.slug);
    let post = [];

    data("blogs?slug=" + requestedPost)
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
})


module.exports = router