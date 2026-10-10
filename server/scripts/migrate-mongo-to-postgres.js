// One-time copy: MongoDB -> Neon Postgres (uses plain mongodb driver, no mongoose)
// Usage:
//   1. Set MONGO_URL and DATABASE_URL in .env
//   2. npm install -D mongodb (only for migration)
//   3. Run: npm run migrate:mongo
//
// Copies Topic + User (+ nested completed[]) preserving old _id strings
// as new Postgres `id` so frontend bookmarks/completions keep working.

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!process.env.MONGO_URL) throw new Error("Set MONGO_URL in .env");
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env");

  const mongo = new MongoClient(process.env.MONGO_URL);
  await mongo.connect();
  console.log("Mongo connected");
  const db = mongo.db();

  // collection names could be `topics`/`users` or `Topics` — try both
  const topicCol =
    (await db.listCollections({ name: "topics" }).hasNext())
      ? db.collection("topics")
      : db.collection("Topic");
  const userCol = (await db.listCollections({ name: "users" }).hasNext())
    ? db.collection("users")
    : db.collection("User");

  const topicDocs = await topicCol.find({}).toArray().catch(() => []);
  console.log(`Found ${topicDocs.length} topics in Mongo`);

  for (const t of topicDocs) {
    const id = String(t._id);
    await prisma.topic.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name: t.name ?? null,
        title: t.title ?? null,
        desc: t.desc ?? null,
        difficulty: t.difficulty ?? null,
        videoUrl: t.videoUrl ?? null,
        link: t.link ?? null,
        tags: Array.isArray(t.tags) ? t.tags.map(String) : [],
        code: Array.isArray(t.code) ? t.code.map(String) : [],
        exampleImages: Array.isArray(t.exampleImages)
          ? t.exampleImages.map(String)
          : [],
        examples: t.examples ?? undefined,
        testcasecode: t.testcasecode ?? null,
        mainmethode: t.mainmethode ?? null,
      },
    });
  }
  console.log("Topics migrated");

  const userDocs = await userCol.find({}).toArray().catch(() => []);
  console.log(`Found ${userDocs.length} users in Mongo`);

  for (const u of userDocs) {
    const id = String(u._id);
    if (!u.name) continue;
    await prisma.user.upsert({
      where: { id },
      update: {
        name: u.name,
        bookmarks: Array.isArray(u.bookmarks) ? u.bookmarks.map(String) : [],
      },
      create: {
        id,
        name: u.name,
        bookmarks: Array.isArray(u.bookmarks) ? u.bookmarks.map(String) : [],
      },
    });

    if (Array.isArray(u.completed)) {
      for (const c of u.completed) {
        if (!c.questionId) continue;
        await prisma.completed.upsert({
          where: {
            userId_questionId: { userId: id, questionId: String(c.questionId) },
          },
          update: {},
          create: {
            userId: id,
            questionId: String(c.questionId),
            completedAt: c.completedAt ? new Date(c.completedAt) : new Date(),
          },
        });
      }
    }
  }
  console.log("Users + completed migrated");

  await mongo.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
