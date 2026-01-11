import { jest } from '@jest/globals';
const mockPrisma = {
  user: {
    findMany: jest.fn()
  }
};

const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
};

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

const { getRecommendationsForUser } = await import("../../services/recommendationService.js");
const { sendWeeklyJobEmails } = await import("../../services/emailService.js");

describe("sendWeeklyJobEmails", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = "test@gmail.com";
    process.env.EMAIL_PASS = "password";
    process.env.FRONTEND_URL = "http://localhost:3000";
  });

  test("should send emails only to users who have recommendations", async () => {
    const mockUsers = [
      { id: "user_1", email: "user1@test.com", name: "Anusha" },
      { id: "user_2", email: "user2@test.com", name: "SkillMatch" }
    ];
    
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);
    
    getRecommendationsForUser.mockImplementation((userId) => {
      if (userId === "user_1") {
        return Promise.resolve([
          { 
            job: { title: "Software Engineer", company: "Google", location: "Bangalore", salary: "20LPA" }, 
            score: 0.95 
          }
        ]);
      }
      return Promise.resolve([]);
    });

    await sendWeeklyJobEmails();

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { role: "CANDIDATE" }
    }));

    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    
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