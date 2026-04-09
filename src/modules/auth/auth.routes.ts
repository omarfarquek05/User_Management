import Elysia from "elysia";
import { authController } from "./auth.controller";
import { LoginDto, RefreshDto, LogoutDto } from "./auth.dto";
import { requireAuth } from "../../middleware/rbac.middleware";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/login",
    ({ body }) => authController.login(body.email, body.password),
    { body: LoginDto },
  )

  .post(
    "/refresh",
    ({ body }) => authController.refresh(body.refreshToken),
    { body: RefreshDto },
  )

  .post(
    "/logout",
    ({ body }) => authController.logout(body.refreshToken),
    { body: LogoutDto },
  )

  .use(requireAuth)

  .post(
    "/logout-all",
    ({ userId }) => authController.logoutAll(userId),
  )

  .get(
    "/me",
    ({ userId }) => authController.getMe(userId),
  );
