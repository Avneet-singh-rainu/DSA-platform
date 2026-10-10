const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { withId } = require("../utils/serialize");

// GET /api/topics -> all topics, optional ?track=DSA filter
router.get("/", async (req, res) => {
  try {
    const where = req.query.track
      ? { track: { equals: String(req.query.track), mode: "insensitive" } }
      : undefined;
    const topics = await prisma.topic.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
    res.json(withId(topics));
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Error fetching topics" });
  }
});

// GET /api/topics/tracks -> [{ track, topics, problems }]
router.get("/tracks", async (req, res) => {
  try {
    const all = await prisma.topic.findMany({
      select: { track: true, name: true },
    });
    const map = new Map();
    for (const t of all) {
      const key = (t.track || "DSA").trim() || "DSA";
      if (!map.has(key)) map.set(key, { track: key, topics: new Set(), problems: 0 });
      const entry = map.get(key);
      entry.topics.add((t.name || "Misc").trim());
      entry.problems++;
    }
    const tracks = [...map.values()]
      .map((e) => ({ track: e.track, topics: e.topics.size, problems: e.problems }))
      .sort((a, b) => b.problems - a.problems);
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ message: "Error fetching tracks" });
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

    const and = [
      {
        OR: [
          { name: { equals: raw, mode: "insensitive" } },
          { name: { equals: singular, mode: "insensitive" } },
        ],
      },
    ];
    if (req.query.track) {
      and.push({
        track: { equals: String(req.query.track), mode: "insensitive" },
      });
    }

    const dataByName = await prisma.topic.findMany({ where: { AND: and } });
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
