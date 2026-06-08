import { SectionHeader } from "@/components/SectionHeader";
import { Chip } from "@/components/Chip";
import { TiltCard } from "@/components/TiltCard";
import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";
import { Briefcase, GitCommit } from "lucide-react";

export function Experience() {
  const { data: experience } = usePortfolioSection<Portfolio["experience"]>("experience");
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          command="git log --oneline experience"
          title="experience"
          caption="A short history of where I've shipped code in production."
        />

        <div className="relative pl-6 sm:pl-10">
          {/* Vertical branch line */}
          <div className="absolute left-2 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

          <div className="space-y-10">
            {experience.map((exp, idx) => (
              <article key={exp.id} className="relative reveal" style={{ transitionDelay: `${idx * 120}ms` }}>
                {/* Commit dot */}
                <div className="absolute -left-6 sm:-left-10 top-2 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--terminal-green)/0.7)]" />
                </div>

                <TiltCard className="rounded-lg border border-border bg-card p-5 sm:p-6 glow-hover">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground mb-3">
                    <GitCommit className="h-3.5 w-3.5 text-primary" />
                    <span className="text-terminal-amber">commit {exp.commit}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-terminal-cyan">({exp.branch})</span>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      {exp.role}
                      <span className="text-muted-foreground font-normal">@</span>
                      <span className="text-primary">{exp.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">{exp.duration}</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mb-4">{exp.type}</p>

                  <p className="text-foreground/90 leading-relaxed mb-4">{exp.description}</p>

                  <ul className="space-y-2 mb-5">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground/85">
                        <span className="font-mono text-primary mt-0.5">+</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map((s) => (
                      <Chip key={s} variant="green">
                        {s}
                      </Chip>
                    ))}
                  </div>
                </TiltCard>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
