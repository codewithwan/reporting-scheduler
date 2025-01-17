import { Router } from "express";
import {prisma} from "../config/prismaClient";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *       500:
 *         description: API is unhealthy
 */
router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "healthy", message: "Database connection is healthy" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", message: "Database connection is not healthy" });
  }
});

export default router;
