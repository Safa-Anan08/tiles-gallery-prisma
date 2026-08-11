const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const prisma = new PrismaClient();

async function migrateMessages() {
  console.log("=== STEP 4: MIGRATING MESSAGES DATA TO POSTGRESQL ===");

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  const tilesDb = mongoClient.db("tilesDB");

  const mongoMessages = await tilesDb.collection("messages").find({}).toArray();

  // Save backup
  const backupDir = path.join(__dirname, "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  fs.writeFileSync(path.join(backupDir, "messages_backup.json"), JSON.stringify(mongoMessages, null, 2));
  console.log(`Saved JSON backup to ${backupDir}`);

  let migratedCount = 0;
  for (const doc of mongoMessages) {
    const messageId = doc._id.toString();

    await prisma.message.upsert({
      where: { id: messageId },
      update: {
        name: doc.name || "Anonymous",
        email: doc.email || "unknown@example.com",
        message: doc.message || "",
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
      },
      create: {
        id: messageId,
        name: doc.name || "Anonymous",
        email: doc.email || "unknown@example.com",
        message: doc.message || "",
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
      },
    });
    migratedCount++;
  }

  console.log(`\nMigrated ${migratedCount} Message records into PostgreSQL.`);

  console.log("\n=== STEP 5: VERIFYING MIGRATED MESSAGES ===");
  const postMessageCount = await prisma.message.count();
  console.log(`- MongoDB Messages count: ${mongoMessages.length}`);
  console.log(`- PostgreSQL Message count: ${postMessageCount}`);

  const match = mongoMessages.length === postMessageCount;
  console.log(`- Count Match Result: ${match ? "PASSED" : "FAILED"}`);

  await mongoClient.close();
  console.log("==========================================");
}

migrateMessages()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
