import { PrismaClient } from "@prisma/client";
import { Customer } from "../models/customerModel";

const prisma = new PrismaClient();

/**
 * Create a new customer.
 * @param {Omit<Customer, "id" | "createdAt" | "updatedAt">} data - The data for creating a new customer
 * @returns {Promise<Customer>} - The created customer
 */
export const createCustomerService = async (data: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> => {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        id: undefined,
      },
    });
    return customer;
  } catch (error) {
    if ((error as any).code === "P2002" && (error as any).meta.target.includes("email")) {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

/**
 * Get a customer by ID.
 * @param {string} id - The ID of the customer
 * @returns {Promise<Customer | null>} - The customer, or null if not found
 */
export const getCustomerService = async (id: string): Promise<Customer | null> => {
  return prisma.customer.findUnique({
    where: { id },
  });
};

/**
 * Get all customers.
 * @returns {Promise<Customer[]>} - The list of customers
 */
export const getAllCustomersService = async (): Promise<Customer[]> => {
  return prisma.customer.findMany();
};

/**
 * Update a customer by ID.
 * @param {string} id - The ID of the customer
 * @param {Partial<Customer>} data - The data to update the customer with
 * @returns {Promise<Customer | null>} - The updated customer, or null if not found
 */
export const updateCustomerService = async (id: string, data: Partial<Customer>): Promise<Customer | null> => {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data,
    });
    return customer;
  } catch (error) {
    if ((error as any).code === "P2025") {
      return null; 
    }
    throw error;
  }
};

/**
 * Delete a customer by ID.
 * @param {string} id - The ID of the customer
 * @returns {Promise<boolean>} - Whether the customer was deleted successfully
 */
export const deleteCustomerService = async (id: string): Promise<boolean> => {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if ((error as any).code === "P2025") {
      return false; 
    }
    throw error;
  }
};