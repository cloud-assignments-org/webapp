import { Controller, Get, Route } from "tsoa";
import { AppDataSource } from "../config/database.config.js";
import { ServiceUnavailableError } from "../errorHandling/Errors.js";

@Route("/")
export class HealthCheckController extends Controller {
  constructor() {
    super();
  }

  @Get("healthz")
  public async checkConnection(): Promise<void> {
    try {
      await AppDataSource.initialize();
      await AppDataSource.destroy();
      this.setStatus(200);
    } catch (error: any) {
      console.log(error);
      this.setStatus(503);
    }
    return;
  }
}
