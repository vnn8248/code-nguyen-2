require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const currentYear = require("./lib/getYear");
const bio = require("./lib/bio");
const axios = require("axios");


const app = express();
//////////////////////////////////// EJS LOOKS IN VIEWS DIR
app.set("view engine", "ejs");
//////////////////////////////////// SERVE STATIC FILES FROM PUBLIC DIR
app.use(express.static("public"));
app.use(express.static("cms/public"));


//////////////////////////////////// CONNECT TO MONGODB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB Atlas.");
});



//////////////////////////////////// ROUTES
app.get("/", (req, res) => {
    res.render("index", {year: currentYear, bioArray: bio});
});


app.get("/blog", function(req, res) {
    let imageUrl;
    let postTitle;
    let postContent;
    let postAuthor;
    //Date is not working
    let publishedDate;
    axios.get("http://localhost:1337/blog-posts")
        .then(response => {
            const postDataArray = response.data;

            //Get Image URL for blog post
            postDataArray.forEach(function(post){
                postTitle = post.Title;
                postContent = post.Content;
                postAuthor = post.author.Name;
                publishedDate = post.date;
                post.Media.forEach(function(image){
                    imageUrl = image.url;
                });   
            });
        })
        .then(function(){
            res.render("blog", {
                year: currentYear, 
                imageUrl: imageUrl,
                postTitle: postTitle,
                postContent: postContent,
                postAuthor: postAuthor,
                publishedDate: publishedDate
            });
        })
    
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});