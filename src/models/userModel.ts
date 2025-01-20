import { Request } from "express";

/**
 * @interface User
 * @property {string} id - The unique identifier for the user
 * @property {string} name - The name of the user
 * @property {string} email - The email address of the user
 * @property {string} password - The hashed password of the user
 * @property {string} role - The role of the user
 * @property {string} [timezone] - The timezone of the user
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  timezone?: string;
}

/**
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @property {User} [user] - The authenticated user
 */


export interface AuthenticatedRequest extends Request {
  user?: User;
}
