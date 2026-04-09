// src/modules/rbac/rbac.service.ts

import { rbacRepository } from "./rbac.repository";
import { type Permission, PERMISSIONS } from "../../constants/permissions";

const cache = new Map<string, { perms: string[]; exp: number }>();
const TTL = 5 * 60 * 1000;

export const rbacService = {

  // ── 🆕 যোগ করা হয়েছে (Fix for Controller Error) ──────────────────────────
  async getMyRole(userId: string) {
    // ইউজারের বর্তমান পারমিশনগুলো নিয়ে আসা (ক্যাশে থাকলে ক্যাশ থেকে নেবে)
    const perms = await rbacService.getCachedPermissions(userId);
    
    // আপনি চাইলে ইউজারের বেসিক ইনফো এবং পারমিশন একসাথে পাঠাতে পারেন
    return {
      userId,
      permissions: perms
    };
  },

  // ── Existing Methods ──────────────────────────────────────────

  async hasPermission(userId: string, required: Permission[]): Promise<boolean> {
    const userPerms = await rbacService.getCachedPermissions(userId);
    return required.every((p) => userPerms.includes(p));
  },

  async getCachedPermissions(userId: string): Promise<string[]> {
    const hit = cache.get(userId);
    if (hit && Date.now() < hit.exp) return hit.perms;
    
    // Repository থেকে ডাটা আনার সময় userId এখন string (UUID অনুযায়ী)
    const perms = await rbacRepository.getPermissionsByUserId(userId);
    cache.set(userId, { perms, exp: Date.now() + TTL });
    return perms;
  },

  invalidateCache(userId: string) { cache.delete(userId); },
  invalidateAllCache()            { cache.clear(); },

  async listRoles()       { return rbacRepository.getAllRoles(); },
  async listPermissions() { return rbacRepository.getAllPermissions(); },

  async assignRole(targetUserId: string, roleId: string) {
    const updated = await rbacRepository.assignRoleToUser(targetUserId, roleId);
    if (!updated) throw new Error("User not found");
    rbacService.invalidateCache(targetUserId);
    return updated;
  },

  // ── Role CRUD ──────────────────────────────────────────────

  async createRole(name: string, description?: string) {
    const normalized = name.toLowerCase().trim();
    const role = await rbacRepository.createRole(normalized, description);
    if (!role) throw new Error(`Role '${normalized}' already exists`);
    return role;
  },

  async updateRole(id: string, name: string) {
    const role = await rbacRepository.updateRole(id, name.toLowerCase().trim());
    if (!role) throw new Error("Role not found");
    rbacService.invalidateAllCache(); 
    return role;
  },

  async deleteRole(id: string) {
    const role = await rbacRepository.deleteRole(id);
    if (!role) throw new Error("Role not found");
    rbacService.invalidateAllCache();
    return role;
  },

  // ── Role-Permission Mapping ────────────────────────────────

  async getRolePermissions(roleId: string) {
    const role = await rbacRepository.getRoleById(roleId);
    if (!role) throw new Error("Role not found");
    const perms = await rbacRepository.getPermissionsByRoleId(roleId);
    return { role, permissions: perms };
  },

  async addPermissionToRole(roleId: string, permissionId: string) {
    const result = await rbacRepository.addPermissionToRole(roleId, permissionId);
    rbacService.invalidateAllCache(); 
    return result;
  },

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const result = await rbacRepository.removePermissionFromRole(roleId, permissionId);
    rbacService.invalidateAllCache();
    return result;
  },

  async syncPermissionsFromCode() {
    const allPerms = Object.values(PERMISSIONS);
    const synced = await rbacRepository.syncPermissions(allPerms);
    return {
      total:  allPerms.length,
      synced: synced.length,      
      skipped: allPerms.length - synced.length, 
    };
  },
};