import { Router } from "express";
import {prisma} from "../config/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "healthy", message: "Database connection is healthy" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", message: "Database connection is not healthy" });
  }
});

export default router;
