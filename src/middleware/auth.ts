import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { AuthenticatedRequest, User } from "../models/auth";

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    logger.warn("No token provided");
    res.sendStatus(401);
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("JWT_SECRET is not defined");
    res.sendStatus(500);
    return;
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      logger.warn("Token verification failed");
      res.sendStatus(403);
      return;
    }
    req.user = decoded as User;
    logger.info(`Token verified for user ${req.user.id}`);
    next();
  });
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`User ${req.user?.id} is not authorized`);
      res.sendStatus(403);
      return;
    }
    next();
  };
}
export { AuthenticatedRequest };

