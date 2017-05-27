// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
// Snatches HTML from URLs
var request = require("request");
// Scrapes HTML
var cheerio = require("cheerio");

//what does logger do?
var logger = require("morgan");
var mongoose = require("mongoose");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// And here's where we establish a connection to the collection
// We bring the model in like any old module
// Most of the magic with mongoose happens there
// Example gets saved as a class, so we can create new Example objects
// and send them as validated, formatted data to our mongoDB collection

var Model = require("./models/scrapedNews.js");

//Initialize Express
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Configure the app to use body parser and morgan
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//Static file support with public folder
app.use(express.static("public"));



// // Here's how we hook mongoose with the mongodb database
// //  database: scrapenews
mongoose.connect("mongodb://localhost/scrapenews");


// // Save our mongoose connection to db
var db = mongoose.connection;

// If there's a mongoose error, log it to console
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once we "open" a connection to mongoose, tell the console we're in
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// // Routes
// // ======

// Simple index route
app.get("/", function(req, res) {
  // res.send(index.html);
    // res.render('home', {title: "LATEST NEWS"});
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
            console.log(saved);
          }
        });
      }
    });
  });

  // This will send a "Scrape Complete" message to the browser
  


  //alert("Scrape Complete");
  // res.send("Scrape Complete");
 
});










  
  // Make a request for the news section of ycombinator
 
// request("https://www.nytimes.com/", function(error, response, html) {
//     // Load the html body from request into cheerio
//     var $ = cheerio.load(html);
//     console.log(html);
//     // For each element with a "title" class
//     $(".story-heading").each(function(i, element) {
//       // Save the text of each link enclosed in the current element
//       //var title = $(this).children("a").text();

//     // Save the text of the element (this) in a "title" variable
//     var title = $(this).text();

//     // In the currently selected element, look at its child elements (i.e., its a-tags),
//     // then save the values for any "href" attributes that the child elements may have


//       // Save the href value of each link enclosed in the current element
// //      var link = $(this).children("a").attr("href");

//       // If this title element had both a title and a link
//       if (title) {
//         // Save the data in the scrapedData db
//         db.scrapedNews.save({
//           title: title,
//           //link: link
//         },function(error, saved) {
//           // If there's an error during this query
//           if (error) {
//             // Log the error
//             console.log(error);
//           }
//           // Otherwise,
//           else {
//             // This will send a "Scrape Complete" message to the browser
//             res.send("Scrape Complete");

//             // Log the saved data
//             console.log(saved);
//           }
//         });
//       }
//     });
// res.send("could not match elements!");
//   });

  

// });

//   // request("https://www.nytimes.com/", function(error, response, html) {
//   //   // Load the html body from request into cheerio
//   //   var $ = cheerio.load(html);
//   //   console.log(html);
  //   console.log('starting scrape...');

  //   $(".collection").each(function(i, element) {
  //          var title = $(this).children("h2").text();
           //var link = $(this).children("a").attr("href");
          // var summary = $(this).children(".summary").text();

      // Save the text of each link enclosed in the current element
    // For each element with a "title" class
    // $(".cd--card").each(function(i, element) {
    //   console.log('at element #' + i);

      // if(i > 10)
      //   return;

      // Save the text of each link enclosed in the current element
      // var title = $(this).text();
      // Save the href value of each link enclosed in the current element
      //var link = $(this).children("a").attr("href");

      // If this title element had both a title and a link
      // if (title) {
        // Save the data in the scrapedData db
        

        // db.scrapedNews.save({
        //   title: title,
        //  // link: link,
        // //  summary: summary

       


    // did not find any elements, respond with something else
    




// Retrieve data from the db
// app.get("/all", function(req, res) {
//   // Find all results from the scrapedData collection in the db
//   db.scrapedNews.find({}, function(error, found) {
//     // Throw any errors to the console
//     if (error) {
//       console.log(error);
//     }
//     // If there are no errors, send the data to the browser as a json
//     else {
//       console.log(found);
//       res.json(found);
//     }
//   });
// });


app.get("/all", function(req, res) {
  // Find all notes in the note collection with our Note model
  console.log(db);
  db.scrapedNews.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      // res.send(error);
      console.log(error);
    }
    // Or send the doc to the browser
    else {
      res.json(doc);
    }
  });
});

// app.get("/all", function(req, res) {
//   // Find all results from the scrapedData collection in the db
//   db.scrapedNews.find({}, function(error, found) {
//     // Throw any errors to the console
//     if (error) {
//       console.log(error);
//     }
//     // If there are no errors, send the data to the browser as a json
//     else {
//       res.json(found);
//     }
//   });
// });






  // Inserting an array and a boolean into the req.body object for example purposes
  // req.body.array = ["item1", "item2", "item3"];
  // Remember, we have to specify booleans on the server--the front-end can only send strings
  // req.body.boolean = false;

  // We use the "Example" class we defined above
  // to check our req.body against our Example model
  // app.post("/scrape", function(req, res) {

//   var content = new News(req.body);

//   // With the new Example object created, we can save our data to mongoose
//   // Notice the different syntax. The magic happens in exampleModel.js
//   content.save(function(error, doc) {
//     // Send any errors to the browser
//     if (error) {
//       res.send(error);
//     }
//     // Otherwise, send the new doc to the browser
//     else {
//       res.send(doc);
//     }
//   });
// });

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


















// --------------------------------------------------------
// ------------------------------------------------------
// Dependencies
// var express = require("express");
// var mongojs = require("mongojs");
// // Require request and cheerio. This makes the scraping possible
// var request = require("request");
// var cheerio = require("cheerio");

// var bodyParser = require("body-parser");
// var exphbs = require("express-handlebars");

// // Initialize Express
// var app = express();

// app.engine("handlebars", exphbs({ defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// // Database configuration
// var databaseUrl = "scrapenews";
// var collections = ["scrapedNews"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
// //   console.log("Database Error:", error);
// // });

// // Main route
// app.get("/", function(req, res) {
//   //res.send("how to render handlebars page?");
//   res.render('home', {title: "LATEST NEWS"});
// });

// // Retrieve data from the db


// // Scrape data from one site and place it into the mongodb db
// app.get("/scrape", function(req, res) {
//   // Make a request for the news section of ycombinator
//   request("http://www.cnn.com/", function(error, response, html) {
//     // Load the html body from request into cheerio
//     var $ = cheerio.load(html);
//     var title = cheerio.load(html);
//     // For each element with a "title" class
//     $(".pg-headline").each(function(i, element) {
//       // Save the text of each link enclosed in the current element
//       var title = $(this).children("h1").text();
//       // Save the href value of each link enclosed in the current element
//       //var link = $(this).children("a").attr("href");

//       // If this title element had both a title and a link
//       if (title) {
//         // Save the data in the scrapedData db
//         db.scrapedNews.save({
//           title: title,
        
//         },
//         function(error, saved) {
//           // If there's an error during this query
//           if (error) {
//             // Log the error
//             console.log(error);
//           }
//           // Otherwise,
//           else {
//             // Log the saved data
//             console.log(saved);
//           }
//         });
//       }
//     });
//   });

//   // This will send a "Scrape Complete" message to the browser
//   res.send("Scrape Complete");
 
// });


// // Listen on port 3000
// app.listen(3000, function() {
//   console.log("App running on port 3000!");
// });










