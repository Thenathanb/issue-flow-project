import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  })

  const issues: Prisma.IssueCreateInput[] = [
    { title: 'Login page crashes on mobile Safari',  status: 'OPEN',        priority: 'HIGH',   createdBy: { connect: { id: alice.id } }, assignedTo: { connect: { id: bob.id } } },
    { title: 'Dashboard charts not loading',         status: 'IN_PROGRESS', priority: 'HIGH',   createdBy: { connect: { id: bob.id } },   assignedTo: { connect: { id: alice.id } } },
    { title: 'Export to CSV missing headers',        status: 'OPEN',        priority: 'MEDIUM', createdBy: { connect: { id: alice.id } } },
    { title: 'Dark mode toggle resets on refresh',   status: 'OPEN',        priority: 'LOW',    createdBy: { connect: { id: bob.id } },   assignedTo: { connect: { id: bob.id } } },
    { title: 'Search returns wrong results',         status: 'IN_PROGRESS', priority: 'HIGH',   createdBy: { connect: { id: alice.id } }, assignedTo: { connect: { id: alice.id } } },
    { title: 'Email notifications not sending',      status: 'CLOSED',      priority: 'HIGH',   createdBy: { connect: { id: bob.id } },   assignedTo: { connect: { id: bob.id } } },
    { title: 'User avatar not uploading',            status: 'OPEN',        priority: 'MEDIUM', createdBy: { connect: { id: alice.id } } },
    { title: 'Pagination breaks at page 10+',        status: 'CLOSED',      priority: 'MEDIUM', createdBy: { connect: { id: bob.id } },   assignedTo: { connect: { id: alice.id } } },
    { title: 'Password reset link expires too fast', status: 'OPEN',        priority: 'LOW',    createdBy: { connect: { id: alice.id } } },
    { title: 'API rate limit errors in production',  status: 'IN_PROGRESS', priority: 'HIGH',   createdBy: { connect: { id: bob.id } },   assignedTo: { connect: { id: alice.id } } },
  ]

  for (const issue of issues) {
    await prisma.issue.create({ data: issue })
  }

  console.log('✓ Seeded 2 users and 10 issues')
}

main()
  .then(() => {
    console.log('✓ Done')
    process.exit(0)
  })
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
