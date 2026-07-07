import { prisma } from "../../lib/prisma";

const getGearDb = async (category?: string, price?: string, brand?: string) => {
  const result = await prisma.item.findMany({
    // where: {
    //   categoryId: category ? { equals: category } : undefined,
    //   price: price ? { equals: price } : undefined,
    //   brand: brand ? { equals: brand } : undefined,
    // },
  });
  return result;
};

export { getGearDb };
