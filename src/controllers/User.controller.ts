import { Controller, Route } from "tsoa";
import { User } from "../entities/User.js";
import UserService from "../service/UserService.js";
import { hashPasswordAndEncode } from "../utils/bcryptHashing.util.js";
import ModelMapper from "./ModelMapper.js";
import { CreateUserAccount } from "./requestModels/CreateUserAccount.js";
import { UserResponse } from "./responseModels/UserResponse.js";
import { setEmail } from "./types/EmailT.js";

@Route("/")
export class UserController extends Controller {
  private userService: UserService;
  constructor() {
    super();

    this.userService = new UserService();
  }

  async createUser(
    userDetails: CreateUserAccount
  ): Promise<UserResponse> {
    const newUser = await this.userService.createUser(userDetails);

    const response = ModelMapper(UserResponse, newUser);

    this.setStatus(201);
    return response;
  }
}
