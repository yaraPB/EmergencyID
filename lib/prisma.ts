let PrismaClient: any

try {
  const mod = require('@prisma/client')
  PrismaClient = mod.PrismaClient
} catch (e) {
  PrismaClient = null
}

const globalForPrisma = globalThis as unknown as { prisma: any }

function createPrismaClient() {
  if (!PrismaClient) return null
  try {
    return new PrismaClient({ log: [] })
  } catch (e) {
    return null
  }
}

export const prisma: any =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
