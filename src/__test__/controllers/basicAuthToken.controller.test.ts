import { BasicAuthToken } from "../../controllers/requestModels/BasicAuthToken";
import { BasicAuthController } from "../../controllers/BasicAuthToken.controller";

describe("Basic Auth Token Controller", () => {
  let basicAuthTokenController: BasicAuthController;

  beforeEach(() => {
    basicAuthTokenController = new BasicAuthController();
  });
  it("Should return a base64 basic auth token for a valid username and password", async () => {
    // Set up

    const validUserName = "test@gmail.com";
    const password = "test123";

    const basicAuthTokenRequest: BasicAuthToken = {
      userName: validUserName,
      pass: password,
    };

    // Act
    const basicAuthToken = await basicAuthTokenController.getToken(
      basicAuthTokenRequest
    );

    // Expect
    // Expect this to be a valid base 64 string
    var base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    expect(base64regex.test(basicAuthToken)).toBe(true);
  });
});
