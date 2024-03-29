const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth");

// Bookmark model
const Bookmark = require("../../models/Bookmark");

// @route GET api/bookmarks
// @desc  Read all Bookmarks
// @access public
router.get("/", authenticate, (req, res) => {
    // read bookmarks from db and send json to listener
    Bookmark.find()
        .sort({ date: -1 }) // descending date
        .then((bookmarks) => res.json(bookmarks))
        .catch((err) => console.log(err));
});

// @route POST api/bookmarks
// @desc  Create a Bookmark
// @access public
router.post("/", authenticate, (req, res) => {
    const newBookmark = new Bookmark({
        title: req.body.title,
        author: req.body.author
    });

    // save bookmark to db and respond with new db entry
    newBookmark
        .save()
        .then((bookmark) => res.json(bookmark))
        .catch((err) => console.log(err));
});

// @route UPDATE api/bookmarks
// @desc  Update a Bookmark
// @access public
router.put("/:id", authenticate, (req, res) => {
    // responds with updated bookmark
    Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((bookmark) => res.json(bookmark))
        .catch((err) => res.json(err));
});

// @route DELETE api/bookmarks
// @desc  Delete a Bookmark
// @access public
router.delete("/:id", authenticate, (req, res) => {
    // find and remove bookmark, respond with success or failure
    Bookmark.findById(req.params.id)
        .then((item) => item.remove())
        .then(() => res.json({ success: true }))
        .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
