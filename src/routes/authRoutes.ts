import { Router } from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { register, login, createUserByAdmin } from "../controllers/authController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, // For testing
    message: "Too many attempts from this IP, please try again after 15 minutes",
});

router.post(
  "/register",
  authLimiter,
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

router.post(
  "/login",
  authLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  login
);

router.post(
  "/create-user",
  authenticateToken,
  authorizeRoles("SUPERADMIN"),
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["ENGINEER", "ADMIN"]),
  createUserByAdmin
);

export default router;
