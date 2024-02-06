import "reflect-metadata";
import express from "express";
import { EnvConfiguration } from "./config/env.config.js";
import { AppDataSource } from "./config/database.config.js";
import { configMiddleware } from "./middlewares/index.js";


//

class Server {
  constructor() {
    this.bootstrap();
  }

  // bootstrap
  async bootstrap() {
    // AppDataSource.initialize()
    //   .then(() => {
    //     console.log("Data Source has been initialized!");
    //     const app = express();
    //     configMiddleware(app);
    //     app.listen(EnvConfiguration.PORT, () => {
    //       console.log("TCP server established on port " , EnvConfiguration.PORT);
    //     });
    //   })
    //   .catch((err) => {
    //     console.error("Error during Data Source initialization", err);
    //   });
    const app = express();
    configMiddleware(app);
    app.listen(EnvConfiguration.PORT, () => {
      console.log("TCP server established on port " , EnvConfiguration.PORT);
    });
  }
}

new Server();