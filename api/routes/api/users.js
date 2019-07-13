const express = require("express");
const router = express.Router();

const User = require("../../models/User");

// @route GET api/users
// @desc  Read all users
// @access public
router.get("/", (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => console.log(err));
});

// @route POST api/users
// @desc  Create new User
// @access public
router.post("/", (req, res) => {
    const newUser = new User({
        name: req.body.name
    });

    newUser
        .save()
        .then((user) => res.json(user))
        .catch((err) => console.log(err));
});

// @route UPDATE api/users
// @desc   update User
// @access public
router.put("/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});

// @route DELETE api/users
// @desc  Delete User
// @access public
router.delete("/:id", (req, res) => {
    User.findById(req.params.id)
        .then((user) => user.remove())
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err), () => res.json({ success: false }));
});

module.exports = router;
