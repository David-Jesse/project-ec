import { PrismaClient } from "../../generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

// sourcery skip: use-braces
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;