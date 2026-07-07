import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ISearchTerm } from "./gear.interface";

const getGearDb = async (query: ISearchTerm) => {
  const { search, category, brand, minPrice, maxPrice, availability } = query;

  const where: Prisma.ItemWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && {
      category: {
        OR: [
          { slug: { equals: category, mode: "insensitive" } },
          { name: { equals: category, mode: "insensitive" } },
        ],
      },
    }),
    ...(brand && { brand: { equals: brand, mode: "insensitive" } }),
    ...((minPrice || maxPrice) && {
      pricePerDay: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(availability && { isAvailable: availability === "true" }),
  };

  const result = await prisma.item.findMany({
    where,
    include: {
      category: { select: { name: true, slug: true } },
      provider: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getGearByIdDb = async (id: string) => {
  const result = await prisma.item.findUniqueOrThrow({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      provider: { select: { id: true, name: true, email: true } },
      reviews: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          customer: { select: { name: true } },
        },
      },
    },
  });

  return result;
};

export { getGearByIdDb, getGearDb };
