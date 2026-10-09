import { describe, expect, it } from "vitest";
import { answerForIntent, intentForQuestion, intentsForQuestion } from "./profileFacts";

describe("resume assistant intent routing", () => {
  it("routes the main resume topics to grounded answers", () => {
    expect(intentForQuestion("Tell me about yourself")).toBe("profile");
    expect(intentForQuestion("What are your technical skills and stack?")).toBe("skills");
    expect(intentForQuestion("Tell me about your projects")).toBe("projects");
    expect(intentForQuestion("What is your education and CGPA?")).toBe("education");
    expect(intentForQuestion("What hackathon did you reach the finals of?")).toBe("achievements");
    expect(intentForQuestion("How can I contact you?")).toBe("contact");
    expect(intentForQuestion("How can I get in touch with you?")).toBe("contact");
    expect(intentForQuestion("Are you available for an internship?")).toBe("availability");
    expect(intentForQuestion("Can I view and download your resume PDF?")).toBe("resume");
  });

  it("keeps greetings and unsupported questions safe", () => {
    expect(intentForQuestion("hello")).toBe("profile");
    expect(intentForQuestion("What is your favorite movie?")).toBe("unknown");
  });

  it("exposes direct resume links in the resume answer", () => {
    const answer = answerForIntent("resume");
    expect(answer).toContain("View resume");
    expect(answer).toContain("Download PDF");
    expect(answer).not.toContain("](");
    expect(answer).not.toContain("[blocked]");
  });

  it("keeps contact details readable without blocked link markup", () => {
    const answer = answerForIntent("contact");
    expect(answer).toContain("linkedin.com/in/lekhya-vinjamuri");
    expect(answer).toContain("github.com/lekhya-coder");
    expect(answer).not.toContain("](");
    expect(answer).not.toContain("[blocked]");
  });

  it("uses the supplied professional profile wording", () => {
    const answer = answerForIntent("profile");
    expect(answer).toContain("Aspiring **Software Engineer**");
    expect(answer).toContain("CGPA: 9.48/10");
  });

  it("returns every matching topic for a combined question", () => {
    expect(intentsForQuestion("Tell me about your technical skills and projects")).toEqual(["projects", "skills"]);
    expect(intentsForQuestion("Share your education and achievements")).toEqual(["education", "achievements"]);
  });
});
