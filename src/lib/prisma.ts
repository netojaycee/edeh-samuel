import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Neon's compute suspends after inactivity — give it time to wake up
  connectionTimeoutMillis: 30000,
  // Release idle connections before Neon suspends them (avoids ETIMEDOUT)
  idleTimeoutMillis: 10000,
  max: 5,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
