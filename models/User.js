const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    register_date: { type: Date, default: Date.now },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }]
});

module.exports = User = mongoose.model("User", UserSchema);
