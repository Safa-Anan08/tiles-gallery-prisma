const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const counts = {
    user: await prisma.user.count(),
    session: await prisma.session.count(),
    account: await prisma.account.count(),
    verification: await prisma.verification.count(),
    tiles: await prisma.tile.count(),
    cart: await prisma.cartItem.count(),
    wishlist: await prisma.wishlistItem.count(),
    messages: await prisma.message.count(),
  };

  console.log("=== BEFORE MIGRATION ROW COUNTS ===");
  console.log(JSON.stringify(counts, null, 2));

  const sampleUser = await prisma.user.findFirst({ select: { id: true, email: true, name: true } });
  const sampleTile = await prisma.tile.findFirst({ select: { id: true, title: true, price: true } });
  const sampleCart = await prisma.cartItem.findFirst({ select: { id: true, userId: true, tileId: true } });

  console.log("\n=== SAMPLE DATA FOR ID & RELATION PRESERVATION ===");
  console.log("Sample User:", sampleUser);
  console.log("Sample Tile:", sampleTile);
  console.log("Sample CartItem:", sampleCart);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
