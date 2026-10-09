import { COOKIE_NAME } from "@shared/const";
import { answerForIntent, intentsForQuestion, type AssistantIntent } from "../shared/profileFacts";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const allowedIntents: AssistantIntent[] = [
  "profile",
  "skills",
  "projects",
  "education",
  "achievements",
  "contact",
  "availability",
  "resume",
  "unknown",
];

const classifierContext = `
You classify questions for a resume portfolio assistant. Return exactly one lowercase token from this list and nothing else:
profile, skills, projects, education, achievements, contact, availability, resume, unknown.

Use profile for a bio, introduction, background, or greeting.
Use skills for technologies, programming languages, or capabilities.
Use projects for projects, things built, embedded systems, soil moisture, smart car, or NodeMCU.
Use education for degree, college, institution, year, or CGPA.
Use achievements for hackathons, finalist status, coding platforms, or accomplishments.
Use contact for email, phone, LinkedIn, GitHub, LeetCode, CodeChef, or how to reach her.
Use availability for internships, hiring, opportunities, or whether she is open to work.
Use resume for questions about viewing or downloading the PDF resume.
Use unknown when the question cannot be answered from the supplied resume topics.
`;

async function classifyIntents(question: string): Promise<AssistantIntent[]> {
  const heuristic = intentsForQuestion(question);
  if (!(heuristic.length === 1 && heuristic[0] === "unknown")) return heuristic;

  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: classifierContext },
        { role: "user", content: question },
      ],
      maxTokens: 16,
    });
    const raw = result.choices?.[0]?.message?.content;
    const token = typeof raw === "string" ? raw.trim().toLowerCase().replace(/[^a-z]/g, "") : "";
    if (allowedIntents.includes(token as AssistantIntent)) return [token as AssistantIntent];
  } catch {
    // Use the safe unknown response when the managed LLM is unavailable.
  }

  return ["unknown"];
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  assistant: router({
    chat: publicProcedure
      .input(z.object({ question: z.string().trim().min(1).max(800) }))
      .mutation(async ({ input }) => {
        const intents = await classifyIntents(input.question);
        return { answer: intents.map(answerForIntent).join("\n\n") };
      }),
  }),
});

export type AppRouter = typeof appRouter;
