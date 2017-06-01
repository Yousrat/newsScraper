
var mongoose = require("mongoose");

// Then, we save the mongoose.Schema class as simply "Schema"
var Schema = mongoose.Schema;

// With our new Schema class, we instantiate an ExampleSchema object
// This is where we decide how our data must look before we accept it in the server, and how to format it in mongoDB
var NewsSchema = new Schema({
  // string must be a string. We "trim" it to remove any trailing white space
  // Notice that it is required, as well. It must be entered or else mongoose will throw an error
 title: {
    type: String  

},
  // link is a required string
  link: {
    type: String
  }
  
});



// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", NewsSchema);

// Finally, we export the module, allowing server.js to hook into it with a require statement
module.exports = News;
