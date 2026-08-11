const { PrismaClient, UserRole } = require('../prisma/generated/client');
const bcrypt = require('../server/node_modules/bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('--- CHECKING / SEEDING ADMIN ACCOUNT ---');
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin@123';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`User ${adminEmail} already exists with ID: ${existingUser.id}, Role: ${existingUser.role}`);
    if (existingUser.role !== UserRole.ADMIN || existingUser.isDeleted) {
      console.log('Updating user role to ADMIN and setting isDeleted = false...');
      const updated = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: UserRole.ADMIN, isDeleted: false },
      });
      console.log('Updated admin user:', updated.id, updated.role);
    }
  } else {
    console.log(`Creating new Admin user ${adminEmail}...`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        passwordHash: passwordHash,
        role: UserRole.ADMIN,
      },
    });
    console.log('Successfully created Admin user:', newAdmin.id, newAdmin.email, newAdmin.role);
  }

  await prisma.$disconnect();
}

seedAdmin().catch((err) => {
  console.error('Error seeding admin account:', err);
  process.exit(1);
});
