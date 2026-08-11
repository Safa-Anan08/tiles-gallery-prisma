const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const mongoUri = process.env.MONGODB_URI;
const prisma = new PrismaClient();

async function migrateAuthData() {
  console.log("=== STEP 1 & 2: PRE-MIGRATION VALIDATION & BACKUP ===");

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  // 1. Connect to MongoDB Atlas (READ ONLY)
  console.log("Connecting to MongoDB Atlas...");
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const mongoDb = mongoClient.db("test");

  // Read MongoDB collections
  const mongoUsers = await mongoDb.collection("user").find({}).toArray();
  const mongoAccounts = await mongoDb.collection("account").find({}).toArray();
  const mongoSessions = await mongoDb.collection("session").find({}).toArray();
  const mongoVerifications = await mongoDb.collection("verification").find({}).toArray();

  console.log(`MongoDB source document counts: Users=${mongoUsers.length}, Accounts=${mongoAccounts.length}, Sessions=${mongoSessions.length}, Verifications=${mongoVerifications.length}`);

  // Create local JSON backups directory
  const backupDir = path.join(__dirname, "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  fs.writeFileSync(path.join(backupDir, "users_backup.json"), JSON.stringify(mongoUsers, null, 2));
  fs.writeFileSync(path.join(backupDir, "accounts_backup.json"), JSON.stringify(mongoAccounts, null, 2));
  fs.writeFileSync(path.join(backupDir, "sessions_backup.json"), JSON.stringify(mongoSessions, null, 2));
  fs.writeFileSync(path.join(backupDir, "verifications_backup.json"), JSON.stringify(mongoVerifications, null, 2));
  console.log(`Saved full JSON backups to ${backupDir}`);

  // Set of valid user IDs
  const validUserIds = new Set(mongoUsers.map((u) => u._id.toString()));

  console.log("\n=== STEP 3 & 4: MIGRATING AUTHENTICATION DATA TO POSTGRESQL ===");

  // A. Migrate Users
  console.log(`Migrating ${mongoUsers.length} Users...`);
  for (const doc of mongoUsers) {
    const userId = doc._id.toString();
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: doc.name || null,
        email: doc.email,
        emailVerified: doc.emailVerified ?? false,
        image: doc.image || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
      create: {
        id: userId,
        name: doc.name || null,
        email: doc.email,
        emailVerified: doc.emailVerified ?? false,
        image: doc.image || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
    });
  }

  // B. Migrate Accounts (Filter orphaned records)
  const validAccounts = mongoAccounts.filter((a) => a.userId && validUserIds.has(a.userId.toString()));
  const orphanedAccountsCount = mongoAccounts.length - validAccounts.length;
  console.log(`Migrating ${validAccounts.length} valid Accounts (${orphanedAccountsCount} orphaned records skipped)...`);

  for (const doc of validAccounts) {
    const accountId = doc._id.toString();
    const userId = doc.userId.toString();

    await prisma.account.upsert({
      where: { id: accountId },
      update: {
        userId: userId,
        accountId: doc.accountId || accountId,
        providerId: doc.providerId || "credential",
        accessToken: doc.accessToken || null,
        refreshToken: doc.refreshToken || null,
        idToken: doc.idToken || null,
        accessTokenExpiresAt: doc.accessTokenExpiresAt ? new Date(doc.accessTokenExpiresAt) : null,
        refreshTokenExpiresAt: doc.refreshTokenExpiresAt ? new Date(doc.refreshTokenExpiresAt) : null,
        scope: doc.scope || null,
        password: doc.password || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
      create: {
        id: accountId,
        userId: userId,
        accountId: doc.accountId || accountId,
        providerId: doc.providerId || "credential",
        accessToken: doc.accessToken || null,
        refreshToken: doc.refreshToken || null,
        idToken: doc.idToken || null,
        accessTokenExpiresAt: doc.accessTokenExpiresAt ? new Date(doc.accessTokenExpiresAt) : null,
        refreshTokenExpiresAt: doc.refreshTokenExpiresAt ? new Date(doc.refreshTokenExpiresAt) : null,
        scope: doc.scope || null,
        password: doc.password || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
    });
  }

  // C. Migrate Sessions (Filter orphaned records)
  const validSessions = mongoSessions.filter((s) => s.userId && validUserIds.has(s.userId.toString()));
  const orphanedSessionsCount = mongoSessions.length - validSessions.length;
  console.log(`Migrating ${validSessions.length} valid Sessions (${orphanedSessionsCount} orphaned records skipped)...`);

  for (const doc of validSessions) {
    const sessionId = doc._id.toString();
    const userId = doc.userId.toString();

    await prisma.session.upsert({
      where: { id: sessionId },
      update: {
        userId: userId,
        token: doc.token,
        expiresAt: new Date(doc.expiresAt),
        ipAddress: doc.ipAddress || null,
        userAgent: doc.userAgent || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
      create: {
        id: sessionId,
        userId: userId,
        token: doc.token,
        expiresAt: new Date(doc.expiresAt),
        ipAddress: doc.ipAddress || null,
        userAgent: doc.userAgent || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
    });
  }

  // D. Migrate Verifications
  console.log(`Migrating ${mongoVerifications.length} Verifications...`);
  for (const doc of mongoVerifications) {
    const verificationId = doc._id.toString();
    await prisma.verification.upsert({
      where: { id: verificationId },
      update: {
        identifier: doc.identifier,
        value: doc.value,
        expiresAt: new Date(doc.expiresAt),
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
      create: {
        id: verificationId,
        identifier: doc.identifier,
        value: doc.value,
        expiresAt: new Date(doc.expiresAt),
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
    });
  }

  console.log("\n=== STEP 5: VERIFYING MIGRATED POSTGRESQL DATA ===");

  const postCounts = {
    user: await prisma.user.count(),
    account: await prisma.account.count(),
    session: await prisma.session.count(),
    verification: await prisma.verification.count(),
  };

  console.log("PostgreSQL row counts after migration:", postCounts);

  const countsMatch =
    postCounts.user === mongoUsers.length &&
    postCounts.account === validAccounts.length &&
    postCounts.session === validSessions.length &&
    postCounts.verification === mongoVerifications.length;

  console.log(`\nRow Count Match Result: ${countsMatch ? "PASSED" : "FAILED"}`);

  // Check Foreign Key Integrity
  const allPostUsers = await prisma.user.findMany({ select: { id: true } });
  const postUserIds = new Set(allPostUsers.map((u) => u.id));
  const postAccounts = await prisma.account.findMany({ select: { id: true, userId: true } });
  const postSessions = await prisma.session.findMany({ select: { id: true, userId: true } });

  const orphanedAccounts = postAccounts.filter((a) => !postUserIds.has(a.userId)).length;
  const orphanedSessions = postSessions.filter((s) => !postUserIds.has(s.userId)).length;

  console.log(`Foreign Key Check: Orphaned Accounts=${orphanedAccounts}, Orphaned Sessions=${orphanedSessions}`);
  console.log(`FK Integrity Result: ${orphanedAccounts === 0 && orphanedSessions === 0 ? "PASSED" : "FAILED"}`);

  await mongoClient.close();
  console.log("=================================================");
}

migrateAuthData()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
