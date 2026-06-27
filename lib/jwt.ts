// lib/jwt.ts
import jwt, { type SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export const signJwt = (payload: object, expiresIn: SignOptions["expiresIn"] = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};
