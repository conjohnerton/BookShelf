const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creates item structure for db
const BookmarkSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
    url: String,
    date: { type: Date, default: Date.now }
});

module.exports = Bookmark = mongoose.model("Bookmark", BookmarkSchema);
