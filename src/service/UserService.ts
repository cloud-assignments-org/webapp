import { CreateUserAccount } from "../controllers/requestModels/CreateUserAccount.js";
import { UpdateUserAccount } from "../controllers/requestModels/UpdateUserAccount.js";
import { EmailT, setEmail } from "../controllers/types/EmailT.js";
import { User } from "../entities/User.js";
import {
  AuthError,
  BadInputError,
  BadRequestError,
} from "../errorHandling/Errors.js";
import { hashPasswordAndEncode } from "../utils/bcryptHashing.util.js";

export default class UserService {
  async getUser(userName: EmailT | undefined): Promise<User> {
    if (!userName) {
      throw new AuthError("Unauthenticated user");
    }

    try {
      setEmail(userName);
    } catch (error) {
      throw new AuthError("Unauthenticated user");
    }

    const user = await User.findOneBy({ username: userName });

    if (!user) {
      throw new AuthError("Unauthenticated user");
    }

    return user;
  }

  async createUser(userData: CreateUserAccount): Promise<User> {
    const { username, first_name, last_name, password } = userData;

    // validate if email is in the right format
    try {
      setEmail(username);
    } catch (err) {
      throw new BadInputError("Invalid email provided " + username);
    }

    // check if we already don't have a user with this email id
    const existingUser = await User.findOneBy({
      username: username,
    });

    if (existingUser) {
      throw new BadRequestError(
        "User with email id " + username + " already exists."
      );
    }

    // create this user and save them in the db
    const newUser = User.create();

    newUser.username = username;
    newUser.first_name = first_name;
    newUser.last_name = last_name;
    newUser.password = await hashPasswordAndEncode(username, password);

    return await newUser.save();
  }

  async updateUser(
    updatedUserDetails: UpdateUserAccount,
    userName?: EmailT
  ): Promise<User> {
    if (!userName || userName == "") {
      throw new AuthError("Unauthenticated user");
    }

    try {
      setEmail(userName);
    } catch (err) {
      throw new AuthError("Unauthenticated user");
    }

    if (!updatedUserDetails.first_name && !updatedUserDetails.last_name && !updatedUserDetails.password) {
      throw new BadInputError(
        "At least one property must be provided to update the user account."
      );
    }

    // get this user from the db
    const existingUser = await User.findOneBy({
      username: userName,
    });

    if (!existingUser) {
      throw new AuthError("Unauthenticated user");
    }

    const { first_name, last_name, password } = updatedUserDetails;

    if (first_name) existingUser.first_name = first_name;
    if (last_name) existingUser.last_name = last_name;
    if (password)
      existingUser.password = await hashPasswordAndEncode(userName, password);
    // updating lastModified date
    existingUser.lastModified = new Date();

    return await existingUser.save();
  }
}
