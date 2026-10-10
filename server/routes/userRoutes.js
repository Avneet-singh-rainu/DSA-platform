const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { withId } = require("../utils/serialize");

// find user(s) by name (kept array response for compat with old User.find)
router.get("/:name", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { name: req.params.name },
      include: { completed: true },
    });
    if (!users || users.length === 0)
      return res.status(404).json({ message: "no user found" });
    return res.status(200).json(withId(users));
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
});

// find user(s) by id (kept array response: old code did User.find({_id}) -> [user])
router.get("/id/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { completed: true },
    });
    if (!user) return res.status(404).json({ message: "no user found" });
    return res.status(200).json(withId([user]));
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
});

// add new user
router.post("/", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        bookmarks: req.body.bookmarks || [],
      },
      include: { completed: true },
    });
    return res.status(200).json(withId(user));
  } catch (error) {
    console.log(error.message);
    // P2002 = unique constraint (user already exists)
    if (error.code === "P2002") {
      return res.status(409).json("user already exists");
    }
    res.status(400).json(error.message);
  }
});

// toggle bookmark: POST /user/:userId/:bookmark (bookmark = topic id)
router.post("/:userId/:bookmark", async (req, res) => {
  try {
    const { userId, bookmark } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let newBookmarks;
    let message;
    if (user.bookmarks.includes(bookmark)) {
      newBookmarks = user.bookmarks.filter((b) => b !== bookmark);
      message = "Bookmark removed";
    } else {
      newBookmarks = [...user.bookmarks, bookmark];
      message = "Bookmark added";
    }
    await prisma.user.update({
      where: { id: userId },
      data: { bookmarks: { set: newBookmarks } },
    });
    return res.status(200).json({ message });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// toggle complete: PUT /user/:userId/complete/:complete (complete = topic id)
router.put("/:userId/complete/:complete", async (req, res) => {
  try {
    const { userId, complete } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await prisma.completed.findUnique({
      where: { userId_questionId: { userId, questionId: complete } },
    });

    if (existing) {
      await prisma.completed.delete({ where: { id: existing.id } });
      return res
        .status(200)
        .json({ message: "Question removed from completed list" });
    } else {
      await prisma.completed.create({
        data: { userId, questionId: complete },
      });
      return res
        .status(200)
        .json({ message: "Question added to completed list" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// last month questions solved data
router.get("/:userId/topics-solved-this-month", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { completed: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const topicsSolvedThisMonth = user.completed.filter(
      (t) => t.completedAt >= startOfMonth && t.completedAt < endOfMonth
    );

    const solvedPerDay = Array(31).fill(0);
    topicsSolvedThisMonth.forEach((t) => {
      const day = new Date(t.completedAt).getDate() - 1;
      solvedPerDay[day]++;
    });
    res.json({ solvedPerDay });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

module.exports = router;
