import { Request } from "express";

/**
 * @interface User
 * @property {string} id - The unique identifier for the user
 * @property {string} name - The name of the user
 * @property {string} email - The email address of the user
 * @property {string} password - The hashed password of the user
 * @property {string} role - The role of the user
 * @property {string} signature - The role of the user
 * @property {string} [timezone] - The timezone of the user
 * @property {Report[]} [Report] - The reports associated with the user
 * @property {Date} createdAt - The date the user was created
 * @property {Date} updatedAt - The date the user was last updated
 * @property {string} [resetPasswordToken] - The token used for password reset
 * @property {Date} [resetPasswordTokenExpiry] - The expiry date of the reset password token
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; 
  role: string;
  signature?: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
  Report?: Report[];
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
}

/**
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @property {User} [user] - The authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
}
