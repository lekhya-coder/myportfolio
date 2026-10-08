import { COOKIE_NAME } from "@shared/const";
import { answerForIntent, type AssistantIntent } from "../shared/profileFacts";
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
Use education for degree, college, institution, year, or SGPA.
Use achievements for hackathons, finalist status, coding platforms, or accomplishments.
Use contact for email, phone, LinkedIn, GitHub, LeetCode, CodeChef, or how to reach her.
Use availability for internships, hiring, opportunities, or whether she is open to work.
Use resume for questions about viewing or downloading the PDF resume.
Use unknown when the question cannot be answered from the supplied resume topics.
`;

function heuristicIntent(question: string): AssistantIntent {
  const q = question.toLowerCase();
  if (/intern|hire|job|availab|opportunit|open to work|recruit/.test(q)) return "availability";
  if (/contact|email|phone|linkedin|github|leetcode|codechef|reach|call|message/.test(q)) return "contact";
  if (/resume|cv|download|pdf/.test(q)) return "resume";
  if (/project|built|build|worked|soil|moisture|car|nodemcu|wi-?fi|hardware|embedded/.test(q)) return "projects";
  if (/skill|language|tech|stack|java|c\+\+|\bc\b|dsa|data structure|html|css|javascript|microcontroller|sensor/.test(q)) return "skills";
  if (/education|college|university|sgpa|cgpa|gpa|vnrvjiet|study|degree|year|coursework/.test(q)) return "education";
  if (/hackathon|achievement|award|competition|contest|synthe|vision|finalist|coding practice/.test(q)) return "achievements";
  if (/summary|bio|profile|background|about|who is|hello|hi|hey|introduce/.test(q)) return "profile";
  return "unknown";
}

async function classifyIntent(question: string): Promise<AssistantIntent> {
  const heuristic = heuristicIntent(question);
  if (heuristic !== "unknown") return heuristic;

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
    if (allowedIntents.includes(token as AssistantIntent)) return token as AssistantIntent;
  } catch {
    // Use the safe unknown response when the managed LLM is unavailable.
  }

  return "unknown";
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
        const intent = await classifyIntent(input.question);
        return { answer: answerForIntent(intent) };
      }),
  }),
});

export type AppRouter = typeof appRouter;
