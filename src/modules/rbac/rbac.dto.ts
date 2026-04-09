// src/modules/rbac/rbac.dto.ts

import { t } from "elysia";

export const AssignRoleDto = t.Object({
  targetUserId: t.String({ minLength: 1 }),
  roleId:       t.String({ minLength: 1 }),
});

export const CreateRoleDto = t.Object({
  name:        t.String({ minLength: 1, maxLength: 50 }),
  description: t.Optional(t.String({ maxLength: 255 })),
});

export const UpdateRoleDto = t.Object({
  name: t.String({ minLength: 1, maxLength: 50 }),
});

export const AddPermissionToRoleDto = t.Object({
  permissionId: t.String({ minLength: 1 }),
});