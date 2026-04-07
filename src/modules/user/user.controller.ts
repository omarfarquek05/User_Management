import type { Context } from "elysia";
import { userService } from "./user.service";
import { sendSuccess, sendError } from "../../utils/response";

export const userController = {

  getAll: async () => {
    const users = await userService.getAllUsers();
    return sendSuccess("Users fetched successfully", users);
  },

  getById: async ({ params }: Context) => {
    const user = await userService.getUserById(Number(params.id));
    return sendSuccess("User fetched successfully", user);
  },

  create: async ({ body }: Context) => {
    const user = await userService.createUser(body as any);
    return sendSuccess("User created successfully", user);
  },

  update: async ({ params, body }: Context) => {
    const user = await userService.updateUser(Number(params.id), body as any);
    return sendSuccess("User updated successfully", user);
  },

  delete: async ({ params }: Context) => {
    await userService.deleteUser(Number(params.id));
    return sendSuccess("User deleted successfully");
  },
};