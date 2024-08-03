const express = require("express");
const router = express.Router();
const Topic = require("../models/topicModel");
const Redis = require("ioredis");
//const redis = new Redis();

// redis.on("connection", () => {
//   console.log("connected to redis");
// });
// redis.on("error", () => {
//   console.log("error connecting to redis");
// });

router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Error fetching topics" });
  }
});

async () => {
  await redis().then(() => {
    console.log("redis connected");
  });
};

//!---------------------------------------------- Create a new topic

router.post("/", async (req, res) => {
  try {
    const newTopicsData = req.body;

    if (Array.isArray(newTopicsData)) {
      // Insert multiple topics using insertMany
      const savedTopics = await Topic.insertMany(newTopicsData);
      return res.status(201).json(savedTopics);
    } else {
      // Insert a single topic
      const newTopic = new Topic(newTopicsData);
      await newTopic.save(); // Save the single document
      return res.status(201).json(newTopic); // Return the saved single topic
    }
  } catch (error) {
    console.error("Error inserting topics:", error);
    res.status(500).json({ message: "Error inserting topics" });
  }
});

//!-------------------------------------------------find by names or category

router.get("/:name", async (req, res) => {
  const cacheData = /*await redis.get(req.params.name)||*/ null;

  if (cacheData) {
    // console.log("this data is cached");
    // return res.status(201).json(JSON.parse(cacheData));
  } else {
    try {
      const dataByName = await Topic.find({ name: req.params.name });
      //await redis.set(req.params.name, JSON.stringify(dataByName));
      console.log("this data is not cached");
      res.status(201).json(dataByName);
    } catch (error) {
      console.log("error in findByName " + error);
      res.json({ message: "Error", error: error });
    }
  }
});

//!-------------------------------------------------------update by id
router.post("/:id", async (req, res) => {
  try {
    const updatedData = await Topic.findByIdAndUpdate(
      { _id: req.params.id },
      { isBookmarked: req.body.isBookmarked }
    );

    if (updatedData) {
      return res.status(201).json(updatedData);
    } else {
      return res.status(401).json({ message: "error while updating data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error: error });
  }
});

// update bookmarks by individual user

module.exports = router;
