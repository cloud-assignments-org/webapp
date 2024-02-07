import { FindManyOptions } from "typeorm";
import { User } from "../../entities/User";
import { UserController } from "../../controllers/User.controller";
import { CreateUserAccount } from "../../controllers/requestModels/CreateUserAccount";
import { UpdateUserAccount } from "../../controllers/requestModels/UpdateUserAccount";
import {
  mockCreate,
  mockSave,
  mockFind,
  mockFindBy,
  mockFindOneBy,
  mockCreateQueryBuilder,
  mockFindAndCount,
} from "../TypeORMMocks";

import express from "express";

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

describe("User Controller", () => {
  let userController: UserController;
  const mockFindUser = jest.fn();
  const mockFindOneByUser = jest.fn();
  const mockSaveUser = jest.fn();

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
  beforeEach(() => {
    userController = new UserController();
    mockFindUser.mockReset();
    mockFindOneByUser.mockReset();
    User.find = mockFindUser;
    User.findOneBy = mockFindOneByUser;
    mockSaveUser.mockReset();
  });

  describe("Create User", () => {
    it("Should return 201 when a completely new user's detail is passed", async () => {
      // Set up - we have a new user
      const userDetails: CreateUserAccount = newUserDetails;
      mockFindOneByUser.mockResolvedValueOnce(undefined);

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
    });

    it("Should have the same value for created date and last updated", async () => {
      // Set up
      const userDetails = Object.assign({}, newUserDetails);

      // Execute
      const userResponse = await userController.createUser(userDetails);

      // Assert
      // Has all the following properties
      expect(userResponse).toHaveProperty("dateCreated");
      expect(userResponse).toHaveProperty("lastModified");
      expect(userResponse.lastModified).toEqual(userResponse.dateCreated);
    });
  });

  describe("Update User", () => {
    /**
     * 201: The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.
     */
    it("Should return 201 when user information is succesfully updated", async () => {
      // Set up

      const updatedUser: UpdateUserAccount = {
        firstName: newUserDetails.firstName + "-updated",
        lastName: newUserDetails.lastName + "-updated",
        password: newUserDetails.password + "-updated",
      };

      const existingUser = User.create();
      existingUser.email = newUserDetails.email;
      existingUser.firstName = newUserDetails.firstName;
      existingUser.lastName = newUserDetails.lastName;
      existingUser.password = newUserDetails.password;

      mockFindOneByUser.mockResolvedValueOnce(existingUser);

      const mockRequest = {
        user: {
          userName: newUserDetails.email,
        } as unknown,
      } as unknown as express.Request;

      // Act
      await userController.updateUser(mockRequest, updatedUser);

      // Expect
      expect(userController.getStatus()).toBe(201);
    });

    it("Should not contain password in the response", async () => {
      // Set up

      const updatedUser: UpdateUserAccount = {
        firstName: newUserDetails.firstName + "-updated",
        lastName: newUserDetails.lastName + "-updated",
        password: newUserDetails.password + "-updated",
      };

      const existingUser = User.create();
      existingUser.email = newUserDetails.email;
      existingUser.firstName = newUserDetails.firstName;
      existingUser.lastName = newUserDetails.lastName;
      existingUser.password = newUserDetails.password;

      mockFindOneByUser.mockResolvedValueOnce(existingUser);

      const mockRequest = {
        user: {
          userName: newUserDetails.email,
        } as unknown,
      } as unknown as express.Request;

      // Act
      const response = await userController.updateUser(
        mockRequest,
        updatedUser
      );

      // Expect
      expect(response).not.toHaveProperty("password");
    });

    it("Should have a last updated date that is greater than the created date", async () => {
      // Set up

      const updatedUser = {
        firstName: newUserDetails.firstName + "-updated",
        lastName: newUserDetails.lastName + "-updated",
        password: newUserDetails.password + "-updated",
      };

      const existingUser = User.create();
      existingUser.email = newUserDetails.email;
      existingUser.firstName = newUserDetails.firstName;
      existingUser.lastName = newUserDetails.lastName;
      existingUser.password = newUserDetails.password;
      existingUser.dateCreated = new Date(new Date().getTime() - 5 * 60000);

      existingUser.save = mockSaveUser;
      mockFindOneByUser.mockResolvedValueOnce(existingUser);

      const finalUpdatedUser = User.create();
      finalUpdatedUser.firstName = updatedUser.firstName;
      finalUpdatedUser.lastName = updatedUser.lastName;
      finalUpdatedUser.password = updatedUser.password;
      finalUpdatedUser.email = existingUser.email;
      finalUpdatedUser.dateCreated = existingUser.dateCreated;
      finalUpdatedUser.lastModified = new Date();

      const mockRequest = {
        user: {
          userName: newUserDetails.email,
        } as unknown,
      } as unknown as express.Request;

      mockSaveUser.mockResolvedValueOnce(finalUpdatedUser);

      // Act
      const response = await userController.updateUser(
        mockRequest,
        updatedUser
      );

      // Expect
      expect(response.lastModified).not.toEqual(response.dateCreated);

      // comparing dates
      const createdDate = new Date(response.dateCreated);
      const lastUpdatedDate = new Date(response.lastModified);

      expect(lastUpdatedDate.getTime() - createdDate.getTime()).toBeGreaterThan(
        0
      );
    });
  });

  describe("Get User", () => {
    it("Should return 200 for an authenticated user", async () => {
      // Set up - here we assume that a user is authenticated,
      // only then will the program execution reach the controller
      // we need a user name that is passed in through the auth middleware
      const userName = newUserDetails.email;

      // we need to create a mock express request body that is patched in through the controller
      const mockRequest = {
        user: {
          userName: userName,
        } as unknown,
      } as unknown as express.Request;

      // return the user when we try user.find
      const foundUser = User.create();
      foundUser.email = userName;

      mockFindOneByUser.mockResolvedValueOnce(foundUser);

      // Act
      await userController.getUser(mockRequest);

      // Expect
      // The controller to return a 200 status code
      expect(userController.getStatus()).toBe(200);
    });
  });
});
