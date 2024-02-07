import { FindManyOptions } from "typeorm";
import { User } from "../../entities/User";
import { BadInputError, BadRequestError } from "../../errorHandling/Errors";
import UserService from "../../service/UserService";
import {
  mockCreate,
  mockSave,
  mockFind,
  mockFindBy,
  mockFindOneBy,
  mockCreateQueryBuilder,
  mockFindAndCount,
} from "../TypeORMMocks";

jest.mock("../../entities/User", () => {
  return {
    User: {
      // Mock static methods directly
      create: (u: User) => mockCreate(u),
      save: (u: User) => mockSave(u),
      find: (u: FindManyOptions<User>) => mockFind(u),
      findBy: (u: User) => mockFindBy(u),
      findOneBy: (u: User) => mockFindOneBy(u),
      createQueryBuilder: () => mockCreateQueryBuilder(),
      findAndCount: (o: FindManyOptions<User>) => mockFindAndCount(o),
    },
  };
});

describe("Testing methods in the user service", () => {
  describe("Testing the create user function", () => {
    let userService: UserService;
    const mockFindUser = jest.fn();
    const mockFindOneByUser = jest.fn();
    beforeEach(() => {
      userService = new UserService();
      mockFindUser.mockReset();
      mockFindOneByUser.mockReset();
      User.find = mockFindUser;
      User.findOneBy = mockFindOneByUser;
    });

    // set up
    const newUserDetails = {
      email: "test@gmail.com",
      firstName: "John",
      lastName: "Doe",
      password: "test123",
    };

    const existingUsersWithoutNewUser: User[] = [
      User.create({
        email: "test2@gmail.com",
        firstName: "John2",
        lastName: "Doe2",
        password: "test1232",
      }),
      User.create({
        email: "test3@gmail.com",
        firstName: "John3",
        lastName: "Doe3",
        password: "$$$RRR",
      }),
    ];

    const existingUsersWithNewUser: User[] = [
      User.create({
        email: "test@gmail.com",
        firstName: "John",
        lastName: "Doe",
        password: "test123",
      }),
      User.create({
        email: "test2@gmail.com",
        firstName: "John2",
        lastName: "Doe2",
        password: "test1232",
      }),
      User.create({
        email: "test3@gmail.com",
        firstName: "John3",
        lastName: "Doe3",
        password: "$$$RRR",
      }),
    ];

    it("Throws BadInput Error when an invalid email is passed in", async () => {
      const userDetails = Object.assign({}, newUserDetails);
      userDetails.email = "3b87624fyfv44.dcjb.com";
      await expect(userService.createUser(userDetails)).rejects.toThrow(
        new BadInputError("Invalid email provided " + userDetails.email)
      );
    });

    it("Throws BadRequest Error when a user account with the email address already exists", async () => {
      // Set up
      const userDetails = Object.assign({}, newUserDetails);

      const {email, firstName, lastName, password}  = userDetails;
      
      const existingUser = User.create();
      existingUser.email = email;
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.password = password;
      
      mockFindOneByUser.mockResolvedValueOnce(existingUser);

      // Act and expect
      await expect(userService.createUser(userDetails)).rejects.toThrow(
        new BadRequestError(
          "User with email id " + userDetails.email + " already exists."
        )
      );
    });
  });
});
