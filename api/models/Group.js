const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: { type: String, required: true },
    groupCode: { type: Number },
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Bookmark"
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = Group = mongoose.model("Group", GroupSchema);
