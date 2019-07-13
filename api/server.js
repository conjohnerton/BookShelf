const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// capture model routes
const bookmarks = require("./routes/api/bookmarks");

// set express configs
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set db configs and connect to db
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("MongoDb Connected..."))
    .catch((err) => console.log(err));

app.use("/api/bookmarks", bookmarks);

// config host port and instantiate listener
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
