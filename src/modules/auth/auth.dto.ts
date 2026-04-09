import { t } from "elysia";

export const LoginDto = t.Object({
  email:    t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export const RefreshDto = t.Object({
  refreshToken: t.String({ minLength: 1 }),
});

export const LogoutDto = t.Object({
  refreshToken: t.String({ minLength: 1 }),
});
