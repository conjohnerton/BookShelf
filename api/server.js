const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

// set express configs
const app = express();
app.use(express.json());

// set db configs and connect to db
const db = config.get("mongoURI");
mongoose
    .connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("MongoDb Connected..."))
    .catch((err) => console.log(err));

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/userGroups", require("./routes/api/userGroups"));
app.use("/api/innerGroups", require("./routes/api/innerGroups"));
app.use("/api/bookmarks", require("./routes/api/bookmarks"));

// config host port and instantiate listener
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
