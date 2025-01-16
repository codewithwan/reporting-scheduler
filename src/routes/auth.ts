import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import logger from "../utils/logger";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

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
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "engineer",
        },
      });
      logger.info(`User ${user.id} registered successfully`);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      logger.error("User registration failed", error);
      res.status(400).json({ error: "User registration failed" });
    }
  }
);

router.post(
  "/login",
  authLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        logger.warn(`Login failed for email: ${email}`);
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.warn(`Login failed for email: ${email}`);
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      logger.info(`User ${user.id} logged in successfully`);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      logger.error("Login failed", error);
      res.status(400).json({ error: "Login failed" });
    }
  }
);

export default router;
