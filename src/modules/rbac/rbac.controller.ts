// src/modules/rbac/rbac.controller.ts

import { rbacService } from "./rbac.service";
import { sendSuccess } from "../../utils/response"; // নাম পরিবর্তন করা হয়েছে

export const rbacController = {

  // ── Roles & Permissions List ──────────────────────────────────
  async listRoles() { 
    const data = await rbacService.listRoles();
    return sendSuccess("Roles fetched successfully", data); 
  },

  async listPermissions() { 
    const data = await rbacService.listPermissions();
    return sendSuccess("Permissions fetched successfully", data); 
  },

  // ── User Specific ─────────────────────────────────────────────
  async getMyRole(userId: string) {
    const data = await rbacService.getMyRole(userId);
    return sendSuccess("User role fetched", data);
  },

  async assignRole(targetUserId: string, roleId: string) {
    const data = await rbacService.assignRole(targetUserId, roleId);
    return sendSuccess("Role assigned successfully", data);
  },

  // ── Role CRUD ─────────────────────────────────────────────────
  async createRole(name: string, description?: string) {
    const data = await rbacService.createRole(name, description);
    return sendSuccess("Role created successfully", data);
  },

  async updateRole(id: string, name: string) {
    const data = await rbacService.updateRole(id, name);
    return sendSuccess("Role updated successfully", data);
  },

  async deleteRole(id: string) {
    const data = await rbacService.deleteRole(id);
    return sendSuccess("Role deleted successfully", data);
  },

  // ── Role-Permission Mapping ──────────────────────────────────
  async getRolePermissions(roleId: string) {
    const data = await rbacService.getRolePermissions(roleId);
    return sendSuccess("Permissions for this role fetched", data);
  },

  async addPermissionToRole(roleId: string, permissionId: string) {
    const data = await rbacService.addPermissionToRole(roleId, permissionId);
    return sendSuccess("Permission added to role", data);
  },

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const data = await rbacService.removePermissionFromRole(roleId, permissionId);
    return sendSuccess("Permission removed from role", data);
  },

  // ── Sync ──────────────────────────────────────────────────────
  async syncPermissions() {
    const data = await rbacService.syncPermissionsFromCode();
    return sendSuccess("Permissions synced from code constants", data);
  },
};