interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.positive ? "text-green-600" : "text-red-500"
              }`}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
