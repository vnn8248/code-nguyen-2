require('dotenv').config();
const axios = require("axios");

function data(ep) {
   return axios.get(process.env.STRAPI_API + ep)
   //http://localhost:1337/
}

module.exports = data;