import { FindManyOptions } from "typeorm";
import { User } from "../../entities/User";
import { UserController } from "../../controllers/User.controller";
import { CreateUserAccount } from "../../controllers/requestModels/CreateUserAccount";
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

describe("Testing methods in the user controller file", () => {
  let userController: UserController;
  const mockFindUser = jest.fn();

  beforeAll(() => {
    userController = new UserController();
    mockFindUser.mockReset();

    User.find = mockFindUser;
  });

  const newUserDetails = {
    email: "test@gmail.com",
    firstName: "John",
    lastName: "Doe",
    password: "test123",
  };

  const existingUsers: User[] = [
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

  it("Should return 200 when a completely new user's detail is passed", async () => {
    // Set up - we have a new user
    const userDetails: CreateUserAccount = newUserDetails;

    // Execute
    await userController.createUser(userDetails);

    // Assert
    expect(userController.getStatus()).toBe(201);
  });

  it("Should not have password in the response and return all other user details", async () => {
    
    // Set up
    const userDetails = Object.assign({}, newUserDetails);

    // Execute
    const userResponse = await userController.createUser(userDetails);

    // Assert
    // Has all the following properties
    expect(userResponse).toHaveProperty("email");
    expect(userResponse).toHaveProperty("firstName");
    expect(userResponse).toHaveProperty("lastName");
    expect(userResponse).toHaveProperty("id");
    expect(userResponse).toHaveProperty("dateCreated");
    expect(userResponse).toHaveProperty("lastModified");

    // should not have password
    expect(userResponse).not.toHaveProperty("password");
  })
});
