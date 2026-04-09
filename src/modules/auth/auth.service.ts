import { authRepository } from "./auth.repository";
import { rbacRepository } from "../rbac/rbac.repository";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  parseExpireToDate,
} from "../../utils/jwt";
import { env } from "../../config/env";

export const authService = {
  async login(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await Bun.password.verify(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const role = user.roleId ? await rbacRepository.getRoleById(user.roleId) : null;
    const roleName = role?.name ?? "student";

    const payload = {
      userId: user.id,
      email: user.email,
      role: roleName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload),
      signRefreshToken(payload),
    ]);

    await authRepository.saveRefreshToken(
      user.id,
      refreshToken,
      parseExpireToDate(env.REFRESH_TOKEN_EXPIRE),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    };
  },

  async refresh(refreshToken: string) {
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) throw new Error("Invalid or expired refresh token");

    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new Error("Refresh token not found or already used");

    if (new Date() > stored.expiresAt) {
      await authRepository.deleteRefreshToken(refreshToken);
      throw new Error("Refresh token expired, please login again");
    }

    const accessToken = await signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return { accessToken };
  },

  async logout(refreshToken: string) {
    await authRepository.deleteRefreshToken(refreshToken);
    return { message: "Logged out successfully" };
  },

  async logoutAll(userId: string) {
    await authRepository.deleteAllRefreshTokensByUserId(userId);
    return { message: "Logged out from all devices" };
  },

  async getMe(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    const role = user.roleId ? await rbacRepository.getRoleById(user.roleId) : null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role?.name ?? null,
    };
  },
};
