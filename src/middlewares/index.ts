import express from "express";
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../routes/routes.js";
import {methodNotAllowed, badRequestHandler, cacheControl} from "./errorHandler.middleware.js";
import { EnvConfiguration, Environment } from "../config/env.config.js";

export const configMiddleware = (app: any) => {
  app.use(express.json(), cors());
  app.use( cacheControl, methodNotAllowed, badRequestHandler );

  RegisterRoutes(app);

  if (EnvConfiguration.NODE_ENV === Environment.DEVELOPMENT) {
    const swaggerDocument = require("../routes/swagger.json");
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }
};
