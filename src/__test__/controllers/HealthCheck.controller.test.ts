import { HealthCheckController } from "../../controllers/HealthCheck.controller";
import { AppDataSource } from "../../config/database.config";

jest.mock("../../config/database.config", () => {
  const mockInitialize = jest.fn();
  const mockDestroy = jest.fn();

  return {
    AppDataSource: {
      initialize: mockInitialize,
      destroy: mockDestroy,
      isInitialized: jest
        .fn()
        .mockImplementation(
          () =>
            mockInitialize.mock.calls.length > 0 &&
            mockDestroy.mock.calls.length === 0
        ),
    },
  };
});

describe("Testing the Health Check Controller", () => {
  let controller: HealthCheckController;
  let mockDataSource = AppDataSource as unknown as any;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks

    // Resetting module cache to ensure a fresh import (and thus fresh mock) for each test
    jest.resetModules();
    controller = new HealthCheckController();

    // Resetting mocks
    mockDataSource.initialize.mockReset().mockImplementation(async () => {}); // cause these are void return types
    mockDataSource.destroy.mockReset().mockImplementation(async () => {});
    mockDataSource.isInitialized.mockReset().mockImplementation(() => true); // this is a boolean return type
  });

  it("Should return 200 when the database connection is succesful", async () => {
    // Simulate successful initialization and destruction
    await controller.checkConnection();

    // Assuming you have a way to retrieve the status set by setStatus
    expect(controller.getStatus()).toBe(200);
    expect(mockDataSource.initialize).toHaveBeenCalled();
    expect(mockDataSource.destroy).toHaveBeenCalled();
  });

  it("should return 503 when the database connection fails", async () => {
    // Simulate initialization failure
    mockDataSource.initialize.mockReset().mockImplementation(async () => {
      throw new Error("Failed to connect");
    });

    await controller.checkConnection();

    // Assuming you have a way to retrieve the status set by setStatus
    expect(controller.getStatus()).toBe(503);
    expect(mockDataSource.initialize).toHaveBeenCalled();
    // Destroy might not be called if initialization fails, depending on your logic
  });
});
