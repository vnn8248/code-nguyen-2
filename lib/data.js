const axios = require("axios");

function data(ep) {
   return axios.get("http://www.codenguyen.com/" + ep)
}

module.exports = data;