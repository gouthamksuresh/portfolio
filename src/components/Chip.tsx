import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  variant?: "green" | "cyan" | "amber" | "magenta" | "muted";
  className?: string;
}

const variantMap: Record<NonNullable<ChipProps["variant"]>, string> = {
  green: "border-terminal-green/40 text-terminal-green bg-terminal-green/5 hover:bg-terminal-green/15",
  cyan: "border-terminal-cyan/40 text-terminal-cyan bg-terminal-cyan/5 hover:bg-terminal-cyan/15",
  amber: "border-terminal-amber/40 text-terminal-amber bg-terminal-amber/5 hover:bg-terminal-amber/15",
  magenta: "border-terminal-magenta/40 text-terminal-magenta bg-terminal-magenta/5 hover:bg-terminal-magenta/15",
  muted: "border-border text-muted-foreground bg-muted/30 hover:text-foreground",
};

export function Chip({ children, variant = "muted", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-colors",
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
