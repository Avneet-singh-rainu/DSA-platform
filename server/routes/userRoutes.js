const User = require("../models/userModel");
const express = require("express");
const router = express.Router();

//find user by name for now
router.get("/:name", async (req, res) => {
  try {
    const user = await User.find({ name: req.params.name });
    if (!user) return res.status(404).json({ message: "no user found" });
    console.log(user)
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
});

//add new user
router.post("/", async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
});

//change bookmark

router.post("/:userId/:bookmark", async (req, res) => {
  try {
    const { userId, bookmark } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.bookmarks.includes(bookmark)) {
      await User.updateOne({ _id: userId }, { $pull: { bookmarks: bookmark } });
      return res.status(200).json({ message: "Bookmark removed" });
    } else {
      await User.updateOne({ _id: userId }, { $push: { bookmarks: bookmark } });
      return res.status(200).json({ message: "Bookmark added" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
