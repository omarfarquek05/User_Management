// src/modules/rbac/rbac.routes.ts
import Elysia from "elysia";
import { rbacController } from "./rbac.controller";
import { AssignRoleDto, CreateRoleDto, UpdateRoleDto, AddPermissionToRoleDto } from "./rbac.dto";
import { requireAuth, requirePermission } from "../../middleware/rbac.middleware";
import { PERMISSIONS } from "../../constants/permissions";

export const rbacRoutes = new Elysia({ prefix: "/rbac" })

  // ── Public/Basic View (যারা শুধু দেখতে পারবে) ───────────────────
  .use(requirePermission(PERMISSIONS.USER_VIEW)) 
  .get("/roles", () => rbacController.listRoles())
  .get("/permissions", () => rbacController.listPermissions())
  .get("/roles/:id/permissions", ({ params }) => rbacController.getRolePermissions(params.id))

  // ── User Specific (নিজের রোল দেখা) ──────────────────────────
  .get("/my-role", ({ userId }) => rbacController.getMyRole(userId))

  // ── Admin Only (পারমিশন আপডেট ও ক্রিয়েট) ──────────────────────
  .guard({
    beforeHandle: [async ({ userId, set }) => {
        // অতিরিক্ত লেয়ার হিসেবে এখানেও পারমিশন চেক করা যায়
        const allowed = await requirePermission(PERMISSIONS.USER_UPDATE).handle;
    }]
  })
  .group("/admin", (app) => 
    app
      .use(requirePermission(PERMISSIONS.USER_UPDATE))
      .post("/roles", ({ body }) => rbacController.createRole(body.name, body.description), { body: CreateRoleDto })
      .patch("/roles/:id", ({ params, body }) => rbacController.updateRole(params.id, body.name), { body: UpdateRoleDto })
      .delete("/roles/:id", ({ params }) => rbacController.deleteRole(params.id))
      .post("/roles/:id/permissions", ({ params, body }) => rbacController.addPermissionToRole(params.id, body.permissionId), { body: AddPermissionToRoleDto })
      .delete("/roles/:id/permissions/:pid", ({ params }) => rbacController.removePermissionFromRole(params.id, params.pid))
      .post("/permissions/sync", () => rbacController.syncPermissions())
      .patch("/assign", ({ body }) => rbacController.assignRole(body.targetUserId, body.roleId), { body: AssignRoleDto })
  );