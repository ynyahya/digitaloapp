import { BuilderStatusBadge } from "./builder-status-badge";

export type BuilderSaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export function BuilderSaveIndicator({ status }: { status: BuilderSaveStatus }) {
  if (status === "saving") return <BuilderStatusBadge label="Saving" tone="saving" />;
  if (status === "saved") return <BuilderStatusBadge label="Saved" tone="success" />;
  if (status === "error") return <BuilderStatusBadge label="Save error" tone="danger" />;
  if (status === "dirty") return <BuilderStatusBadge label="Unsaved" tone="warning" />;
  return <BuilderStatusBadge label="Ready" tone="neutral" />;
}
