import request from "supertest";
import { describe, expect, it } from "vitest";
import { ChatResponseSchema } from "@mbti/shared";
import { createApp } from "../src/app.js";

describe("API contract", () => {
  const app = createApp();

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("POST /chat returns deterministic valid contract", async () => {
    const payload = {
      message: "I prefer planning in advance",
      quizState: {
        turn: 3,
        axes: { EI: 0, SN: 0, TF: 0, JP: 0 },
      },
    };

    const first = await request(app).post("/chat").send(payload);
    const second = await request(app).post("/chat").send(payload);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.body).toEqual(second.body);

    const parsed = ChatResponseSchema.safeParse(first.body);
    expect(parsed.success).toBe(true);
    expect(first.body).toHaveProperty("assistantMessage");
    expect(first.body).toHaveProperty("phase");
    expect(first.body).toHaveProperty("progress");
    expect(first.body).toHaveProperty("done");
    expect(first.body).toHaveProperty("result");
  });

  it("POST /chat rejects invalid payload", async () => {
    const res = await request(app).post("/chat").send({ bad: true });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });
});
