require('dotenv').config();
const axios = require("axios");

function data(ep) {
   return axios.get("https://limitless-thicket-75365.herokuapp.com/" + ep)
   // http://localhost:1337/
}

module.exports = data;