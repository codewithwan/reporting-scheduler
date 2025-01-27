import { Request, Response } from "express";
import logger from "../utils/logger";
import { createProductService, getProductService, getAllProductsService, updateProductService, deleteProductService } from "../services/productService";
import { AuthenticatedRequest } from "../models/userModel";

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { brand, model, customerId, serialNumber, description } = req.body;

  try {
    const product = await createProductService({
      brand,
      model,
      customerId,
      serialNumber,
      description: description || null,
    });
    logger.info(`Product ${product.id} created successfully`);
    res.status(201).json(product);
  } catch (error) {
    logger.error("Failed to create product", { error });
    res.status(500).json({ message: "An unexpected error occurred while creating the product. Please try again later.", error: (error as Error).message });
  }
};

export const getProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await getProductService(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    logger.error("Failed to retrieve product", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving the product. Please try again later.", error: (error as Error).message });
  }
};

export const getAllProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    logger.error("Failed to retrieve products", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving products. Please try again later.", error: (error as Error).message });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { brand, model, customerId, serialNumber, description } = req.body;

  try {
    const product = await updateProductService(id, {
      brand,
      model,
      customerId,
      serialNumber,
      description: description || null,
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    logger.error("Failed to update product", { error });
    res.status(500).json({ message: "An unexpected error occurred while updating the product. Please try again later.", error: (error as Error).message });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await deleteProductService(id);
    if (!deleted) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete product", { error });
    res.status(500).json({ message: "An unexpected error occurred while deleting the product. Please try again later.", error: (error as Error).message });
  }
};
