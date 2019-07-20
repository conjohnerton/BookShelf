const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");
const Group = require("../../models/Group");
const Bookmark = require("../../models/Bookmark");

// TODO: post bookmark to group method
//       add user to group
//       remove group from user list
//       add existing group
//       test delete group method for bugs
//       eventually check to see if user needs to be validated for group actions

// get current users groups
router.get("/", authenticate, async (req, res) => {
    try {
        const userGroups = await User.findById(req.user.id).populate("groups");
        res.json(userGroups);
    } catch (err) {
        return res.json(err);
    }
});

// create a new group under current user
router.post("/", authenticate, async (req, res) => {
    try {
        // find user from auth token userId
        let user = await User.findById(req.user.id);

        // get Group name from body and create Group
        let newGroup = new Group({
            name: req.body.name,
            members: [user._id]
        });

        newGroup = await newGroup.save();

        // add group to current user and save it
        user.groups.push(newGroup);
        user = await user.save();

        // TODO: Figure out what the heck to respond with
        return res.json({
            user: {
                name: user.name,
                groups: user.groups
            }
        });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

// NEEDS TESTING
// delete group
router.delete("/:id", authenticate, async (req, res) => {
    try {
        let group = await User.findById(req.params.id).populate("Bookmark");

        // delete all bookmarks contained in the group
        for (let bookmark of group.bookmarks) {
            group.bookmarks.id(bookmark._id).remove();
        }

        await group.remove();

        return res.json({ success: true });
    } catch (err) {
        return res.json({ err, success: true });
    }
});

// get all Bookmarks from group
router.get("/:id/bookmarks", authenticate, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate("Bookmark");
        res.json(group);
    } catch (err) {
        return res.json(err);
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

// get members of group
router.get("/:id/members");

// add member to group
router.post("/:id/members");

module.exports = router;
