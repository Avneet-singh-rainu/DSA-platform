const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { withId } = require("../utils/serialize");

// GET /api/topics -> all topics
router.get("/", async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json(withId(topics));
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Error fetching topics" });
  }
});

// POST /api/topics -> single or bulk create
router.post("/", async (req, res) => {
  try {
    const newTopicsData = req.body;

    if (Array.isArray(newTopicsData)) {
      const result = await prisma.topic.createMany({
        data: newTopicsData,
        skipDuplicates: true,
      });
      // createMany returns count only, fetch back for compat
      const saved = await prisma.topic.findMany({
        orderBy: { createdAt: "desc" },
        take: result.count,
      });
      return res.status(201).json(withId(saved));
    } else {
      const newTopic = await prisma.topic.create({
        data: newTopicsData,
      });
      return res.status(201).json(withId(newTopic));
    }
  } catch (error) {
    console.error("Error inserting topics:", error);
    res.status(500).json({ message: "Error inserting topics" });
  }
});

// GET /api/topics/id/:topicId -> single problem by id (for CodeEditor direct load)
router.get("/id/:topicId", async (req, res) => {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: req.params.topicId },
    });
    if (!topic) return res.status(404).json({ message: "topic not found" });
    res.status(200).json(withId(topic));
  } catch (error) {
    res.status(500).json({ message: "Error", error: String(error) });
  }
});

// GET /api/topics/:name -> find by category/name (case-insensitive, plural-tolerant)
// /topics/arrays -> matches DB name "Array", /topics/strings -> "String"
router.get("/:name", async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.name).trim();
    const singular = raw.toLowerCase().endsWith("s") ? raw.slice(0, -1) : raw;

    const dataByName = await prisma.topic.findMany({
      where: {
        OR: [
          { name: { equals: raw, mode: "insensitive" } },
          { name: { equals: singular, mode: "insensitive" } },
        ],
      },
    });
    res.status(200).json(withId(dataByName));
  } catch (error) {
    console.log("error in findByName " + error);
    res.json({ message: "Error", error: String(error) });
  }
});

// POST /api/topics/:id (legacy: update isBookmarked, field doesn't exist in schema)
// Kept for backwards compat — just returns the topic.
router.post("/:id", async (req, res) => {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: req.params.id },
    });
    if (topic) {
      return res.status(200).json(withId(topic));
    }
    return res.status(404).json({ message: "topic not found" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: String(error) });
  }
});

module.exports = router;
