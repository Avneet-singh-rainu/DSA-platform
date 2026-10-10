// Keep frontend working: it uses `topic._id` / `user._id` (Mongo style).
// Postgres/Prisma uses `id`. We return both.
function withId(doc) {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(withId);
  return { ...doc, _id: doc.id };
}

module.exports = { withId };
