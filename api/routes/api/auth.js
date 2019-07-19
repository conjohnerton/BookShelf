const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middleware/auth");

const User = require("../../models/User");

// @route POST api/auth
// @desc  Authenticate user
// @access public
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    // check if required fields were not entered
    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "That user does not exist" });
        }

        // check for password match
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "You have entered the wrong passoword :(" });
        }

        // generate json web token (can set expiresIn option if desired)
        const token = await jwt.sign({ id: user.id }, config.get("jwtSecret"));

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

// @route GET api/auth/user
// @desc Get user data
// @access Private
router.get("/", authenticate, (req, res) => {
    // get user information EXCEPT for password
    User.findById(req.user.id)
        .select("-password")
        .then((user) => res.json(user));
});

module.exports = router;
