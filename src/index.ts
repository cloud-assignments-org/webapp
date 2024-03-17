import "reflect-metadata";
import { EnvConfiguration } from "./config/env.config.js";
import createApp from "./app.js";
import { checkDBConnectionRepeatedly } from "./utils/dbConnectivity.util.js";
import logger from "./logger.js";
class Server {
  constructor() {
    this.bootstrap();
  }

  // bootstrap
  async bootstrap() {
    checkDBConnectionRepeatedly();
    const app = createApp();
    logger.info("Created app");
    logger.error("Created app");
    logger.debug("Created app");
    app.listen(EnvConfiguration.PORT, () => {
      console.log("TCP server established on port ", EnvConfiguration.PORT);
    });
  }
}



new Server();
