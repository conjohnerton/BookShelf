const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");
const Group = require("../../models/Group");
const Bookmark = require("../../models/Bookmark");

// TODO: add user to group
//       remove group from user list
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
// add member to group
router.post("/join", authenticate, async (req, res) => {
    if (!req.body.groupCode) {
        return res.json({ msg: "Please enter a group code." });
    }

    try {
        // get group and check existence
        let group = Group.findById(req.body.groupCode);

        if (!group) {
            return res.json({ msg: "There is no group with that group code." });
        }

        group.members.push(req.user);
        group = group.save();

        return res.json({ success: true });
    } catch (err) {
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

// NEEDS TESTING
// get members of group
router.get("/:id/members", authenticate, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate("User");
        return res.json(group);
    } catch (err) {
        return res.json(err);
    }
});

module.exports = router;
