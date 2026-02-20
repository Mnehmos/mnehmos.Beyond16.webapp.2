import express from "express";
import cors from "cors";
import {
  ChatRequestSchema,
  ChatResponseSchema,
  deriveMbti,
  updateAxesWithEma,
  type AxisScores,
} from "@mbti/shared";

function messageToAxisSignal(message: string): AxisScores {
  const text = message.toLowerCase();
  const hash = [...text].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return {
    EI: text.includes("people") || text.includes("group") ? 0.8 : (hash % 200) / 100 - 1,
    SN: text.includes("details") || text.includes("facts") ? 0.8 : ((hash >> 1) % 200) / 100 - 1,
    TF: text.includes("logic") || text.includes("objective") ? 0.8 : ((hash >> 2) % 200) / 100 - 1,
    JP: text.includes("plan") || text.includes("schedule") ? 0.8 : ((hash >> 3) % 200) / 100 - 1,
  };
}

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/chat", (req, res) => {
    const parsed = ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    const { message, quizState } = parsed.data;
    const signal = messageToAxisSignal(message);
    const axes = updateAxesWithEma(quizState.axes, signal, 0.35);
    const nextTurn = quizState.turn + 1;
    const done = nextTurn >= 8;
    const progress = Math.min(1, nextTurn / 8);

    const response = {
      assistantMessage: done
        ? "Quiz complete. Deterministic MBTI result ready."
        : `Q${nextTurn}: Tell me how you typically react in social, planning, or decision contexts.`,
      phase: done ? "result" : nextTurn === 1 ? "intro" : "question",
      progress,
      done,
      result: done
        ? {
            mbti: deriveMbti(axes),
            axes,
          }
        : null,
    };

    const contract = ChatResponseSchema.parse(response);
    return res.json(contract);
  });

  return app;
}
