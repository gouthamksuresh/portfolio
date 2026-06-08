import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  className?: string;
  children: ReactNode;
  glow?: boolean;
}

export function TerminalWindow({ title = "~/goutham — zsh", className, children, glow }: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "terminal-window scanlines",
        glow && "shadow-[0_0_40px_hsl(var(--terminal-green)/0.15)]",
        className
      )}
    >
      <div className="terminal-header">
        <span className="terminal-dot bg-terminal-red/80" />
        <span className="terminal-dot bg-terminal-amber/80" />
        <span className="terminal-dot bg-terminal-green/80" />
        <span className="ml-3 font-mono text-xs text-muted-foreground truncate">{title}</span>
      </div>
      <div className="p-4 sm:p-5 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}
