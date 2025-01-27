import { Request, Response } from "express";
import logger from "../utils/logger";
import { createCustomerService, getCustomerService, getAllCustomersService, updateCustomerService, deleteCustomerService } from "../services/customerService";
import { AuthenticatedRequest } from "../models/userModel";

/**
 * Create a new customer.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, company, position, email, phoneNumber, address } = req.body;

  if (!name || !company || !email || !phoneNumber) {
    res.status(400).json({ message: "Invalid input. Please provide all required fields." });
    return;
  }

  try {
    const customer = await createCustomerService({
      name,
      company,
      position: position || null,
      email,
      phoneNumber,
      address: address || null,
    });
    logger.info(`Customer ${customer.id} created successfully`);
    res.status(201).json(customer);
  } catch (error) {
    if ((error as Error).message === "Email already exists") {
      res.status(400).json({ message: "Email already exists. Please use a different email." });
    } else {
      logger.error("Failed to create customer", { error });
      res.status(500).json({ message: "An unexpected error occurred while creating the customer. Please try again later.", error: (error as Error).message });
    }
  }
};

/**
 * Get a customer by ID.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const customer = await getCustomerService(id);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json(customer);
  } catch (error) {
    logger.error("Failed to retrieve customer", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving the customer. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Get all customers.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getAllCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customers = await getAllCustomersService();
    res.status(200).json(customers);
  } catch (error) {
    logger.error("Failed to retrieve customers", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving customers. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Update a customer by ID.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, company, position, email, phoneNumber, address } = req.body;

  try {
    const customer = await updateCustomerService(id, {
      name,
      company,
      position: position || null,
      email,
      phoneNumber,
      address: address || null,
    });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json(customer);
  } catch (error) {
    logger.error("Failed to update customer", { error });
    res.status(500).json({ message: "An unexpected error occurred while updating the customer. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Delete a customer by ID.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const deleteCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await deleteCustomerService(id);
    if (!deleted) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete customer", { error });
    res.status(500).json({ message: "An unexpected error occurred while deleting the customer. Please try again later.", error: (error as Error).message });
  }
};
