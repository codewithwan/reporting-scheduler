import { Request } from "express";

/**
 * @interface User
 * @property {string} id - The unique identifier for the user
 * @property {string} role - The role of the user
 */
export interface User {
  id: string;
  role: string;
}

/**
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @property {User} [user] - The authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
}
