import { Controller, Get, Route } from "tsoa";
import { DBConnection } from "../entities/DBConnection.js";

@Route("/")
export class HealthCheckController extends Controller {
  constructor() {
    super();
  }

  @Get("healthz")
  public async checkConnection(): Promise<void> {
    try {
      const connection = (await DBConnection.find())[0];
      if(connection) {
        this.setStatus(200);
      } else {
        this.setStatus(503);
      }
    } catch (error: any) {
      this.setStatus(503);
    }
    return;
  }
}