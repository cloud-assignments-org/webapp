import supertest from "supertest";
import { encodeCredentialsToBase64 } from "../../utils/base64.util";
import { connectDB } from "../../utils/dbConnectivity.util";

import createApp from "../../app";
import { AppDataSource } from "../../config/database.config";
import { DBConnection, User } from "../../entities";

const app = createApp();

beforeAll(async () => {
  let isDbConnected = await connectDB();

  while (!isDbConnected) {
    isDbConnected = await connectDB();
  }
});

describe("user", () => {
  beforeEach(async () => {
    await User.clear();
  });
  describe("get user route", () => {
    describe("given the user does not exist", () => {
      it("should return a 401 response code", async () => {
        const username = "user123@gmail.com";
        const password = "test123";

        const basicAuthToken = encodeCredentialsToBase64(username, password);

        await supertest(app)
          .get("/v1/user/self")
          .set("Authorization", `Basic ${basicAuthToken}`)
          .expect(401);
      });
    });

    describe("given the user exists", () => {
      it("should return a 200", async () => {
        const payload = {
          username: "testNew4@northeastern.edu",
          password: "testPass3",
          first_name: "Arun",
          last_name: "Balaji",
        };

        await supertest(app)
          .post("/v1/user")
          .send(payload)
          .set("Content-Type", "application/json");

        const basicAuthToken = encodeCredentialsToBase64(
          payload.username,
          payload.password
        );

        await supertest(app)
          .get("/v1/user/self")
          .set("Authorization", `Basic ${basicAuthToken}`)
          .expect(200);
      });
    });
  });

  describe("post user route", () => {
    describe("given the user does not exist", () => {
      it("should return a 201", async () => {
        const payload = {
          username: "testNew4@northeastern.edu",
          password: "testPass3",
          first_name: "Arun",
          last_name: "Balaji",
        };

        await supertest(app)
          .post("/v1/user")
          .send(payload)
          .set("Content-Type", "application/json")
          .expect(201);
      });
    });
  });

  describe("update user route", () => {
    describe("given the user was created",  () => {

      it('shuold return a 201', async () => {
        // first create the user
        const payload = {
          username: "testNew4@northeastern.edu",
          password: "testPass3",
          first_name: "Arun",
          last_name: "Balaji",
        };
  
        await supertest(app)
          .post("/v1/user")
          .send(payload)
          .set("Content-Type", "application/json");
  
  
        // update the user
        const updatePayload = {
          password: "testPass345",
          first_name: "Varun",
          last_name: "Anand",
        };

        const basicAuthToken = encodeCredentialsToBase64(payload.username, payload.password);
  
        const { body } = await supertest(app)
        .put("/v1/user/self")
        .send(updatePayload)
        .set("Authorization", `Basic ${basicAuthToken}`)
        .expect(201);

        expect(body.first_name).toEqual(updatePayload.first_name);
        expect(body.last_name).toEqual(updatePayload.last_name);
        
      })




    })
  })
});

afterAll(async () => {
  await DBConnection.clear();
  await AppDataSource.destroy();
});
