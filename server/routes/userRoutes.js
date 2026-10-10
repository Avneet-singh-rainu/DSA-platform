const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const prisma = require("../utils/prisma");
const { withId } = require("../utils/serialize");
const { signToken, authMiddleware } = require("../utils/auth");

function sanitize(user) {
  if (!user) return user;
  const { passwordHash, ...rest } = user;
  return withId(rest);
}

// POST /user/signup { name, password } -> create with hash + token
router.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password)
      return res.status(400).json({ message: "name and password required" });
    if (String(password).length < 6)
      return res.status(400).json({ message: "password must be >= 6 chars" });

    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing)
      return res.status(409).json({ message: "user already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.create({
      data: { name, passwordHash },
      include: { completed: true },
    });
    const token = signToken(user);
    return res.status(201).json({ token, user: sanitize(user) });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Signup failed" });
  }
});

// POST /user/login { name, password } -> verify + token
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password)
      return res.status(400).json({ message: "name and password required" });

    const user = await prisma.user.findUnique({
      where: { name },
      include: { completed: true },
    });
    if (!user || !user.passwordHash)
      return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    return res.status(200).json({ token, user: sanitize(user) });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /user/me -> current user from token
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.id },
      include: { completed: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(sanitize(user));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Legacy: find user(s) by name — kept for compat, no password exposed
router.get("/:name", async (req, res) => {
  // skip if it hits /signup /login /me /id/...
  if (["signup", "login", "me"].includes(req.params.name)) return res.status(404).json({ message: "not found" });
  try {
    const users = await prisma.user.findMany({
      where: { name: req.params.name },
      include: { completed: true },
    });
    if (!users || users.length === 0)
      return res.status(404).json({ message: "no user found" });
    return res.status(200).json(withId(users.map(sanitize)));
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
});

// find user(s) by id
router.get("/id/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { completed: true },
    });
    if (!user) return res.status(404).json({ message: "no user found" });
    return res.status(200).json(withId([sanitize(user)]));
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
});

// Legacy add new user without password (deprecated, use /signup)
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json("name required");
    // if password supplied, hash it (allows old clients to upgrade)
    let passwordHash;
    if (req.body.password) {
      passwordHash = await bcrypt.hash(String(req.body.password), 10);
    }
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        bookmarks: req.body.bookmarks || [],
        ...(passwordHash ? { passwordHash } : {}),
      },
      include: { completed: true },
    });
    return res.status(200).json(sanitize(user));
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json("user already exists");
    }
    res.status(400).json(error.message);
  }
});

// toggle bookmark: POST /user/:userId/:bookmark — owner only
router.post("/:userId/:bookmark", authMiddleware, async (req, res) => {
  try {
    const { userId, bookmark } = req.params;
    if (req.auth.id !== userId)
      return res.status(403).json({ message: "Forbidden" });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

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

// toggle complete: PUT /user/:userId/complete/:complete — owner only
router.put("/:userId/complete/:complete", authMiddleware, async (req, res) => {
  try {
    const { userId, complete } = req.params;
    if (req.auth.id !== userId)
      return res.status(403).json({ message: "Forbidden" });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await prisma.completed.findUnique({
      where: { userId_questionId: { userId, questionId: complete } },
    });

    if (existing) {
      await prisma.completed.delete({ where: { id: existing.id } });
      return res.status(200).json({ message: "Question removed from completed list" });
    } else {
      await prisma.completed.create({ data: { userId, questionId: complete } });
      return res.status(200).json({ message: "Question added to completed list" });
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
