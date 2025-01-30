import { PrismaClient } from "@prisma/client";
import { CreateServiceInput, Service } from "../models/serviceModel";

const prisma = new PrismaClient();

/**
 * Get all customers.
 * @returns {Promise<Service[]>} - The list of customers
 */
export const getAllServicesService = async (): Promise<Service[]> => {
    return prisma.service.findMany();
  };

  /**
 * Create a new service.
 * @param {CreateServiceInput} data - The data for creating a new service
 * @returns {Promise<Service>} - The created service
 */
export const createService = async (data: CreateServiceInput): Promise<Service> => {
  return prisma.service.create({
    data: {
      name: data.name,
    },
  });
};