// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
const notifier = require('node-notifier');

// Initialize Express
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Static file support with public folder
app.use(express.static("public"));

// Database configuration
var databaseUrl = "scrapenews";
var collections = ["scrapedNews,savedArticle,notes"];

//var Article_collection = ["MyArticle"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route
// app.get("/", function(req, res) {
//   //res.send("how to render handlebars page?");
//   res.render('home', {title: "LATEST NEWS"});
// });

// Retrieve data from the db
app.get("/", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedNews.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      // res.render('home', {item: found});
     //res.json(found);
        res.render('home', { items: found , title: "LATEST NEWS" });

    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://www.reddit.com/r/webdev", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
      var result = [];

    // For each element with a "title" class
      $("p.title").each(function(i, element) {

      // Save the text of each link enclosed in the current element
      var title = $(this).text();
          var link = $(element).children().attr("href");

      // Save the href value of each link enclosed in the current element
      //var link = $(this).children("a").attr("href");

      // If this title element had both a title and a link
      if (title) {
        // Save the data in the scrapedData db
        db.scrapedNews.save({
          title: title,
            link: link
        },
        function(error, saved) {
          // If there's an error during this query
          if (error) {
            // Log the error
            console.log(error);
          }
          // Otherwise,
          else {
            // Log the saved data
            //console.log(saved);
          }
        });
      }
    });
  });

db.scrapedNews.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      // res.render('home', {item: found});
     //res.json(found);
        res.render('Scrapedhome', { items: found , title: "LATEST NEWS" });

    }
  });
  // This will send a "Scrape Complete" message to the browser
// String 
//notifier.notify('Message');
 
// Object 
notifier.notify({
  'title': 'Updating articles from Reddit',
  'message': 'Update Complete!'
});


  //alert("Scrape Complete");
  // res.send("Scrape Complete");
 
});

//saving an article to article collection

// Listen on port 3000


// db.person.find().snapshot().forEach( function (hombre) {
//     hombre.name = hombre.firstName + ' ' + hombre.lastName; 
//     db.person.save(hombre); 
// });

app.get("/save/:_id", function(req, res) {

  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.scrapedNews.find({ "_id": req.params.id},function(error,found){


   if (error) {
      console.log(error);
    }
    else{
          console.log(found);
      //res.json(found);
      db.savedArticle.save({found});
      notifier.notify({
  'title': 'Saving article to Saved Articles tab',
  'message': 'Article Saved!'
});
      // db.savedArticle.save({
      //      "_id": mongojs.ObjectId(req.params.id)},
      //     title: title,
      //       link: link)
          }
      });
      });
   
  
app.get("/savedarticles", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.savedArticle.find({}, function(error, found) {
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
  var note = req.params.body;
   db.notes.save({
        note: note      
});
});



app.listen(3000, function() {
  console.log("App running on port 3000!");
});
