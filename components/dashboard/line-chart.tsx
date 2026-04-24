import { cn } from "@/lib/utils";

type Point = { date: string; revenueCents: number };

type LineChartProps = {
  data: Point[];
  comparison?: Point[];
  height?: number;
  className?: string;
};

const PADDING_X = 24;
const PADDING_Y = 18;
const VIEW_W = 800;

export function LineChart({
  data,
  comparison,
  height = 260,
  className,
}: LineChartProps) {
  const maxFromCurrent = Math.max(...data.map((d) => d.revenueCents), 0);
  const maxFromComparison = comparison
    ? Math.max(...comparison.map((d) => d.revenueCents), 0)
    : 0;
  const max = Math.max(maxFromCurrent, maxFromComparison, 1);
  const innerW = VIEW_W - PADDING_X * 2;
  const innerH = height - PADDING_Y * 2;

  const buildPath = (points: Point[]) => {
    if (points.length === 0) return "";
    const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;
    const coords = points.map((p, i) => {
      const x = PADDING_X + stepX * i;
      const y = PADDING_Y + innerH - (p.revenueCents / max) * innerH;
      return [x, y] as const;
    });
    return coords
      .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
      .join(" ");
  };

  const buildAreaPath = (points: Point[]) => {
    const linePath = buildPath(points);
    if (!linePath) return "";
    const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;
    const lastX = PADDING_X + stepX * (points.length - 1);
    return `${linePath} L ${lastX} ${PADDING_Y + innerH} L ${PADDING_X} ${PADDING_Y + innerH} Z`;
  };

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full text-ink", className)}
      role="img"
      aria-label="Revenue chart"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.10" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={PADDING_X}
          x2={VIEW_W - PADDING_X}
          y1={PADDING_Y + innerH * p}
          y2={PADDING_Y + innerH * p}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeDasharray="2 4"
        />
      ))}

      {comparison && (
        <path
          d={buildPath(comparison)}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      )}
      <path d={buildAreaPath(data)} fill="url(#chartFill)" />
      <path
        d={buildPath(data)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
