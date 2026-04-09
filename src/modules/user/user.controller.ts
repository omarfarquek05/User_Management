import type { Context } from "elysia";
import { userService } from "./user.service";
import { sendSuccess, sendError } from "../../utils/response";
import type { Static } from "elysia";
import { createUserDto, updateUserDto, idParamDto } from "./user.dto";

type CreateUserBody = Static<typeof createUserDto>;
type UpdateUserBody = Static<typeof updateUserDto>;
type IdParam = Static<typeof idParamDto>;

export const userController = {

  getAll: async () => {
    const users = await userService.getAllUsers();
    return sendSuccess("Users fetched successfully", users);
  },

  getById: async ({ params }: { params: IdParam }) => {
    const user = await userService.getUserById(Number(params.id));
    return sendSuccess("User fetched successfully", user);
  },

  create: async ({ body }: { body: CreateUserBody }) => {
    const user = await userService.createUser(body);
    return sendSuccess("User created successfully", user);
  },

  update: async ({ params, body }: { params: IdParam; body: UpdateUserBody }) => {
    const user = await userService.updateUser(Number(params.id), body);
    return sendSuccess("User updated successfully", user);
  },

  delete: async ({ params }: { params: IdParam }) => {
    await userService.deleteUser(Number(params.id));
    return sendSuccess("User deleted successfully");
  },
};