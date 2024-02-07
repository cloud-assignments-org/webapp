import { Controller, Route } from "tsoa";
import { User } from "../entities/User.js";
import { hashPasswordAndEncode } from "../utils/bcryptHashing.util.js";
import { CreateUserAccount } from "./requestModels/CreateUserAccount.js";

@Route("/")
export class UserController extends Controller {
  constructor() {
    super();
  }

  async createUser(userDetails: CreateUserAccount) {
    const { email, firstName, lastName, password } = userDetails;

    // create this user and save them in the db
    const newUser = User.create();

    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = await hashPasswordAndEncode(email, password);

    await newUser.save();

    this.setStatus(201);
    return;
  }
}
