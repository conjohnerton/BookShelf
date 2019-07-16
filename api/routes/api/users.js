const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authentication = require("../../middleware/auth");

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
        const token = jwt.sign({ id: user.id }, config.get("jwtSecret"), { expiresIn: 3600 });

        // respond with Auth token and new user json
        res.json({
            token,
            user: {
                id: user.id,
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
router.delete("/:id", authentication, (req, res) => {
    User.findById(req.params.id)
        .then((user) => user.remove())
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err), () => res.json({ success: false }));
});

module.exports = router;
