require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./utils/prisma");
const topicRoutes = require("./routes/topicRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
const RAW_FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const FRONTEND_URL = RAW_FRONTEND_URL.replace(/\/+$/, "");
const ALLOWED_ORIGINS = new Set([
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
]);
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / non-browser clients (no Origin header),
      // exact matches, and any Netlify deploy preview.
      if (
        !origin ||
        ALLOWED_ORIGINS.has(origin.replace(/\/+$/, "")) ||
        /\.netlify\.app$/.test(origin)
      ) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked for origin ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));

// Health check (Render / Neon debugging)
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (e) {
    res.status(500).json({ status: "error", db: "disconnected", error: String(e).slice(0, 200) });
  }
});

// Routes
app.use("/api/topics", topicRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "EATCODE API running (Postgres/Neon + Prisma)" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to Postgres (Neon)");
  } catch (error) {
    console.error("Failed to connect to Postgres. Set DATABASE_URL in .env", error.message);
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

// graceful shutdown for serverless/ephemeral hosts
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
