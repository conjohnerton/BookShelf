const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creates item structure for db
const BookmarkSchema = new Schema({
    title: String,
    author: String,
    // body: String,
    // url: String,
    date: { type: Date, default: Date.now }
});

module.exports = Bookmark = mongoose.model("bookmark", BookmarkSchema);
