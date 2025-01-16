import { Router } from "express";

const router = Router();

// Tambahkan endpoint di sini
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

export default router;
