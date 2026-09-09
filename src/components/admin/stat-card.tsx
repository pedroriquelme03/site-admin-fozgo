import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "#0EA5B7",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span
          className="grid size-10 place-content-center rounded-lg"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      {hint && (
        <p className={cn("mt-1 text-xs text-muted-foreground")}>{hint}</p>
      )}
    </Card>
  );
}
