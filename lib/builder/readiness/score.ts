import type { ReadinessCheck, ReadinessSummary } from "./types";

export function summarizeReadiness(checks: ReadinessCheck[]): ReadinessSummary {
  const total = checks.length;
  const done = checks.filter((check) => check.done).length;
  const required = checks.filter((check) => check.severity === "required");
  const requiredDone = required.filter((check) => check.done).length;

  return {
    total,
    done,
    requiredTotal: required.length,
    requiredDone,
    score: total === 0 ? 100 : Math.round((done / total) * 100),
    canPublish: required.every((check) => check.done),
  };
}

export function getNextReadinessAction(checks: ReadinessCheck[]) {
  return checks.find((check) => !check.done && check.severity === "required") ?? checks.find((check) => !check.done);
}
