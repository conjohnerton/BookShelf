const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");
const Group = require("../../models/Group");

// get current users groups
router.get("/", authenticate, async (req, res) => {
    try {
        const userGroups = User.findById(req.user.id).populate("Groups");
        res.json(userGroups);
    } catch (err) {
        return res.json(err);
    }
});

// TODO: create group method
//       post bookmark to group method
//       add user to group??
router.post("/", authenticate, async (req, res) => {
    try {
        // find user from auth token userId
        const user = await User.findById(req.user.id);

        // get Group name from body and create Group
        const newGroup = new Group({
            name: req.body.name,
            members: [user._id]
        });

        await newGroup.save();

        // add group to current user and save it
        user.groups.push(newGroup);
        await user.save();

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

module.exports = router;
