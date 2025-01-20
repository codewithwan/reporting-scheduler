import { Router } from "express";
import { checkDatabaseHealth } from "../services/healthService";

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
  const isDatabaseHealthy = await checkDatabaseHealth();
  if (isDatabaseHealthy) {
    res.status(200).json({ status: "healthy", message: "Database connection is healthy" });
  } else {
    res.status(500).json({ status: "unhealthy", message: "Database connection is not healthy" });
  }
});

export default router;
