import { jest } from '@jest/globals';

jest.unstable_mockModule("node-fetch", () => ({
    default: jest.fn()
}));

jest.unstable_mockModule("../../utils/systemToken.js", () => ({
    generateSystemToken: jest.fn()
}));

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

    generateSystemToken.mockReturnValue("fake-token");
    fetch.mockResolvedValue({
      json: async () => ({
        recommendations: mockRecommendations
      })
    });

    const result = await getRecommendationsForUser("user123");

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