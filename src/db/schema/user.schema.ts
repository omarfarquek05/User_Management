import { uuid, pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { roles } from "./rbac.schema";

export const users = pgTable("users", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      varchar("name", { length: 100 }).notNull(),
  email:     varchar("email", { length: 255 }).notNull().unique(),
  password:  text("password").notNull(),
  roleId:    uuid("role_id").references(() => roles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User    = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;