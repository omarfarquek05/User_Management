import type { Static } from "elysia";
import { authService } from "./auth.service";
import { sendSuccess } from "../../utils/response";
import { LoginDto, RefreshDto, LogoutDto } from "./auth.dto";

type LoginBody = Static<typeof LoginDto>;
type RefreshBody = Static<typeof RefreshDto>;
type LogoutBody = Static<typeof LogoutDto>;

export const authController = {
  async login(email: string, password: string) {
    const data = await authService.login(email, password);
    return sendSuccess("Login successful", data);
  },

  async refresh(refreshToken: string) {
    const data = await authService.refresh(refreshToken);
    return sendSuccess("Token refreshed", data);
  },

  async logout(refreshToken: string) {
    const data = await authService.logout(refreshToken);
    return sendSuccess("Logged out", data);
  },

  async logoutAll(userId: string) {
    const data = await authService.logoutAll(userId);
    return sendSuccess("Logged out from all devices", data);
  },

  async getMe(userId: string) {
    const data = await authService.getMe(userId);
    return sendSuccess("User fetched", data);
  },
};
