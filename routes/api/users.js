const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authentication = require("../../middleware/auth");

const User = require("../../models/User");

// TODO: Create put route for user password updates
// TODO: Make email strings all lowercase before adding to DB
// TODO: Delete all bookmarks from user, when user account is deleted

// @route GET api/users
// @desc  Read all users
// @access public
// FOR DEV USE ONLY, DELETE BEFORE PRODUCTION
router.get("/", async (req, res) => {
    try {
        const users = await User.find().populate("groups");
        return res.json(users);
    } catch (err) {
        return res.json(err);
    }
});

// @route POST api/users
// @desc  Create new User
// @access public
router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    // check if required fields were not entered
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    // check for existing user
    User.findOne({ email }).then((user) => {
        if (user) return res.status(400).json({ msg: "That email is already in use." });
    });

    // create new user object
    const newUser = new User({
        name,
        email
    });

    try {
        // hash password and insert into user object
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newUser.salt = salt;
        newUser.password = hash;

        // add user to db
        const user = await newUser.save();

        // get Authentication Token (currently expires in 1 hour)
        const token = jwt.sign({ id: user._id }, config.get("jwtSecret"), { expiresIn: 3600 });

        // respond with Auth token and new user json
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});

// @route UPDATE api/users
// @desc   update User
// @access public
router.put("/", authentication, async (req, res) => {
    // reject password changes on this route
    if (req.body.password)
        return res.status(400).json({ msg: "Try this on the change password form instead!" });

    try {
        // check if email is in use already, reject request if so (if email is in body)
        if (req.body.email) {
            const existingUser = await User.findOne({ email: req.body.email });

            if (existingUser) return res.status(400).json({ msg: "That email is already in use." });
        }

        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });

        return res.json({ user, success: true });
    } catch (err) {
        return res.json({ err, success: false });
    }
});

// @route DELETE api/users
// @desc  Delete User
// @access public
router.delete("/", authentication, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        await user.remove();
        return res.json({ success: true });
    } catch (err) {
        return res.json({ success: false });
    }
});

module.exports = router;
