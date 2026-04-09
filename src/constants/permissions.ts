// src/constants/permissions.ts
export const PERMISSIONS = {
  // User
  USER_VIEW:    "user:view",
  USER_CREATE:  "user:create",
  USER_UPDATE:  "user:update",
  USER_DELETE:  "user:delete",

  // Course
  COURSE_VIEW:   "course:view",
  COURSE_CREATE: "course:create",
  COURSE_UPDATE: "course:update",
  COURSE_DELETE: "course:delete",

  // Result
  RESULT_VIEW:   "result:view",
  RESULT_CREATE: "result:create",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];