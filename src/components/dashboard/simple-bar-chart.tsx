"use client";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarData[];
  title?: string;
  unit?: string;
}

export function SimpleBarChart({ data, title, unit = "" }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-lg border bg-card p-5">
      {title && (
        <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      )}
      <div className="flex items-end gap-2" style={{ height: 160 }}>
        {data.map((item) => {
          const height = (item.value / max) * 100;
          return (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-medium text-foreground">
                {item.value.toLocaleString()}{unit}
              </span>
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max(height, 4)}%`,
                  backgroundColor: item.color ?? "hsl(var(--primary))",
                }}
              />
              <span className="text-[10px] text-muted-foreground">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
