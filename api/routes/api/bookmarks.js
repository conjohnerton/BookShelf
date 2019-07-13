const express = require("express");
const router = express.Router();

// Bookmark model
const Bookmark = require("../../models/Bookmark");

// @route GET api/bookmarks
// @desc  Get all Bookmarks
// @access public
router.get("/", (req, res) => {
    // read bookmarks from db and send json to listener
    Bookmark.find()
        .then((bookmarks) => res.json(bookmarks))
        .catch((err) => console.log(err));
});

// @route POST api/bookmarks
// @desc  Create a Bookmark
// @access public
router.post("/", (req, res) => {
    const newBookmark = new Bookmark({
        title: req.body.title,
        author: req.body.author
    });

    newBookmark.save().then((bookmarks) => res.json(bookmarks));
});

// @route DELETE api/bookmarks
// @desc  Delete a Bookmark
// @access public
router.delete("/:id", (req, res) => {
    // find and remove bookmark, respond with success or failure
    Bookmark.findById(req.params.id)
        .then((item) => item.remove())
        .then(() => res.json({ success: true }))
        .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
