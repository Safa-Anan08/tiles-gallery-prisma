const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("=== PRIMA SEED: TILE CATALOG ===");

  // Read db.json
  const dbPath = path.join(__dirname, "..", "db.json");
  if (!fs.existsSync(dbPath)) {
    throw new Error(`db.json file not found at ${dbPath}`);
  }

  const rawData = fs.readFileSync(dbPath, "utf-8");
  const db = JSON.parse(rawData);

  if (!db.tiles || !Array.isArray(db.tiles)) {
    throw new Error("Invalid db.json structure: missing 'tiles' array.");
  }

  console.log(`Found ${db.tiles.length} tiles in db.json. Seeding into PostgreSQL...`);

  let count = 0;
  for (const tile of db.tiles) {
    await prisma.tile.upsert({
      where: { id: tile.id },
      update: {
        title: tile.title,
        description: tile.description,
        image: tile.image,
        category: tile.category,
        price: tile.price,
        currency: tile.currency || "USD",
        dimensions: tile.dimensions,
        material: tile.material,
        tags: tile.tags || [],
        inStock: tile.inStock ?? true,
      },
      create: {
        id: tile.id,
        title: tile.title,
        description: tile.description,
        image: tile.image,
        category: tile.category,
        price: tile.price,
        currency: tile.currency || "USD",
        dimensions: tile.dimensions,
        material: tile.material,
        tags: tile.tags || [],
        inStock: tile.inStock ?? true,
      },
    });
    count++;
  }

  console.log(`Successfully seeded ${count} tiles into PostgreSQL database 'tiles_gallery_db'.`);
  console.log("================================");
}

main()
  .catch((e) => {
    console.error("Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
