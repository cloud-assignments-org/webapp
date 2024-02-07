import { Body, Controller, Patch, Post, Route, Security, Request } from "tsoa";
import express from "express";
import UserService from "../service/UserService.js";
import ModelMapper from "./ModelMapper.js";
import { CreateUserAccount } from "./requestModels/CreateUserAccount.js";
import { UpdateUserAccount } from "./requestModels/UpdateUserAccount.js";
import { UserResponse } from "./responseModels/UserResponse.js";

@Route("/")
export class UserController extends Controller {
  private userService: UserService;
  constructor() {
    super();

    this.userService = new UserService();
  }

  @Post("user")
  async createUser(
    @Body() userDetails: CreateUserAccount
  ): Promise<UserResponse> {
    const newUser = await this.userService.createUser(userDetails);

    const response = ModelMapper(UserResponse, newUser);

    this.setStatus(201);
    return response;
  }
  @Patch("user")
  @Security("basicAuth")
  async updateUser(
    @Request() req: express.Request,
    @Body() updatedUserDetails: UpdateUserAccount
  ): Promise<UserResponse> {
    let userName = req.user?.userName;

    const updatedUser = await this.userService.updateUser(
      updatedUserDetails,
      userName
    );

    const response = ModelMapper(UserResponse, updatedUser);

    this.setStatus(201);
    return response;
  }
}
