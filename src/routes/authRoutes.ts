import { Router } from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { register, login } from "../controllers/authController";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
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

export default router;
