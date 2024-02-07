import { FindManyOptions } from "typeorm";
import { User } from "../../entities/User";
import { BadInputError } from "../../errorHandling/Errors";
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
    beforeEach(() => {
      userService = new UserService();
    });

    it("Throws bad input error when an invalid email is passed in", async () => {
      // set up
      const newUserDetails = {
        email: "test-gmail4f5com",
        firstName: "John",
        lastName: "Doe",
        password: "test123",
      };

      await expect(userService.createUser(newUserDetails)).rejects.toThrow(
        new BadInputError("Invalid email provided " + newUserDetails.email)
      );
    });
  });
});
