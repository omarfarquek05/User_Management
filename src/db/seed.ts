// src/db/seed.ts

import { db } from "../config/database";
import { roles, permissions, rolePermissions } from "./schema";
import { PERMISSIONS } from "../constants/permissions";

async function seed() {
  console.log("🌱 Seeding started...");

  // ── Roles ─────────────────────────────────────────────────────
  const insertedRoles = await db
    .insert(roles)
    .values([
      { name: "admin",   description: "Full system access" },
      { name: "teacher", description: "Course and result management" },
      { name: "student", description: "View only access" },
    ])
    .onConflictDoNothing()
    .returning();

  console.log("✅ Roles seeded");

  // ── Permissions ───────────────────────────────────────────────
  const insertedPerms = await db
    .insert(permissions)
    .values(
      Object.values(PERMISSIONS).map((name) => ({ name, description: name }))
    )
    .onConflictDoNothing()
    .returning();

  console.log("✅ Permissions seeded");

  // ── Helpers ───────────────────────────────────────────────────
  const role = (name: string) => insertedRoles.find((r) => r.name === name)!;
  const perm = (name: string) => insertedPerms.find((p) => p.name === name)!;
  const P = PERMISSIONS;

  // ── Role → Permission Mapping ─────────────────────────────────
  const mappings = [
    // admin → সব permission
    ...Object.values(P).map((p) => ({
      roleId: role("admin").id, permissionId: perm(p).id,
    })),

    // teacher
    ...[P.COURSE_VIEW, P.COURSE_CREATE, P.COURSE_UPDATE,
        P.RESULT_VIEW, P.RESULT_CREATE, P.USER_VIEW].map((p) => ({
      roleId: role("teacher").id, permissionId: perm(p).id,
    })),

    // student
    ...[P.COURSE_VIEW, P.RESULT_VIEW].map((p) => ({
      roleId: role("student").id, permissionId: perm(p).id,
    })),
  ];

  await db.insert(rolePermissions).values(mappings).onConflictDoNothing();

  console.log("✅ Role-Permission mapping seeded");
  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });