import { db } from "../../config/database";
import { users, type NewUser } from "../../db/schema/user.schema";
import { eq } from "drizzle-orm";

export const userRepository = {

  findAll: async () => {
    return await db.select().from(users);
  },

  findById: async (id: number) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] ?? null;
  },

  findByEmail: async (email: string) => {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] ?? null;
  },

  create: async (data: NewUser) => {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  update: async (id: number, data: Partial<NewUser>) => {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] ?? null;
  },

  delete: async (id: number) => {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return result[0] ?? null;
  },
};