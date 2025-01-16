import { Router } from "express";

const router = Router();

// Tambahkan endpoint di sini
router.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

export default router;
