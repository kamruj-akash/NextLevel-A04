import { prisma } from "../../lib/prisma";
interface GearPayload {
  id?: string;
  name: string;
  description: string;
  brand: string;
  images: string[];
  pricePerDay: number;
  stock: number;
  specifications: string[];
  isAvailable: boolean;
  avgRating: number;
  
}

const addGearDb = async (payload: GearPayload) => {
  const result = await prisma.item.create({
    data: payload,
  });
};
