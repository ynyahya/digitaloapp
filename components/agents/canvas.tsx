import type { AgentEdge, AgentNode, NodeKind } from "@/lib/agents/templates";

// Monochrome, light-mode canvas. No dark terminal vibes — the node palette
// is just ink/paper/line tokens with a subtle grid. Layout is computed from
// the { col, row } hints on each node so templates stay declarative.

const NODE_W = 168;
const NODE_H = 64;
const COL_GAP = 56;
const ROW_GAP = 24;
const PAD_X = 24;
const PAD_Y = 24;

function nodeKindLabel(kind: NodeKind): string {
  switch (kind) {
    case "trigger":
      return "Trigger";
    case "action":
      return "Action";
    case "condition":
      return "Condition";
    case "ai":
      return "AI";
  }
}

function nodeKindClass(kind: NodeKind): string {
  switch (kind) {
    case "trigger":
      return "border-ink bg-ink text-paper";
    case "ai":
      return "border-ink bg-paper text-ink ring-1 ring-ink/10";
    case "condition":
      return "border-dashed border-ink/40 bg-paper-soft text-ink";
    case "action":
    default:
      return "border-line bg-paper text-ink";
  }
}

export function AgentCanvas({
  nodes,
  edges,
}: {
  nodes: AgentNode[];
  edges: AgentEdge[];
}) {
  const maxCol = Math.max(0, ...nodes.map((n) => n.col));
  const maxRowByCol = new Map<number, number>();
  for (const n of nodes) {
    maxRowByCol.set(n.col, Math.max(n.row, maxRowByCol.get(n.col) ?? 0));
  }
  const maxRow = Math.max(0, ...Array.from(maxRowByCol.values()));

  const width = PAD_X * 2 + (maxCol + 1) * NODE_W + maxCol * COL_GAP;
  const height = PAD_Y * 2 + (maxRow + 1) * NODE_H + maxRow * ROW_GAP;

  const pos = new Map<string, { x: number; y: number }>();
  for (const n of nodes) {
    pos.set(n.id, {
      x: PAD_X + n.col * (NODE_W + COL_GAP),
      y: PAD_Y + n.row * (NODE_H + ROW_GAP),
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
      <div
        className="relative"
        style={{
          width,
          height,
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          backgroundPosition: "8px 8px",
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          width={width}
          height={height}
          aria-hidden
        >
          <defs>
            <marker
              id="agent-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const from = pos.get(e.from);
            const to = pos.get(e.to);
            if (!from || !to) return null;
            const x1 = from.x + NODE_W;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x;
            const y2 = to.y + NODE_H / 2;
            const midX = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            return (
              <g key={i} className="text-ink/40">
                <path
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.25}
                  markerEnd="url(#agent-arrow)"
                />
                {e.label && (
                  <text
                    x={midX}
                    y={(y1 + y2) / 2 - 4}
                    textAnchor="middle"
                    className="fill-ink text-[10px] font-medium"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((n) => {
          const p = pos.get(n.id)!;
          return (
            <div
              key={n.id}
              className={
                "absolute flex flex-col justify-center rounded-xl border px-3 py-2 shadow-[0_1px_0_rgba(0,0,0,0.02)] " +
                nodeKindClass(n.kind)
              }
              style={{
                left: p.x,
                top: p.y,
                width: NODE_W,
                height: NODE_H,
              }}
            >
              <p
                className={
                  "text-[10px] font-semibold uppercase tracking-[0.14em] " +
                  (n.kind === "trigger" ? "text-paper/60" : "text-ink-subtle")
                }
              >
                {nodeKindLabel(n.kind)}
              </p>
              <p className="truncate text-[12.5px] font-medium leading-tight">
                {n.label}
              </p>
              {n.sub && (
                <p
                  className={
                    "truncate text-[10.5px] " +
                    (n.kind === "trigger" ? "text-paper/70" : "text-ink-muted")
                  }
                >
                  {n.sub}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
