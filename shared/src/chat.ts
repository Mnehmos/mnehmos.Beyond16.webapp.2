import { z } from "zod";
import { AXES, type AxisScores } from "./quiz.js";

const AxisScoresSchema = z.object({
  EI: z.number().min(-1).max(1),
  SN: z.number().min(-1).max(1),
  TF: z.number().min(-1).max(1),
  JP: z.number().min(-1).max(1),
}).strict();

export const QuizStateSchema = z.object({
  turn: z.number().int().min(0).max(12),
  axes: AxisScoresSchema,
}).strict();

export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  quizState: QuizStateSchema,
}).strict();

export const ChatResultSchema = z.object({
  mbti: z.string().length(4),
  axes: AxisScoresSchema,
}).strict();

export const ChatResponseSchema = z.object({
  assistantMessage: z.string().min(1),
  phase: z.enum(["intro", "question", "result"]),
  progress: z.number().min(0).max(1),
  done: z.boolean(),
  result: ChatResultSchema.nullable(),
}).strict();

export type ChatQuizState = z.infer<typeof QuizStateSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type ChatResult = z.infer<typeof ChatResultSchema>;
export type { AxisScores };
export { AXES };
