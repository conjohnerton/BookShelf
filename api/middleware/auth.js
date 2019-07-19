const config = require("config");
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const token = req.header("x-auth-token");

    // send noAuth message if there was no token in headers
    if (!token) {
        return res.status(401).json({ msg: "You are not authorized to access this page." });
    }

    try {
        // verify valid token
        const decodedToken = jwt.verify(token, config.get("jwtSecret"));

        // add user located in decodedToken to headers
        // (allows for accessing current user data in any authenticated route)
        // THIS IS REALLY AWESOME
        req.user = decodedToken;
        next();
    } catch (err) {
        res.status(400).json({ msg: "Your token is not valid." });
    }
}

module.exports = authenticate;
