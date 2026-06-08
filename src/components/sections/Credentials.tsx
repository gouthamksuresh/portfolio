import { SectionHeader } from "@/components/SectionHeader";
import { Chip } from "@/components/Chip";
import { TiltCard } from "@/components/TiltCard";
import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";
import { Award, GraduationCap } from "lucide-react";

export function Credentials() {
  const { data: education } = usePortfolioSection<Portfolio["education"]>("education");
  const { data: certifications } = usePortfolioSection<Portfolio["certifications"]>("certifications");
  return (
    <section id="credentials" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          command="ls ~/credentials/"
          title="education & certs"
          caption="Where I learned the fundamentals and what I've certified."
        />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Education */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary mb-1 reveal">
              <GraduationCap className="h-4 w-4" /> education
            </h3>
            {education.map((e, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <TiltCard className="rounded-lg border border-border bg-card p-5 glow-hover">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h4 className="font-bold text-base sm:text-lg leading-tight">{e.degree}</h4>
                    <span
                      className={`shrink-0 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        e.status === "In Progress"
                          ? "border-terminal-amber/50 text-terminal-amber bg-terminal-amber/5"
                          : "border-terminal-green/40 text-terminal-green bg-terminal-green/5"
                      }`}
                    >
                      {e.status}
                    </span>
                  </div>
                  {e.specialization && (
                    <p className="text-primary font-mono text-xs mb-2">// {e.specialization}</p>
                  )}
                  <p className="text-sm text-foreground/85">{e.institution}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {e.location} · {e.duration}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(e.focus ?? []).map((f) => (
                      <Chip key={f} variant="muted">
                        {f}
                      </Chip>
                    ))}
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="lg:col-span-3">
            <h3 className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary mb-4 reveal">
              <Award className="h-4 w-4" /> certifications
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((c, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <TiltCard className="rounded-lg border border-border bg-card p-5 glow-hover flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Award className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {c.date}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base leading-snug mb-1">{c.title}</h4>
                    <p className="text-xs text-terminal-cyan font-mono mb-3">{c.issuer}</p>
                    {c.credentialId && (
                      <p className="text-[10px] font-mono text-muted-foreground mb-3 truncate">
                        id: {c.credentialId}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {(c.tags ?? []).map((t) => (
                        <Chip key={t} variant="green">
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
