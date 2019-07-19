const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");
const Group = require("../../models/Group");

// router.get()

// TODO: create group method
//       post bookmark to group method
//       add user to group??
// router.post("/", authenticate, async (req, res) => {
//     // find user from auth token userId
//     const user = await User.findById(req.user.id);

//     // get Group name from body and create Group
//     const name = res.body.name;
//     const newGroup = new Group({
//         name,
//         members: [user._id]
//     });

//     newGroup = await newGroup.save();

//     // add group to current user and save it
//     user.groups.push(newGroup);
//     user = user.save();

//     return res.json({
//         user: {
//             id: user.
//         }
//     })
// });

module.exports = router;
