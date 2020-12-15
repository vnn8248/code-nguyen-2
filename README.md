# Welcome To The Code Nguyen Repository
My personal portfolio, website and blog to showcase my freelance work and dish out some written content you can't find any where else!
I plan to write an in-depth blog series on how to recreate this blog and portfolio which will be posted on www.codenguyen.com.

## Front-end
The view engine is set to serve views from EJS templates and partials. This was just the quickest way, for me, to get a project like this up live. I have plans for Code Nguyen 3 to use React.JS and Next.JS because those just so happen to be the hottest, most popular things all the kids are talking about.
Stay tuned!

## Back-end
This back-end is written with Node.JS and Express. The router has dynamic page rendering for individual blog posts and portfolio pieces. Some notable packages and connections made are "axios" (to make API calls to Strapi), "marked" (npm package to render markdown as html), "lodash" (to standardize url parameters and CMS slug creation). Some little fun stuff include a bit AJAX and JQuery for handling the newsletter subscription input in the footer. This gets posted the the Mailchimp API. 
Nodemailer is the package used for the contact page form. And the copyright year in the footer is dynamically rendered to auto-update when the year changes.

## Database
The local database configuration is located in the code-nguyen-cms repository. The headless CMS in use is Strapi and it is configured to use MongoDB as the database.
In code-nguyen-cms you will find a "configure" directory that has "database.js" as a file. This file checks the NODE_ENV of the server and if Heroku returns a value of "PRODUCTION" (which it does by default in prod environments), Strapi will connect to MongoDB Atlas URI which serves the Code Nguyen production database.
Else, Strapi will connect to a local instance of MongoDB. I use Robo3T as a GUI to quickly and easily work with MongoDB locally.

## CMS
As mentioned above, the headless CMS is Strapi. The configuration has its own Github repo at code-nguyen-cms and lives on a Heroku server as well. The static files in production are configured to be uploaded to a third-party provider. My choice here was Cloudinary. Under the API directory in the code-nguyen-cms repository, the blog and portfolio endpoints have a model directory where you can peep the slug creation for individual page creation and rendering. All the content gets called through Axios and Strapi's API and gets rendered through EJS on each view.
All testing was handled with the help of Postman.
