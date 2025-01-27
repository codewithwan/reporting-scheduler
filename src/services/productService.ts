import { PrismaClient } from "@prisma/client";
import { Product } from "../models/productModel";

const prisma = new PrismaClient();

export const createProductService = async (data: Omit<Product, "id" | "createdAt" | "updatedAt" | "purchaseDate" | "warrantyExpiry">): Promise<Product> => {
  const product = await prisma.product.create({ data });
  return product;
};

export const getProductService = async (id: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
};

export const getAllProductsService = async (): Promise<Product[]> => {
  const products = await prisma.product.findMany();
  return products;
};

export const updateProductService = async (id: string, data: Partial<Product>): Promise<Product | null> => {
  try {
    const product = await prisma.product.update({ where: { id }, data });
    return product;
  } catch (error) {
    if ((error as any).code === "P2025") {
      return null;
    }
    throw error;
  }
};

export const deleteProductService = async (id: string): Promise<boolean> => {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch (error) {
    if ((error as any).code === "P2025") {
      return false;
    }
    throw error;
  }
};
