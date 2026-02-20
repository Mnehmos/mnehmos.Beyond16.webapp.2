export type AxisKey = "EI" | "SN" | "TF" | "JP";

export type AxisScores = Record<AxisKey, number>;

export type QuizPhase = "intro" | "question" | "result";

export interface QuizState {
  turn: number;
  axes: AxisScores;
}

export const AXES: AxisKey[] = ["EI", "SN", "TF", "JP"];

export function initialAxes(): AxisScores {
  return { EI: 0, SN: 0, TF: 0, JP: 0 };
}

export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error("min must be <= max");
  }
  return Math.min(max, Math.max(min, value));
}

export function ema(previous: number, next: number, alpha: number): number {
  const a = clamp(alpha, 0, 1);
  return a * next + (1 - a) * previous;
}

export function updateAxesWithEma(
  current: AxisScores,
  delta: Partial<AxisScores>,
  alpha: number,
  min = -1,
  max = 1,
): AxisScores {
  const next: AxisScores = { ...current };
  for (const axis of AXES) {
    if (delta[axis] === undefined) {
      continue;
    }
    next[axis] = clamp(ema(current[axis], delta[axis] as number, alpha), min, max);
  }
  return next;
}

export function deriveMbti(scores: AxisScores): string {
  const e = scores.EI >= 0 ? "E" : "I";
  const s = scores.SN >= 0 ? "S" : "N";
  const t = scores.TF >= 0 ? "T" : "F";
  const j = scores.JP >= 0 ? "J" : "P";
  return `${e}${s}${t}${j}`;
}
