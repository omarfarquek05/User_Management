// src/db/seed.ts

import { db } from "../config/database";
import { roles, permissions, rolePermissions, users } from "./schema";
import { PERMISSIONS } from "../constants/permissions";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding started...");

  // ── Roles ─────────────────────────────────────────────────────
  // First try to insert, then query existing ones
  await db
    .insert(roles)
    .values([
      { name: "admin",   description: "Full system access" },
      { name: "teacher", description: "Course and result management" },
      { name: "student", description: "View only access" },
    ])
    .onConflictDoNothing();

  const insertedRoles = await db.select().from(roles);
  console.log("✅ Roles seeded");

  // ── Permissions ───────────────────────────────────────────────
  await db
    .insert(permissions)
    .values(
      Object.values(PERMISSIONS).map((name) => ({ name, description: name }))
    )
    .onConflictDoNothing();

  const insertedPerms = await db.select().from(permissions);
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

  // ── Admin User ────────────────────────────────────────────────
  const hashedPassword = await Bun.password.hash("admin123"); // Default password

  await db
    .insert(users)
    .values({
      name: "System Admin",
      email: "admin@example.com",
      password: hashedPassword,
      roleId: role("admin").id,
    })
    .onConflictDoNothing();

  console.log("✅ Admin user created");
  console.log("   Email: admin@example.com");
  console.log("   Password: admin123");
  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });