/* INSTRUCTOR ONLY (18.3.02)
 *
 * Example model
 * ===================================== */

// First, we hook mongoose into the model with a require
var mongoose = require("mongoose");

// Then, we save the mongoose.Schema class as simply "Schema"
var Schema = mongoose.Schema;

// With our new Schema class, we instantiate an ExampleSchema object
// This is where we decide how our data must look before we accept it in the server, and how to format it in mongoDB
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String
  }
  
});
  

// This creates our model from the above schema, using mongoose's model method
var savedArticle = mongoose.model("savedArticle1", ArticleSchema);

// Finally, we export the module, allowing server.js to hook into it with a require statement
module.exports = savedArticle;
