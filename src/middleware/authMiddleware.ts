import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { AuthenticatedRequest, User } from "../models/authModel";

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    logger.warn("No token provided");
    res.status(401).json({ message: 'No token provided' });
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
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
    req.user = decoded as User;
    req.user.id = (decoded as any).userId; 
    logger.info(`Token verified for user ${req.user.id}`);
    next();
  });
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`User ${req.user?.id} is not authorized`);
      res.status(403).json({ message: 'Forbidden: Insufficient role' });
      return;
    }
    next();
  };
}
export { AuthenticatedRequest };

