require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const topicRoutes = require("./routes/topicRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Database Connection
const connectDB = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/eatcode").then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

connectDB();

// Routes
app.use("/api/topics", topicRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});
