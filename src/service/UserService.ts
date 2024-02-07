import { CreateUserAccount } from "../controllers/requestModels/CreateUserAccount.js";
import { setEmail } from "../controllers/types/EmailT.js";
import { User } from "../entities/User.js";
import { BadInputError } from "../errorHandling/Errors.js";
import { hashPasswordAndEncode } from "../utils/bcryptHashing.util.js";

export default class UserService {
    async createUser(userData:CreateUserAccount) : Promise<User> {
        const { email, firstName, lastName, password } = userData;

        // validate if email is in the right format
        try {
          setEmail(email);
        } catch (err) {
          throw new BadInputError("Invalid email provided " + email);
        }
    
        // create this user and save them in the db
        const newUser = User.create();
    
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = await hashPasswordAndEncode(email, password);
    
        return await newUser.save();
    }
}
