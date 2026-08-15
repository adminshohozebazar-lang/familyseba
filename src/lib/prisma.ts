import { PrismaClient } from "@prisma/client";

// Reuses a single PrismaClient across hot reloads in development. Without this,
// every file edit would create a new client and eventually exhaust the DB connection pool.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
