export type ReadinessSeverity = "required" | "recommended" | "optional";

export type ReadinessCheck = {
  id: string;
  label: string;
  description: string;
  severity: ReadinessSeverity;
  done: boolean;
  actionLabel: string;
  targetSection: string;
};

export type ReadinessSummary = {
  total: number;
  done: number;
  requiredTotal: number;
  requiredDone: number;
  score: number;
  canPublish: boolean;
};
