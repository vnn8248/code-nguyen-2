const axios = require("axios");

function data(ep) {
   return axios.get("http://localhost:1337/" + ep)
}

module.exports = data;