import { PrismaClient, status_enum } from '@prisma/client';
import { hash } from 'bcryptjs'; // Untuk hash password pengguna

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (opsional, untuk reset)
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Seed data untuk Role
  const adminRole = await prisma.role.create({
    data: {
      role: 'admin',
      description: 'Administrator role',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      role: 'user',
      description: 'Regular user role',
    },
  });

  // Seed data untuk Permission
  const readPermission = await prisma.permission.create({
    data: {
      permission: 'read',
      description: 'Read permission',
    },
  });

  const writePermission = await prisma.permission.create({
    data: {
      permission: 'write',
      description: 'Write permission',
    },
  });

  // Hubungkan Role dengan Permission
  await prisma.rolePermission.createMany({
    data: [
      { roleId: adminRole.id, permissionId: readPermission.id },
      { roleId: adminRole.id, permissionId: writePermission.id },
      { roleId: userRole.id, permissionId: readPermission.id },
    ],
  });

  // Seed data untuk User
  const hashedPassword = await hash('password123', 10); // Hash password
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      status: status_enum.active,
      roles: {
        create: { roleId: adminRole.id },
      },
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      status: status_enum.active,
      roles: {
        create: { roleId: userRole.id },
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });