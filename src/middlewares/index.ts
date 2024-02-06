import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../routes/routes.js";
import {
  methodNotAllowed,
  badRequestHandler,
  cacheControl,
} from "./errorHandler.middleware.js";
import { EnvConfiguration, Environment } from "../config/env.config.js";
import swaggerJson from "../routes/swagger.json" assert { type: "json" };

export const configMiddleware = (app: any) => {
  app.use(express.json(), cors());
  app.use(cacheControl, methodNotAllowed, badRequestHandler);

  RegisterRoutes(app);

  if (EnvConfiguration.NODE_ENV === Environment.DEVELOPMENT) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
  }
};