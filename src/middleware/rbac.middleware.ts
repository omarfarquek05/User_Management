// src/middleware/rbac.middleware.ts
import Elysia from "elysia";
import { type Permission } from "../constants/permissions";
import { rbacService } from "../modules/rbac/rbac.service";
import { verifyJwt } from "../utils/jwt";

export const requireAuth = new Elysia({ name: "requireAuth" })
  .derive({ as: 'global' }, async ({ headers, set }) => {
    const token = headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized: token missing");
    }

    const payload = await verifyJwt(token); 
    
    if (!payload?.userId) {
      set.status = 401;
      throw new Error("Unauthorized: invalid token");
    }

    return { userId: payload.userId as string };
  });

export const requirePermission = (...required: Permission[]) =>
  new Elysia({ name: `perm:${required.join(",")}` })
    .use(requireAuth)
    .derive({ as: 'global' }, async ({ userId }) => {
      const allowed = await rbacService.hasPermission(userId, required);

      if (!allowed) {
        throw new Error("Forbidden: insufficient permissions");
      }

      return {}; // পারমিশন থাকলে কিছুই রিটার্ন করার দরকার নেই, শুধু পাস হবে
    });