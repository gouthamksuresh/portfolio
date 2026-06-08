import { SectionHeader } from "@/components/SectionHeader";
import { TerminalWindow } from "@/components/TerminalWindow";
import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";
import { Sparkles } from "lucide-react";

export function About() {
  const { data: p } = usePortfolioSection<Portfolio["personal"]>("identity");
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader command="cat about.md" title="about" caption="Who I am, what I build, and how I think about the work." />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 reveal">
            <TerminalWindow title="~/about.md">
              <div className="space-y-4 text-foreground/90 font-sans text-base leading-relaxed">
                <p>
                  Hi — I'm <span className="text-primary font-semibold">Goutham</span>. A self-taught{" "}
                  <span className="text-terminal-cyan">DevOps & Cloud Engineer</span> who genuinely enjoys the
                  craft of automating the boring stuff and shipping software that just works.
                </p>
                <p>
                  I started by setting up labs at home — breaking Docker images, debugging Kubernetes
                  manifests, and learning Jenkins one failed pipeline at a time. That practice translated
                  into real-world internships at <span className="text-primary">Elevate Labs</span> and{" "}
                  <span className="text-primary">Prinston Smart Engineers</span>.
                </p>
                <p>
                  Right now I'm focused on CI/CD reliability, container orchestration, and the cloud platforms
                  that make modern engineering teams move fast without breaking things.
                </p>
              </div>
            </TerminalWindow>

            <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5 reveal">
              <div className="flex gap-3 items-start">
                <span className="font-mono text-primary text-xl leading-none mt-0.5">&gt;</span>
                <div>
                  <p className="font-mono text-xs text-primary mb-2">// philosophy</p>
                  <p className="text-foreground/90 italic leading-relaxed">"{p.philosophy}"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 reveal">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-mono text-sm uppercase tracking-widest text-primary">Highlights</h3>
              </div>
              <ul className="space-y-3">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/90 group">
                    <span className="font-mono text-primary mt-0.5 group-hover:text-glow transition-all">▸</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "Years learning", v: "3+" },
                { k: "Internships", v: "2" },
                { k: "Projects", v: "5+" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-lg border border-border bg-card p-4 text-center glow-hover"
                >
                  <div className="font-mono text-2xl text-primary font-bold">{s.v}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
