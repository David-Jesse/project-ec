import { PrismaClient } from "../../generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaBase = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const prisma = prismaBase.$extends({
  query: {
    cart: {
      async update({ args, query }) {
        args.data = { ...args.data, updatedAt: new Date() };
        return query(args);
      },
    },
  },
});
// sourcery skip: use-braces
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaBase;

export default prisma;
