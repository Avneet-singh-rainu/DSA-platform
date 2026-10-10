// Promote a user to admin (run with DB access).
// Usage: node scripts/promote-admin.js you@example.com
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

(async () => {
  const name = process.argv[2];
  if (!name) {
    console.error("Usage: node scripts/promote-admin.js <email>");
    process.exit(1);
  }
  const user = await prisma.user.update({
    where: { name },
    data: { role: "admin" },
  });
  console.log(`Promoted ${user.name} to admin. Log out + log back in.`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e.message);
  await prisma.$disconnect();
  process.exit(1);
});
