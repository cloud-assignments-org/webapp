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
import { checkForEmptyString } from "../utils/inputValidation.util.js";
import logMessage, { Severity } from "../utils/loggerUtil.util.js";

export default class UserService {
  async getUser(userName: EmailT | undefined): Promise<User> {
    if (!userName || userName == "") {
      logMessage(
        "Invalid username",
        "UserService.getUser",
        "Username null/undefined or empty username passed",
        Severity.ERROR
      );
      throw new AuthError("Unauthenticated user");
    }

    try {
      setEmail(userName);
    } catch (error) {
      logMessage(
        "Invalid username",
        "UserService.getUser",
        "Invalid username format",
        Severity.ERROR
      );
      throw new AuthError("Unauthenticated user");
    }

    const user = await User.findOneBy({ username: userName });

    if (!user) {
      logMessage(
        "User not found",
        "UserService.getUser",
        "User not present in the database",
        Severity.ERROR
      );
      throw new AuthError("Unauthenticated user");
    }
    logMessage(
      "Retrieving user",
      "UserService.getUser",
      "Retrieving user details from the database",
      Severity.INFO
    );

    return user;
  }

  async createUser(userData: CreateUserAccount): Promise<User> {
    const { username, first_name, last_name, password } = userData;

    checkForEmptyString(userData);

    // validate if email is in the right format
    try {
      setEmail(username);
    } catch (err) {
      logMessage(
        "Invalid username",
        "UserService.createUser",
        "Invalid username format",
        Severity.ERROR
      );
      throw new BadInputError("Invalid email provided " + username);
    }

    // check if we already don't have a user with this email id
    const existingUser = await User.findOneBy({
      username: username,
    });

    logMessage(
      "Checking for existing user",
      "UserService.createUser",
      "Checking if user already exists in the database",
      Severity.INFO
    );

    if (existingUser) {
      logMessage(
        "Checking for existing user",
        "UserService.createUser",
        "User already exists",
        Severity.ERROR
      );
      throw new BadRequestError(
        "User with email id " + username + " already exists."
      );
    }

    logMessage(
      "Creating new user",
      "UserService.createUser",
      "Creating a new user account",
      Severity.INFO
    );

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
      logMessage(
        "Invalid username",
        "UserService.updateUser",
        "Username null/undefined or empty username passed",
        Severity.ERROR
      );
      throw new AuthError("Unauthenticated user");
    }

    checkForEmptyString(updatedUserDetails);

    try {
      setEmail(userName);
    } catch (err) {
      logMessage(
        "Invalid username",
        "UserService.updateUser",
        "Invalid username format",
        Severity.ERROR
      );
      throw new AuthError("Unauthenticated user");
    }

    if (
      !updatedUserDetails.first_name &&
      !updatedUserDetails.last_name &&
      !updatedUserDetails.password
    ) {
      throw new BadInputError(
        "At least one property must be provided to update the user account."
      );
    }

    logMessage(
      "Retrieving existing user",
      "UserService.updateUser",
      "Retrieving user details from the database",
      Severity.INFO
    );

    // get this user from the db
    const existingUser = await User.findOneBy({
      username: userName,
    });

    if (!existingUser) {
      logMessage(
        "Invalid username",
        "UserService.updateUser",
        "User already exists",
        Severity.ERROR
      );
      throw new AuthError("Unauthenticated user");
    }

    const { first_name, last_name, password } = updatedUserDetails;

    logMessage(
      "Updating user details",
      "UserService.updateUser",
      "Updating user account details",
      Severity.INFO
    );

    if (first_name) existingUser.first_name = first_name;
    if (last_name) existingUser.last_name = last_name;
    if (password)
      existingUser.password = await hashPasswordAndEncode(userName, password);
    // updating lastModified date
    existingUser.lastModified = new Date();

    return await existingUser.save();
  }
}
