// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Bring in our Models: Not and User
var News = require("./models/News.js");
var Note = require("./models/Note.js");
var SavedArticle = require("./models/SavedArticle.js");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");
const notifier = require('node-notifier');

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/scrapenews1");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//Initialize Express
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// // Routes
// // ======

// Simple index route
app.get("/", function(req, res) {
    // res.send(index.html);
    // res.render('home', {title: "LATEST NEWS"});
    News.find({}, function(error, doc) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as a json
        else {
            // res.render('home', {item: found});
            //res.json(found);
            res.render('home', { items: doc, title: "LATEST NEWS" });

        }
    });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {

    request("https://www.reddit.com/r/webdev", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $("p.title").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).text();
            result.link = $(this).children().attr("href");

            var entry = new News(result);


            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    //showScrapedData();

                    console.log(doc);
                }
            });

        });
    });
   // res.send('scrapped the articles');
    News.find({}, function(error, doc) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as a json
        else {
            // res.render('home', {item: found});
            //res.json(found);
            res.render('Scrapedhome', { items: doc, title: "LATEST NEWS" });

        }
        notifier.notify({
        'title': 'Updating articles from Reddit',
        'message': 'Update Complete!'
    });
    });
});

//function showScrapedData() {
    
//}



app.get("/save/:_id", function(req, res) {

    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    News.findOne({ "_id": req.params.id })
        .populate("SavedArticle")
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
               //SavedArticle.save(doc);
                //res.json(doc);
            }
        });
    notifier.notify({
        'title': 'Saving article to Saved Articles tab',
        'message': 'Article Saved!'
    });
});


app.get("/savedarticles", function(req, res) {
  // Find all results from the scrapedData collection in the db
  SavedArticle.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      // res.render('home', {item: found});
     //res.json(found);
        res.render('saved', { items: found , title: "Your Saved Articles" });

    }
  });
});

app.post("/notes/:note", function(req, res) {
  var Notes = req.params.body;
   Note.save({
        note: note    
});
});


app.listen(3000, function() {
    console.log("App running on port 3000!");
});
