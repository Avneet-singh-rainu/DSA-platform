const User = require("../models/userModel");
const express = require("express");
const router = express.Router();

//todoe find user by name for now
router.get("/:name", async (req, res) => {
    try {
        const user = await User.find({ name: req.params.name });
        if (!user) return res.status(404).json({ message: "no user found" });
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(404).json(error.message);
    }
});
//todo find user by id for now
router.get("/id/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const user = await User.find({ _id: req.params.id });
        if (!user) return res.status(404).json({ message: "no user found" });
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(404).json(error.message);
    }
});

//todo add new user
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

//todo change bookmark

router.post("/:userId/:bookmark", async (req, res) => {
    try {
        const { userId, bookmark } = req.params;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.bookmarks.includes(bookmark)) {
            await User.updateOne(
                { _id: userId },
                { $pull: { bookmarks: bookmark } }
            );
            return res.status(200).json({ message: "Bookmark removed" });
        } else {
            await User.updateOne(
                { _id: userId },
                { $push: { bookmarks: bookmark } }
            );
            return res.status(200).json({ message: "Bookmark added" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

//todo update completed by id
router.put("/:userId/complete/:complete", async (req, res) => {
    try {
        const { userId, complete } = req.params;
        console.log(userId, complete);
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.completed.includes(complete)) {
            await User.updateOne(
                { _id: userId },
                { $pull: { completed: complete } }
            );
            return res.status(200).json({ message: "Completed" });
        } else {
            await User.updateOne(
                { _id: userId },

                { $push: { completed: complete } }
            );
            return res.status(200).json({ message: "Not completed" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


//TODO last month questions solved data
router.get("/:userId/topics-solved-this-month", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Define the start and end of the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        // Filter completed topics to only include those completed in the current month
        const topicsSolvedThisMonth = user.completed.filter(
            (t) =>
                t.completionDate >= startOfMonth &&
            t.completionDate < endOfMonth
        );

        console.log(topicsSolvedThisMonth);
        // Count topics solved per day in the current month
        const solvedPerDay = Array(31).fill(0);
        topicsSolvedThisMonth.forEach((t) => {
            const day = t.completionDate.getDate() - 1; // Days start at 0
            solvedPerDay[day]++;
        });

        res.json({ solvedPerDay });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
module.exports = router;
