import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
//import { swagger } from "elysiajs/swagger";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { env } from "./config/env";
import { rbacRoutes } from "./modules/rbac/rbac.routes";
import { logger } from "./middleware/logger.middleware";

const app = new Elysia()
  .use(cors())
 // .use(swagger({ path: "/docs" }))   // Swagger UI → http://localhost:3000/docs
  .use(errorMiddleware)
  .use(logger)
  .use(authRoutes)
  .use(rbacRoutes)
  .get("/", () => "Hello, Elysia with Bun!")
  .group("/api", (app) => app.use(userRoutes))
  .listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${env.PORT}`);
//console.log(`📖 Swagger docs at http://localhost:${env.PORT}/docs`);