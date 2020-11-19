const express = require("express");
const router = express.Router();
const _ = require("lodash");
const marked = require("marked");
// -- Axios config
let data = require("../lib/data");
const skillsLogos = require("../lib/skills");
const currentYear = require("../lib/getYear");

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get("/", (req, res) => {
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
        });
});

router.get("/:slug", (req, res) => {
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
        });
});


module.exports = router