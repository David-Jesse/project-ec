import { PrismaClient } from "../../generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prismaBase = globalForPrisma.prisma || new PrismaClient();

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
