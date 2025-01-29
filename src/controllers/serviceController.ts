import { Request, Response } from "express";
import logger from "../utils/logger";
import { createService, getAllServicesService} from "../services/serviceService";
import { AuthenticatedRequest } from "../models/userModel";

/**
 * Get all service.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getAllService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const service = await getAllServicesService();
      res.status(200).json(service);
    } catch (error) {
      logger.error("Failed to retrieve customers", { error });
      res.status(500).json({ message: "An unexpected error occurred while retrieving services. Please try again later.", error: (error as Error).message });
    }
  };

  /**
 * Create a new service
 */
export const createServiceController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name} = req.body;

    if (!name) {
      res.status(400).json({ message: "Service name is required" });
      return;
    }

    const service = await createService({ name });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service", error: (error as Error).message });
  }
};
  
  