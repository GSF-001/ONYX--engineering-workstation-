import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export interface JwtPayload {
  userId: number;
  sessionId: string;
}

export function signJwt(payload: JwtPayload, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
