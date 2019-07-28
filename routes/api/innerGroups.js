const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");
const Group = require("../../models/Group");
const Bookmark = require("../../models/Bookmark");

//       eventually check to see if user needs to be validated for group actions

// get all Bookmarks from group
router.get("/:id/bookmarks", authenticate, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate("Bookmark");
        res.json({ group, success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

// NEEDS TESTING
// post bookmark in group
router.post("/:id/bookmarks", authenticate, async (req, res) => {
    try {
        let group = await Group.findById(req.params.id);

        const newBookmark = new Bookmark({
            title: req.body.title,
            author: req.user,
            body: req.body.text,
            url: req.body.url
        });

        await newBookmark.save();
        group.bookmarks.push(newBookmark);
        group = await group.save();

        return res.json({ success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

// NEEDS TESTING
// get members of group
router.get("/:id/members", authenticate, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate("User");
        return res.json({ group, success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

module.exports = router;
