const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Bookmark = require("./Bookmark");

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    register_date: { type: Date, default: Date.now },
    bookmarks: { type: mongoose.ObjectId, ref: Bookmark }
    // TODO (conjohn) create groups model array
});

module.exports = User = mongoose.model("user", UserSchema);
