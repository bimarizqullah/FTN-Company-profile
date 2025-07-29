import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 1. Hash password
  const superPassword = await bcrypt.hash('superadmin123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // 2. Seed permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { permission: 'manage_users' },
      update: {},
      create: {
        permission: 'manage_users',
        description: 'Manage Users',
      },
    }),
    prisma.permission.upsert({
      where: { permission: 'manage_content' },
      update: {},
      create: {
        permission: 'manage_content',
        description: 'Manage Content',
      },
    }),
  ])

  // 3. Seed roles
  const superadminRole = await prisma.role.upsert({
    where: { role: 'superadmin' },
    update: {},
    create: {
      role: 'superadmin',
      description: 'Super Administrator',
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { role: 'admin' },
    update: {},
    create: {
      role: 'admin',
      description: 'Administrator',
    },
  })

  // 4. Hubungkan role ke permission
  await prisma.rolePermission.createMany({
    data: permissions.map((p) => ({
      roleId: superadminRole.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  })

  // 5. Tambahkan user superadmin dan admin
  const superadminUser = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: superPassword,
      imagePath: '',
      status: 'active',
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      imagePath: '',
      status: 'active',
    },
  })

  // 6. Hubungkan user ke role
  await prisma.userRole.createMany({
    data: [
      { userId: superadminUser.id, roleId: superadminRole.id },
      { userId: adminUser.id, roleId: adminRole.id },
    ],
    skipDuplicates: true,
  })

  console.log('Seeder berhasil dijalankan!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
