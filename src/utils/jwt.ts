// src/utils/jwt.ts
import { SignJWT, jwtVerify } from "jose";

// একটি সিক্রেট কি (Secret Key) তৈরি করুন। 
// প্রোডাকশনে এটি .env ফাইল থেকে আসা উচিত।
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-this"
);

export const signJwt = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // ৭ দিন পর টোকেন এক্সপায়ার হবে
    .sign(SECRET);
};

export const verifyJwt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string };
  } catch (error) {
    return null; // টোকেন ইনভ্যালিড হলে null রিটার্ন করবে
  }
};