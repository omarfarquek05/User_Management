import Elysia from "elysia";
import { userController } from "./user.controller";
import { createUserDto, updateUserDto, idParamDto } from "./user.dto";

export const userRoutes = new Elysia({ prefix: "/users" })

  .get("/",    userController.getAll)

  .get("/:id", userController.getById, {
    params: idParamDto,
  })

  .post("/",   userController.create, {
    body: createUserDto,
  })

  .put("/:id", userController.update, {
    params: idParamDto,
    body:   updateUserDto,
  })

  .delete("/:id", userController.delete, {
    params: idParamDto,
  });