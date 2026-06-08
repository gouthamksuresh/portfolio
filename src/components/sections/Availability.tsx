import { TerminalWindow } from "@/components/TerminalWindow";
import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";

export function Availability() {
  const { data: o } = usePortfolioSection<Portfolio["openToWork"]>("openToWork");
  const { data: p } = usePortfolioSection<Portfolio["personal"]>("identity");
  const roles = [...(o.roles ?? []), ...(o.roles ?? [])]; // doubled for marquee

  return (
    <section className="relative py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="reveal">
            <TerminalWindow title="~/availability.json">
              <pre className="font-mono text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
{`{
  `}<span className="text-terminal-cyan">"status"</span>{`: `}<span className="text-terminal-green">"open_to_work"</span>{`,
  `}<span className="text-terminal-cyan">"availability"</span>{`: `}<span className="text-terminal-amber">"{o.availability}"</span>{`,
  `}<span className="text-terminal-cyan">"notice_required"</span>{`: `}<span className="text-terminal-amber">"none"</span>{`,
  `}<span className="text-terminal-cyan">"work_mode"</span>{`: `}<span className="text-terminal-magenta">[{o.workMode.map(m => `"${m}"`).join(", ")}]</span>{`,
  `}<span className="text-terminal-cyan">"willing_to_relocate"</span>{`: `}<span className="text-terminal-green">true</span>{`,
  `}<span className="text-terminal-cyan">"target_roles"</span>{`: `}<span className="text-foreground/60">[{o.roles.length} positions →]</span>{`
}`}
              </pre>
            </TerminalWindow>
          </div>

          <div className="rounded-lg border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between reveal">
            <div>
              <p className="bracket-label mb-3">CTA</p>
              <h3 className="font-mono text-2xl sm:text-3xl font-bold leading-tight mb-3">
                Looking to hire a <span className="text-primary text-glow">DevOps engineer</span>{" "}
                who actually ships?
              </h3>
              <p className="text-muted-foreground mb-6">
                I'm immediately available, comfortable with remote/on-site/hybrid, and willing to
                relocate. Let's build a pipeline that doesn't break at 2 AM.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-semibold hover:shadow-[0_0_24px_hsl(var(--terminal-green)/0.5)] transition-shadow"
              >
                $ ./hire_me
              </a>
              <a
                href={p.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border hover:border-primary/60 hover:text-primary font-mono text-sm transition-colors"
              >
                view linkedin
              </a>
            </div>
          </div>
        </div>

        {/* Roles marquee */}
        <div className="mt-10 reveal">
          <p className="font-mono text-xs text-muted-foreground mb-3">
            <span className="text-primary">$</span> open to roles such as:
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="flex gap-3 animate-scroll-x w-max">
              {roles.map((r, i) => (
                <span
                  key={i}
                  className="shrink-0 font-mono text-xs px-4 py-2 rounded-full border border-border bg-card hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
