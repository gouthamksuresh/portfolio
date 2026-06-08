import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { usePortfolioSection } from "@/lib/portfolioStore";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Languages: "text-terminal-cyan",
  "DevOps & Cloud": "text-terminal-green",
  Frameworks: "text-terminal-amber",
  Databases: "text-terminal-magenta",
  Tools: "text-foreground",
  Specializations: "text-terminal-cyan",
};

export function Skills() {
  const { data: skillsMap } = usePortfolioSection<Record<string, string[]>>("skills");
  const categories = Object.keys(skillsMap);
  const [active, setActive] = useState<string>(categories[0] ?? "");
  useEffect(() => {
    if (categories.length && !categories.includes(active)) setActive(categories[0]);
  }, [categories, active]);
  const skills = skillsMap[active] ?? [];

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          command="kubectl get skills --all-namespaces"
          title="skills"
          caption="The stack I reach for to build, ship, and run."
        />

        <div className="rounded-lg border border-border bg-card overflow-hidden reveal">
          <div className="terminal-header">
            <span className="terminal-dot bg-terminal-red/80" />
            <span className="terminal-dot bg-terminal-amber/80" />
            <span className="terminal-dot bg-terminal-green/80" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">~/skills.yml</span>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 px-3 sm:px-4 pt-3 border-b border-border/60">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "px-3 py-1.5 font-mono text-xs rounded-t-md border border-b-0 transition-colors -mb-px",
                  active === c
                    ? "border-border bg-background text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {c.toLowerCase().replace(/\s/g, "_")}
              </button>
            ))}
          </div>

          {/* kubectl table */}
          <div className="p-4 sm:p-5 font-mono text-sm overflow-x-auto">
            <div className="grid grid-cols-12 gap-3 pb-2 mb-2 border-b border-border/60 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="col-span-5 sm:col-span-4">NAME</div>
              <div className="col-span-3 sm:col-span-3">CATEGORY</div>
              <div className="col-span-2 sm:col-span-2">STATUS</div>
              <div className="hidden sm:block sm:col-span-3">PROFICIENCY</div>
              <div className="col-span-2 sm:hidden text-right">LV</div>
            </div>

            <div className="space-y-1.5" key={active}>
              {skills.map((s, i) => {
                const proficiency = 70 + ((s.length * 7) % 26); // pseudo bar 70-95
                return (
                  <div
                    key={s}
                    className="grid grid-cols-12 gap-3 items-center py-1.5 px-2 -mx-2 rounded hover:bg-muted/40 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="col-span-5 sm:col-span-4 font-semibold text-foreground truncate">
                      {s.toLowerCase().replace(/\s/g, "-")}
                    </div>
                    <div className={cn("col-span-3 sm:col-span-3 text-xs", statusColors[active])}>
                      {active.split(" ")[0].toLowerCase()}
                    </div>
                    <div className="col-span-2 sm:col-span-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-terminal-green">
                        <span className="h-1.5 w-1.5 rounded-full bg-terminal-green animate-pulse" />
                        Running
                      </span>
                    </div>
                    <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan"
                          style={{ width: `${proficiency}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums w-8">
                        {proficiency}%
                      </span>
                    </div>
                    <div className="col-span-2 sm:hidden text-right text-[10px] text-muted-foreground tabular-nums">
                      {proficiency}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 font-mono text-xs text-muted-foreground">
              <span className="text-terminal-green">$</span> {skills.length} resource{skills.length === 1 ? "" : "s"} listed in{" "}
              <span className="text-primary">{active.toLowerCase()}</span> namespace.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
