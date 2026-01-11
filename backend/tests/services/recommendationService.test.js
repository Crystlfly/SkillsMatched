import { jest } from '@jest/globals';

// 1. Mock dependencies BEFORE importing the service
// In ESM, mocks must be defined before the module is loaded
jest.unstable_mockModule("node-fetch", () => ({
    default: jest.fn()
}));

jest.unstable_mockModule("../../utils/systemToken.js", () => ({
    generateSystemToken: jest.fn()
}));

// 2. Import the mocked versions and the service using dynamic 'await import'
const fetch = (await import("node-fetch")).default;
const { generateSystemToken } = await import("../../utils/systemToken.js");
const { getRecommendationsForUser } = await import("../../services/recommendationService.js");

describe("getRecommendationsForUser", () => {
  beforeAll(() => {
    process.env.BACKEND_URL = "http://fake-backend";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns recommendations when API responds with data", async () => {
    const mockRecommendations = ["job1", "job2"];

    // Set up what our mocks return
    generateSystemToken.mockReturnValue("fake-token");
    fetch.mockResolvedValue({
      json: async () => ({
        recommendations: mockRecommendations
      })
    });

    const result = await getRecommendationsForUser("user123");

    // Assertions
    expect(result).toEqual(mockRecommendations);
    expect(generateSystemToken).toHaveBeenCalledWith("user123");
    expect(fetch).toHaveBeenCalledWith(
      "http://fake-backend/recommend",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer fake-token"
        }
      })
    );
  });

  test("returns empty array when recommendations are missing", async () => {
    generateSystemToken.mockReturnValue("fake-token");
    fetch.mockResolvedValue({
      json: async () => ({})
    });

    const result = await getRecommendationsForUser("user123");

    expect(result).toEqual([]);
  });
});