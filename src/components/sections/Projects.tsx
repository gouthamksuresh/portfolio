import { SectionHeader } from "@/components/SectionHeader";
import { TerminalWindow } from "@/components/TerminalWindow";
import { Chip } from "@/components/Chip";
import { TiltCard } from "@/components/TiltCard";
import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";
import { useCountUp } from "@/hooks/useCountUp";
import { ExternalLink, Github } from "lucide-react";
import { useState, useEffect } from "react";

function PipelineDiagram({ stages }: { stages: string[] }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="rounded-lg border border-border bg-background/60 p-4 sm:p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
        $ pipeline.run()
      </div>
      <div className="relative flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="px-3 py-2 rounded-md border font-mono text-xs whitespace-nowrap transition-all duration-500"
              style={{
                borderColor:
                  i <= activeStage
                    ? "hsl(152 100% 50% / 0.7)"
                    : "hsl(152 100% 50% / 0.2)",
                backgroundColor:
                  i === activeStage
                    ? "hsl(152 100% 50% / 0.15)"
                    : i < activeStage
                    ? "hsl(152 100% 50% / 0.05)"
                    : "transparent",
                boxShadow:
                  i === activeStage
                    ? "0 0 16px hsl(152 100% 50% / 0.3)"
                    : "none",
              }}
            >
              <span
                className="transition-colors duration-500"
                style={{
                  color:
                    i <= activeStage
                      ? "hsl(152 100% 50%)"
                      : "hsl(152 100% 50% / 0.4)",
                }}
              >
                {i < activeStage ? "✓" : i === activeStage ? "●" : "○"}
              </span>{" "}
              {s}
            </div>
            {i < stages.length - 1 && (
              <span
                className="font-mono text-lg transition-colors duration-500"
                style={{
                  color:
                    i < activeStage
                      ? "hsl(152 100% 50% / 0.8)"
                      : "hsl(152 100% 50% / 0.3)",
                }}
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { value: v, ref } = useCountUp(value);
  return (
    <div className="rounded-lg border border-border bg-background/60 p-4 text-center glow-hover">
      <span ref={ref} className="font-mono text-2xl sm:text-3xl font-bold text-primary">
        {v}
        {suffix}
      </span>
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

export function Projects() {
  const { data: projects } = usePortfolioSection<Portfolio["projects"]>("projects");
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          command="ls -la ~/projects"
          title="projects"
          caption="Real things I've built, broken, fixed, and shipped."
        />

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((proj, idx) => (
            <article key={proj.id} className="reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
              <TiltCard>
                <TerminalWindow title={`~/projects/${proj.slug}`}>
                  <div className="space-y-5">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground mb-2">
                        <span className="text-terminal-amber">{proj.duration}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-sans mb-1.5">{proj.title}</h3>
                      <p className="text-primary font-mono text-sm">// {proj.tagline}</p>
                    </div>

                    <p className="text-foreground/85 font-sans text-sm leading-relaxed">
                      {proj.description}
                    </p>

                    {"pipeline" in proj && proj.pipeline && (
                      <PipelineDiagram stages={proj.pipeline} />
                    )}

                    {"metrics" in proj && proj.metrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {proj.metrics.map((m) => (
                          <Metric key={m.label} {...m} />
                        ))}
                      </div>
                    )}

                    <ul className="space-y-1.5">
                      {proj.features.map((f, i) => (
                        <li key={i} className="flex gap-3 text-sm text-foreground/85 font-sans">
                          <span className="font-mono text-primary">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {proj.stack.map((s) => (
                        <Chip key={s} variant="cyan">
                          {s}
                        </Chip>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-primary/60 hover:text-primary font-mono text-xs transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" /> source
                      </a>
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> details
                      </a>
                    </div>
                  </div>
                </TerminalWindow>
              </TiltCard>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
