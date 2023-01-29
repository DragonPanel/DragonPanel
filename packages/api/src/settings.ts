import { randomBytes } from "crypto";

export const JWT_SECRET = process.env.JWT_SECRET || randomBytes(16).toString("base64");
