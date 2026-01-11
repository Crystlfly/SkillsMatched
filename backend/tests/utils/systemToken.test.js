import jwt from "jsonwebtoken";
import { generateSystemToken } from "../../utils/systemToken.js";

describe("generateSystemToken", () => {
  beforeAll(() => {
    // fake secret for testing
    process.env.JWT_SECRET = "test_secret";
  });

  test("should generate a valid JWT token", () => {
    const userId = "user123";

    const token = generateSystemToken(userId);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  test("should include userId and role in token payload", () => {
    const userId = "user123";

    const token = generateSystemToken(userId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.userId).toBe(userId);
    expect(decoded.role).toBe("CANDIDATE");
  });
});
