import { Request } from "express";

export interface User {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
