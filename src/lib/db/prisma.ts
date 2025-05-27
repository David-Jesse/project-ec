import { Prisma, PrismaClient } from "@prisma/client";

export const cartExtension = Prisma.defineExtension({
  query: {
    cart: {
      async update({ args, query }) {
        // args and query are now properly typed!
        if (typeof args.data === "object" && args.data !== null && !ArrayBuffer.isView(args.data)) {
          args.data = {
            ...args.data,
            updatedAt: new Date(),
          };
        }
        return query(args);
      },
    },
  },
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaBase =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

export const prisma = prismaBase.$extends(cartExtension);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaBase;

export default prisma;