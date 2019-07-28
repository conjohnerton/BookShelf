const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");
const Group = require("../../models/Group");

// TODO: add user to group
//       only give admin access for group deletion

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

        // ADD GROUPCODE TO GROUP from GROUP ID SUBJECT TO CHANGE
        newGroup.groupCode = newGroup._id;
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
        return res.json({ err, success: false });
    }
});

// join existing group
router.put("/", authenticate, async (req, res) => {
    if (!req.body.groupCode) {
        return res.json({ msg: "Please enter a group code." });
    }

    try {
        // get group and check existence
        let group = await Group.findById(req.body.groupCode);

        if (!group) {
            return res.json({ msg: "There is no group with that group code." });
        }

        if (group.members.includes(req.user.id)) {
            return res.json({ msg: "You are already a member of that group." });
        }

        // push user to group members
        group.members.push(req.user.id);
        group = await group.save();

        // push group to user groups
        let user = await User.findById(req.user.id);
        user.groups.push(group._id);
        await user.save();

        return res.json({ group, success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

// remove group from user listing
router.delete("/", authenticate, async (req, res) => {
    try {
        // remove member from group members array
        const group = await Group.findById(req.body.id);
        group.members = group.members.filter((_id) => _id != req.user.id);
        await group.save();

        // remove group from user group list
        let user = await User.findById(req.user.id);
        user.groups = user.groups.filter((_id) => _id != req.body.id);
        user = await user.save();

        return res.json({ user, success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

// delete group
router.delete("/:id", authenticate, async (req, res) => {
    try {
        // check to see if user is in group
        let user = await User.findById(req.user.id);

        if (!user.groups.includes(req.params.id)) {
            return res.json({ msg: "You do not have permission to access that group." });
        }

        // filter out the group being deleted from the user groups array
        user.groups = user.groups.filter((id) => id != req.params.id);
        user = await user.save();

        let group = await Group.findById(req.params.id).populate("Bookmark");

        // just to be safe, check if the group even exists in the db
        if (!group) {
            return res.json({
                msg: "In a strange turn of events, it seems that this group does not exist!"
            });
        }

        // delete all bookmarks contained in the group
        for (let bookmark of group.bookmarks) {
            group.bookmarks.id(bookmark._id).remove();
        }

        await group.remove();

        return res.json({ user, success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

module.exports = router;
