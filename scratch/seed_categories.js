const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../prisma/generated/client'));
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Ceramic', slug: 'ceramic', description: 'Durable and versatile ceramic tiles for walls and floors.' },
    { name: 'Marble', slug: 'marble', description: 'Luxurious natural marble tiles with elegant veining patterns.' },
    { name: 'Porcelain', slug: 'porcelain', description: 'High-density porcelain tiles suitable for high-traffic areas.' },
    { name: 'Stone', slug: 'stone', description: 'Rustic natural stone tiles for indoor and outdoor spaces.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories seeded successfully.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
