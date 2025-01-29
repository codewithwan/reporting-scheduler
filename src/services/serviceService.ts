import { PrismaClient } from "@prisma/client";
import { Service } from "../models/serviceModel";

const prisma = new PrismaClient();

/**
 * Get all customers.
 * @returns {Promise<Service[]>} - The list of customers
 */
export const getAllServicesService = async (): Promise<Service[]> => {
    return prisma.service.findMany();
  };