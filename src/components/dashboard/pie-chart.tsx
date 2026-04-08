"use client";

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieSlice[];
  title?: string;
}

export function SimplePieChart({ data, title }: SimplePieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulativePercent = 0;

  // Build conic gradient
  const gradientParts = data.map((slice) => {
    const start = cumulativePercent;
    cumulativePercent += (slice.value / total) * 100;
    return `${slice.color} ${start}% ${cumulativePercent}%`;
  });

  return (
    <div className="rounded-lg border bg-card p-5">
      {title && (
        <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      )}
      <div className="flex items-center gap-6">
        <div
          className="h-28 w-28 flex-shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${gradientParts.join(", ")})`,
          }}
        />
        <div className="space-y-2">
          {data.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-muted-foreground">{slice.label}</span>
              <span className="font-medium text-foreground">
                {Math.round((slice.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
