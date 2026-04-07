import Elysia from "elysia";
import { sendError } from "../utils/response";

export const errorMiddleware = new Elysia()
  .onError(({ error, code, set }) => {
    // Elysia validation error
    if (code === "VALIDATION") {
      set.status = 400;
      return sendError("Validation failed", error.message);
    }

    // Custom business logic errors
    const message = error instanceof Error ? error.message : String(error);

    if (message === "USER_NOT_FOUND") {
      set.status = 404;
      return sendError("User not found", "USER_NOT_FOUND");
    }

    if (message === "EMAIL_ALREADY_EXISTS") {
      set.status = 409;
      return sendError("Email already exists", "EMAIL_ALREADY_EXISTS");
    }

    // Generic fallback
    set.status = 500;
    return sendError("Internal server error");
  });