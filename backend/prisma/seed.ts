import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 1. Buat permissions dulu
  const manageUsers = await prisma.permission.upsert({
    where: { permission: 'manage_users' },
    update: {},
    create: {
      permission: 'manage_users',
      description: 'Manage Users',
    },
  })

  const manageContent = await prisma.permission.upsert({
    where: { permission: 'manage_content' },
    update: {},
    create: {
      permission: 'manage_content',
      description: 'Manage Content',
    },
  })

  // 2. Buat role dan kaitkan dengan permission
  const superadminRole = await prisma.role.upsert({
    where: { role: 'superadmin' },
    update: {},
    create: {
      role: 'superadmin',
      description: 'Super Administrator',
      permissions: {
        create: [
          {
            permission: {
              connect: { id: manageUsers.id },
            },
          },
          {
            permission: {
              connect: { id: manageContent.id },
            },
          },
        ],
      },
    },
  })

  // 3. Buat user dan kaitkan dengan role
  const superadminUser = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      status: 'active',
      imagePath: '',
      roles: {
        create: {
          role: {
            connect: {
              id: superadminRole.id,
            },
          },
        },
      },
    },
  })

  console.log('Seed selesai:', superadminUser)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
