import { t } from "elysia";

export const createUserDto = t.Object({
  name:     t.String({ minLength: 2 }),
  email:    t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export const updateUserDto = t.Object({
  name:     t.Optional(t.String({ minLength: 2 })),
  email:    t.Optional(t.String({ format: "email" })),
  password: t.Optional(t.String({ minLength: 6 })),
});

export const idParamDto = t.Object({
  id: t.String({ format: "uuid" }),
});