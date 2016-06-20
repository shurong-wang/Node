/*
 Connection -> Schema -> Model -> Entity -> CURD
 */

var mongoose = require('mongoose');
//var uri = 'mongodb://username:password@hostname:port/database';
var uri = "mongodb://localhost/part9";

// Connection
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Open database failed:'));
db.once('open', function () {
    console.log("Open database success");
});

// Schema
var BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    publishTime: Date
});

// Model
var Book = mongoose.model("Book", BookSchema);

module.exports = Book;