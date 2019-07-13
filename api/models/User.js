const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    dateCreated: { type: Date, default: Date.now }
    // TODO (conjohn) create bookmarks model array
    // TODO (conjohn) create groups model array
});

module.exports = User = mongoose.model("user", UserSchema);
