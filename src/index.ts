import "reflect-metadata";
import { EnvConfiguration } from "./config/env.config.js";
import createApp from "./app.js";
import { checkDBConnectionRepeatedly } from "./utils/dbConnectivity.util.js";
class Server {
  constructor() {
    this.bootstrap();
  }

  // bootstrap
  async bootstrap() {
    checkDBConnectionRepeatedly();
    const app = createApp();
    app.listen(EnvConfiguration.PORT, () => {
      console.log("TCP server established on port ", EnvConfiguration.PORT);
    });
  }
}



new Server();
