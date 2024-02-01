import {PrismaClient} from '@prisma/client';

let prisma: PrismaClient | null = null;

export const getPrismaInstance = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};
