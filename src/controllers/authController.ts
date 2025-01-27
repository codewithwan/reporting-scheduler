import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { validationResult } from "express-validator";
import { findUserByEmail, createUser, createUserWithRole, findUserById, generatePasswordResetToken, resetUserPassword } from "../services/userService";
import { AuthenticatedRequest } from "../models/userModel";
import { sendEmailWithTemplate } from "../utils/emailService"; 

/**
 * Register a new user.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "This email is already registered. Please use a different email." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role: "ENGINEER"
    });
    logger.info(`User ${user.id} registered successfully`);
    res.status(201).json({ 
      message: "User registered successfully", 
      user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      createdAt: user.createdAt, 
      updatedAt: user.updatedAt 
      } 
    });
  } catch (error) {
    logger.error("User registration failed", error);
    res.status(500).json({ error: "An unexpected error occurred during registration. Please try again later." });
  }
};

/**
 * Login a user.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email); 
    if (!user) {
      logger.warn(`Login failed for email: ${email} - User not found`);
      res.status(401).json({ error: "Invalid email or password. Please try again." });
      return;
    }
    if (!user.password) {
      logger.warn(`Login failed for email: ${email} - Password is undefined`);
      res.status(403).json({ error: "Invalid email or password. Please try again." });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed for email: ${email} - Invalid password`);
      res.status(403).json({ error: "Invalid email or password. Please try again." });
      return;
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    if (!process.env.JWT_REFRESH) {
      throw new Error("JWT_REFRESH is not defined");
    }
    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_REFRESH, { expiresIn: process.env.JWT_REFRESH_EXPIRY });
    logger.info(`User ${user.id} logged in successfully`);
    res.status(200).json({ message: "Login successful", token, refreshToken });
  } catch (error) {
    logger.error("Login failed", error);
    res.status(500).json({ error: "An unexpected error occurred during login. Please try again later." });
  }
};

/**
 * Create a new user by admin.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createUserByAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const adminRole = req.user?.role;

  if (adminRole !== "SUPERADMIN") {
    res.status(403).json({ error: "Access denied. Only superadmins can create users." });
    return;
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "This email is already registered. Please use a different email." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserWithRole({ name, email, password: hashedPassword, role });

    logger.info(`User ${user.id} created successfully by ${adminRole}`);
    res.status(201).json({ message: "User created successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    logger.error("User creation failed", error);
    res.status(500).json({ error: "An unexpected error occurred during user creation. Please try again later." });
  }
};

/**
 * Refresh tokens.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token is required" });
    return;
  }

  try {
    const refreshSecret = process.env.JWT_REFRESH;
    if (!refreshSecret) {
      throw new Error("JWT_REFRESH is not defined");
    }

    const decoded = jwt.verify(refreshToken, refreshSecret) as { userId: string, role: string };
    const user = await findUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    const newRefreshToken = jwt.sign({ userId: user.id, role: user.role }, refreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRY });

    res.status(200).json({ message: "Token refreshed successfully", token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    logger.error("Failed to refresh token", error);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};

/**
 * Request a password reset.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const { token } = await generatePasswordResetToken(email);

    const clientDomain = process.env.NODE_ENV === "production" ? process.env.CLIENT_DOMAIN : "http://localhost:5137";
    const resetLink = `${clientDomain}/reset-password?token=${token}`;

    const templateData = {
      resetLink,
      companyName: process.env.COMPANY_NAME,
    };

    await sendEmailWithTemplate(email, "Password Reset Request", "passwordReset", templateData);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    logger.error("Password reset request failed", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
};

/**
 * Reset password.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  try {
    await resetUserPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    logger.error("Password reset failed", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
};