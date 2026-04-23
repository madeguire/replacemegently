interface StatCardProps {
  label: string;
  value: number;
  className?: string;
}

const sparklineBars = [40, 65, 35, 80, 55, 90, 45, 70, 60, 85, 50, 75];

export default function StatCard({
  label,
  value,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white border border-border px-5 py-4 shadow-lg ${className}`}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted font-body">
          {label}
        </p>
        <span className="text-[9px] font-body text-muted/60">●</span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <span className="text-3xl font-display text-foreground tabular-nums leading-none">
          {value}%
        </span>
        {/* Sparkline bars */}
        <div className="flex items-end gap-[3px] h-8 pb-1">
          {sparklineBars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] bg-foreground/80 rounded-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
