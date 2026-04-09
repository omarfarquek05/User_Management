// src/modules/rbac/rbac.repository.ts

import { db } from "../../config/database";
// src/modules/rbac/rbac.repository.ts (নতুন methods যোগ করো)
import { roles, permissions, rolePermissions, users } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const rbacRepository = {

  // ── existing methods (আগের মতোই) ─────────────────────────────

  async getPermissionsByUserId(userId: string): Promise<string[]> {
    const rows = await db
      .select({ permission: permissions.name })
      .from(users)
      .innerJoin(roles,           eq(users.roleId,                 roles.id))
      .innerJoin(rolePermissions, eq(rolePermissions.roleId,       roles.id))
      .innerJoin(permissions,     eq(rolePermissions.permissionId, permissions.id))
      .where(eq(users.id, userId));
    return rows.map((r) => r.permission);
  },

  async getAllRoles() {
    return db.select().from(roles);
  },

  async getAllPermissions() {
    return db.select().from(permissions);
  },

  async assignRoleToUser(userId: string, roleId: string) {
    const rows = await db
      .update(users)
      .set({ roleId })
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name, email: users.email, roleId: users.roleId });
    return rows[0] ?? null;
  },

  // ── 🆕 Role CRUD ──────────────────────────────────────────────

  async createRole(name: string, description?: string) {
    const rows = await db
      .insert(roles)
      .values({ name, description })
      .onConflictDoNothing()
      .returning();
    return rows[0] ?? null;
  },

  async updateRole(id: string, name: string) {
    const rows = await db
      .update(roles)
      .set({ name })
      .where(eq(roles.id, id))
      .returning();
    return rows[0] ?? null;
  },

  async deleteRole(id: string) {
    // role_permissions cascade delete হবে automatically
    const rows = await db
      .delete(roles)
      .where(eq(roles.id, id))
      .returning();
    return rows[0] ?? null;
  },

  async getRoleById(id: string) {
    const rows = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  // ── 🆕 Role-Permission Mapping ────────────────────────────────

  async getPermissionsByRoleId(roleId: string) {
    return db
      .select({ id: permissions.id, name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));
  },

  async addPermissionToRole(roleId: string, permissionId: string) {
    const rows = await db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .onConflictDoNothing()
      .returning();
    return rows[0] ?? null;
  },

  async removePermissionFromRole(roleId: string, permissionId: string) {
  const rows = await db
    .delete(rolePermissions)
    .where(
      and( // 'and' ইমপোর্ট করতে হবে drizzle-orm থেকে
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      )
    )
    .returning();
  return rows[0] ?? null;
},

  // ── 🆕 Permission sync (code → DB) ───────────────────────────

  async syncPermissions(permissionNames: string[]) {
    const values = permissionNames.map((name) => ({ name, description: name }));
    return db
      .insert(permissions)
      .values(values)
      .onConflictDoNothing() // আগে থেকে থাকলে skip
      .returning();
  },
};