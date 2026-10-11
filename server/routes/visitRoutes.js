const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authMiddleware, adminMiddleware } = require("../utils/auth");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  const raw = (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim();
  return raw || req.socket?.remoteAddress || "unknown";
}

// POST /api/visits { path, userId? } — public beacon, never fails hard
router.post("/", async (req, res) => {
  try {
    const path = String(req.body?.path || "/").slice(0, 200);
    if (!path.startsWith("/")) return res.status(400).json({ message: "bad path" });
    const day = today();
    const ipHash = crypto
      .createHash("sha256")
      .update(`${clientIp(req)}|${day}`)
      .digest("hex");
    const userId =
      typeof req.body?.userId === "string" && req.body.userId.length > 0
        ? req.body.userId.slice(0, 64)
        : null;
    await prisma.visit.create({ data: { path, day, ipHash, userId } });
    return res.status(201).json({ ok: true });
  } catch (e) {
    // Analytics must never break the app
    return res.status(200).json({ ok: false });
  }
});

// GET /api/visits/stats?days=30 — admin only
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - (days - 1));
    const sinceDay = since.toISOString().slice(0, 10);

    const [perDay, topPaths, topTracks, signups, totals] = await Promise.all([
      prisma.$queryRaw`
        SELECT day, COUNT(*)::int AS views, COUNT(DISTINCT "ipHash")::int AS visitors
        FROM "Visit" WHERE day >= ${sinceDay}
        GROUP BY day ORDER BY day ASC`,
      prisma.$queryRaw`
        SELECT path, COUNT(*)::int AS views, COUNT(DISTINCT "ipHash")::int AS visitors
        FROM "Visit" WHERE day >= ${sinceDay}
        GROUP BY path ORDER BY views DESC LIMIT 20`,
      prisma.$queryRaw`
        SELECT SPLIT_PART(path, '/', 3) AS track, COUNT(*)::int AS views,
               COUNT(DISTINCT "ipHash")::int AS visitors
        FROM "Visit" WHERE day >= ${sinceDay} AND path LIKE '/topics/%'
        GROUP BY track ORDER BY views DESC LIMIT 20`,
      prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM-DD') AS day, COUNT(*)::int AS signups
        FROM "User" WHERE "createdAt" >= ${since.toISOString()}::timestamptz
        GROUP BY day ORDER BY day ASC`,
      prisma.$queryRaw`
        SELECT COUNT(*)::int AS views, COUNT(DISTINCT "ipHash")::int AS visitors
        FROM "Visit" WHERE day >= ${sinceDay}`,
    ]);

    res.json({ days, perDay, topPaths, topTracks, signups, totals: totals[0] });
  } catch (e) {
    console.error("stats failed:", e.message);
    res.status(500).json({ message: "stats failed" });
  }
});

module.exports = router;
