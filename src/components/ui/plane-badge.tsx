
import { cn } from "@/lib/utils";

interface PlaneBadgeProps {
  plane: "material" | "emerald" | "inferno" | "ethereal" | "astral";
  className?: string;
  children: React.ReactNode;
}

export function PlaneBadge({ plane, className, children }: PlaneBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-plane-material/10 text-plane-material": plane === "material",
          "bg-plane-emerald/10 text-plane-emerald": plane === "emerald",
          "bg-plane-inferno/10 text-plane-inferno": plane === "inferno",
          "bg-plane-ethereal/10 text-plane-ethereal": plane === "ethereal",
          "bg-plane-astral/10 text-plane-astral": plane === "astral",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
