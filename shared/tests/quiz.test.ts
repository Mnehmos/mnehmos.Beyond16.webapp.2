import { describe, expect, it } from "vitest";
import { clamp, ema, initialAxes, updateAxesWithEma } from "../src/quiz.js";

describe("clamp", () => {
  it("clamps values to min and max", () => {
    expect(clamp(-2, -1, 1)).toBe(-1);
    expect(clamp(2, -1, 1)).toBe(1);
    expect(clamp(0.4, -1, 1)).toBe(0.4);
  });
});

describe("ema", () => {
  it("computes exponential moving average", () => {
    expect(ema(0, 1, 0.5)).toBe(0.5);
    expect(ema(0.4, -0.4, 0.25)).toBeCloseTo(0.2, 6);
  });
});

describe("updateAxesWithEma", () => {
  it("updates only provided axes and clamps to [-1, 1]", () => {
    const updated = updateAxesWithEma(initialAxes(), { EI: 2, TF: -2 }, 0.5);
    expect(updated.EI).toBe(1);
    expect(updated.TF).toBe(-1);
    expect(updated.SN).toBe(0);
    expect(updated.JP).toBe(0);
  });

  it("is deterministic for same input", () => {
    const axes = { EI: 0.2, SN: -0.3, TF: 0.4, JP: -0.5 };
    const delta = { EI: 0.9, SN: -0.9, TF: 0.2, JP: -0.2 };
    expect(updateAxesWithEma(axes, delta, 0.35)).toEqual(updateAxesWithEma(axes, delta, 0.35));
  });
});
