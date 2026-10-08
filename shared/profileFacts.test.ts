import { describe, expect, it } from "vitest";
import { answerForIntent, intentForQuestion } from "./profileFacts";

describe("resume assistant intent routing", () => {
  it("routes the main resume topics to grounded answers", () => {
    expect(intentForQuestion("Tell me about yourself")).toBe("profile");
    expect(intentForQuestion("What are your technical skills and stack?")).toBe("skills");
    expect(intentForQuestion("Tell me about your projects")).toBe("projects");
    expect(intentForQuestion("What is your education and SGPA?")).toBe("education");
    expect(intentForQuestion("What hackathon did you reach the finals of?")).toBe("achievements");
    expect(intentForQuestion("How can I contact you?")).toBe("contact");
    expect(intentForQuestion("Are you available for an internship?")).toBe("availability");
    expect(intentForQuestion("Can I view and download your resume PDF?")).toBe("resume");
  });

  it("keeps greetings and unsupported questions safe", () => {
    expect(intentForQuestion("hello")).toBe("profile");
    expect(intentForQuestion("What is your favorite movie?")).toBe("unknown");
  });

  it("exposes direct resume links in the resume answer", () => {
    const answer = answerForIntent("resume");
    expect(answer).toContain("/resume.pdf");
    expect(answer).toContain("view the resume PDF");
  });
});
