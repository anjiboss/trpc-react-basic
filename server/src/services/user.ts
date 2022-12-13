import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAll = async () => {
  return prisma.user.findMany();
};

const findWithId = async (id: string) => {
  return prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });
};

const create = async (options: { name: string }) => {
  return await prisma.user.create({
    data: {
      ...options,
    },
  });
};

export const userService = {
  getAll,
  findWithId,
  create,
};
