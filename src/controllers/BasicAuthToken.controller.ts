import { Route, Controller, Body, Post } from "tsoa";
import { hashPasswordAndEncode } from "../utils/bcryptHashing.util.js";
import { BasicAuthToken } from "./requestModels/BasicAuthToken.js";
import { setEmail } from "./types/EmailT.js";

@Route("/")
export class BasicAuthController extends Controller {
  constructor() {
    super();
  }

  @Post("/token")
  async getToken(
    @Body() basicAuthTokenRequest: BasicAuthToken
  ): Promise<string> {
    const { userName, pass } = basicAuthTokenRequest;

    this.setStatus(200);

    return await hashPasswordAndEncode(userName, pass);
  }
}
