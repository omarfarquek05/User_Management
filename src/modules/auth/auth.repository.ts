import { db } from "../../config/database";
import { users, refreshTokens } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authRepository = {
  async findUserByEmail(email: string) {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return rows[0] ?? null;
  },

  async findUserById(id: string) {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return rows[0] ?? null;
  },

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    const rows = await db
      .insert(refreshTokens)
      .values({ userId, token, expiresAt })
      .returning();

    return rows[0];
  },

  async findRefreshToken(token: string) {
    const rows = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    return rows[0] ?? null;
  },

  async deleteRefreshToken(token: string) {
    return await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, token));
  },

  async deleteAllRefreshTokensByUserId(userId: string) {
    return await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, userId));
  },
};
