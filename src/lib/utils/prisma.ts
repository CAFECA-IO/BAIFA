import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

globalThis.prismaGlobal = globalThis.prismaGlobal ?? prismaClientSingleton();
const prisma = globalThis.prismaGlobal;

export default prisma;
