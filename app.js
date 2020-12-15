require('dotenv').config();
const express = require("express");


//Routes
const portfolio = require("./router/portfolio");
const blog = require("./router/blog");
const contact = require("./router/contact");
const subscribe = require("./router/subscribe");
const index = require("./router/index");

// HTTPS redirect module
const https_redirect = require("./lib/https");

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");

// Local dev static files
app.use(express.static("public"));
app.use(express.static("../code-nguyen-cms/cms/public"));


app.use(https_redirect);



// ROUTES
app.use("/", index);

app.use("/contact", contact);

app.use("/portfolio", portfolio);

app.use("/blog", blog);

app.use("/subscribe", subscribe);


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});