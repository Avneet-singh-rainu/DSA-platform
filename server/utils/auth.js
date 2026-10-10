const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES = "7d";

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role || "user" },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES,
    }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}

module.exports = { signToken, authMiddleware, adminMiddleware, JWT_SECRET };
