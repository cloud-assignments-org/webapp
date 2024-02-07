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
  async createUser(userData: CreateUserAccount): Promise<User> {
    const { email, firstName, lastName, password } = userData;

    // validate if email is in the right format
    try {
      setEmail(email);
    } catch (err) {
      throw new BadInputError("Invalid email provided " + email);
    }

    // check if we already don't have a user with this email id
    const existingUser = await User.findOneBy({
      email: email,
    });

    if (existingUser) {
      throw new BadRequestError(
        "User with email id " + email + " already exists."
      );
    }

    // create this user and save them in the db
    const newUser = User.create();

    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = await hashPasswordAndEncode(email, password);

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

    if (!updatedUserDetails.isValid()) {
      throw new BadInputError(
        "At least one property must be provided to update the user account."
      );
    }

    // get this user from the db
    const existingUser = await User.findOneBy({
      email: userName,
    });

    if (!existingUser) {
      throw new AuthError("Unauthenticated user");
    }

    const { firstName, lastName, password } = updatedUserDetails;

    if (firstName) existingUser.firstName = firstName;
    if (lastName) existingUser.lastName = lastName;
    if (password)
      existingUser.password = await hashPasswordAndEncode(userName, password);
    // updating lastModified date
    existingUser.lastModified = new Date();

    return await existingUser.save();
  }
}
