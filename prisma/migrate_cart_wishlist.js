const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const prisma = new PrismaClient();

async function migrateCartAndWishlist() {
  console.log("=== STEP 4 & 5: MIGRATING CART & WISHLIST DATA TO POSTGRESQL ===");

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  const tilesDb = mongoClient.db("tilesDB");

  const mongoCart = await tilesDb.collection("cart").find({}).toArray();
  const mongoWishlist = await tilesDb.collection("wishlist").find({}).toArray();

  // Save backups
  const backupDir = path.join(__dirname, "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  fs.writeFileSync(path.join(backupDir, "cart_backup.json"), JSON.stringify(mongoCart, null, 2));
  fs.writeFileSync(path.join(backupDir, "wishlist_backup.json"), JSON.stringify(mongoWishlist, null, 2));
  console.log(`Saved JSON backups to ${backupDir}`);

  // Fetch PostgreSQL User email->id mapping and Tile ID set
  const pgUsers = await prisma.user.findMany({ select: { id: true, email: true } });
  const pgTiles = await prisma.tile.findMany({ select: { id: true } });

  const userEmailToIdMap = new Map(pgUsers.map((u) => [u.email, u.id]));
  const validTileIds = new Set(pgTiles.map((t) => t.id));

  // Migrate Cart Items
  console.log("\nMigrating Cart Items...");
  let migratedCart = 0;
  for (const doc of mongoCart) {
    const userId = userEmailToIdMap.get(doc.userEmail);
    const tileId = doc.tileId;

    if (!userId || !validTileIds.has(tileId)) {
      console.log(`- Skipping cart item (${doc.userEmail}, tileId: ${tileId}): invalid user or missing tile`);
      continue;
    }

    await prisma.cartItem.upsert({
      where: {
        userId_tileId: {
          userId,
          tileId,
        },
      },
      update: {
        quantity: doc.quantity || 1,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
      create: {
        userId,
        tileId,
        quantity: doc.quantity || 1,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
    });
    migratedCart++;
  }

  // Migrate Wishlist Items
  console.log("\nMigrating Wishlist Items...");
  let migratedWishlist = 0;
  for (const doc of mongoWishlist) {
    const userId = userEmailToIdMap.get(doc.userEmail);
    const tileId = doc.tileId;

    if (!userId || !validTileIds.has(tileId)) {
      console.log(`- Skipping wishlist item (${doc.userEmail}, tileId: ${tileId}): invalid user or missing tile`);
      continue;
    }

    await prisma.wishlistItem.upsert({
      where: {
        userId_tileId: {
          userId,
          tileId,
        },
      },
      update: {
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
      create: {
        userId,
        tileId,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      },
    });
    migratedWishlist++;
  }

  console.log("\n=== STEP 9: POSTGRESQL CART & WISHLIST VERIFICATION ===");
  const cartCount = await prisma.cartItem.count();
  const wishlistCount = await prisma.wishlistItem.count();

  console.log(`- PostgreSQL CartItem count: ${cartCount} (expected ${migratedCart})`);
  console.log(`- PostgreSQL WishlistItem count: ${wishlistCount} (expected ${migratedWishlist})`);

  // Verify joins
  const sampleCart = await prisma.cartItem.findFirst({ include: { tile: true, user: true } });
  if (sampleCart) {
    console.log(`- Sample CartItem relation check: User email=${sampleCart.user.email}, Tile title='${sampleCart.tile.title}', price=$${sampleCart.tile.price}`);
  }

  await mongoClient.close();
  console.log("======================================================");
}

migrateCartAndWishlist()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
