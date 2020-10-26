require('dotenv').config();
const axios = require("axios");

function data(ep) {
   if (process.env.NODE_ENV === "production") {
      return axios.get("https://limitless-thicket-75365.herokuapp.com/" + ep)
   } else {
      return axios.get("http://localhost:1337/" + ep)
   }
}

module.exports = data;