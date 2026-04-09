import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env";

const accessSecret = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

export type JwtPayload = {
  userId: string;
  email:  string;
  role:   string;
};

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRE)
    .sign(accessSecret);
}

export async function signRefreshToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_TOKEN_EXPIRE)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function parseExpireToDate(expire: string): Date {
  const unit = expire.slice(-1);
  const value = Number(expire.slice(0, -1));
  const ms = unit === "d"
    ? value * 86400000
    : unit === "h"
      ? value * 3600000
      : value * 60000;
  return new Date(Date.now() + ms);
}
