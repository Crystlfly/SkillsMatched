import { jest } from '@jest/globals';

// 1. Create a Shared Mock Object
// This ensures the service and the test talk to the exact same "spy"
const mockPrisma = {
  user: {
    findMany: jest.fn()
  }
};

const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
};

// 2. Setup ESM Mocks
jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma)
}));

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: jest.fn().mockReturnValue(mockTransporter)
  }
}));

jest.unstable_mockModule("../../services/recommendationService.js", () => ({
  getRecommendationsForUser: jest.fn()
}));

// 3. Dynamic Imports (Must happen after mocks)
const { getRecommendationsForUser } = await import("../../services/recommendationService.js");
const { sendWeeklyJobEmails } = await import("../../services/emailService.js");

describe("sendWeeklyJobEmails", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Set dummy env variables
    process.env.EMAIL_USER = "test@gmail.com";
    process.env.EMAIL_PASS = "password";
    process.env.FRONTEND_URL = "http://localhost:3000";
  });

  test("should send emails only to users who have recommendations", async () => {
    // ARRANGE: Setup 2 users
    const mockUsers = [
      { id: "user_1", email: "user1@test.com", name: "Anusha" },
      { id: "user_2", email: "user2@test.com", name: "SkillMatch" }
    ];
    
    // Fix: Ensure findMany returns the array so it is "iterable"
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);
    
    // User 1 gets a job, User 2 gets nothing
    getRecommendationsForUser.mockImplementation((userId) => {
      if (userId === "user_1") {
        return Promise.resolve([
          { 
            job: { title: "Software Engineer", company: "Google", location: "Bangalore", salary: "20LPA" }, 
            score: 0.95 
          }
        ]);
      }
      return Promise.resolve([]); // User 2 triggers the 'continue' skip
    });

    // ACT
    await sendWeeklyJobEmails();

    // ASSERT
    // Check if Prisma was called correctly
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { role: "CANDIDATE" }
    }));

    // Check if Email was sent ONLY ONCE (to User 1)
    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    
    // Check if the email content is correct
    const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
    expect(sentEmail.to).toBe("user1@test.com");
    expect(sentEmail.subject).toContain("Weekly Job Recommendations");
    expect(sentEmail.html).toContain("Software Engineer");
    expect(sentEmail.html).toContain("Anusha");
  });

  test("should send no emails if no candidates are found", async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    
    await sendWeeklyJobEmails();
    
    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });
});