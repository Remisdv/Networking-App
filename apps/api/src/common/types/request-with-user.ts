import type { Request } from "express";

type AuthenticatedUser = {
  uid: string;
  email: string | null;
  roles: string[];
};

export type RequestWithUser = Request & { user?: AuthenticatedUser };
