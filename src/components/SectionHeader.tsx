import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { GlitchText } from "@/components/GlitchText";

interface SectionHeaderProps {
  command: string;
  title: string;
  caption?: string;
  className?: string;
  icon?: ReactNode;
}

export function SectionHeader({ command, title, caption, className, icon }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 reveal", className)}>
      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-muted-foreground mb-3">
        <span className="text-terminal-green">$</span>
        <span className="text-terminal-cyan">goutham@portfolio</span>
        <span className="text-muted-foreground">:~$</span>
        <span className="text-foreground">{command}</span>
        <span className="cursor-blink" />
      </div>
      <div className="flex items-end gap-3 flex-wrap">
        {icon && <div className="text-primary">{icon}</div>}
        <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-muted-foreground">#</span>{" "}
          <GlitchText text={title} />
        </h2>
      </div>
      {caption && <p className="mt-3 text-muted-foreground max-w-2xl">{caption}</p>}
    </div>
  );
}
