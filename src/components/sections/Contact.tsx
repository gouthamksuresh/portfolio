import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { TerminalWindow } from "@/components/TerminalWindow";
import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";
import { Github, Linkedin, Mail, Phone, Languages as LangIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function Contact() {
  const { data: p } = usePortfolioSection<Portfolio["personal"]>("identity");
  const { data: languages } = usePortfolioSection<Portfolio["languages"]>("languages");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || "Anonymous"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${p.email}?subject=${subject}&body=${body}`;
    toast({ title: "Opening your email client…", description: "Thanks for reaching out!" });
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          command="./contact.sh"
          title="contact"
          caption="Got a role, project, or question? My inbox is open."
        />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 reveal">
            <TerminalWindow title="~/contact.sh">
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
                <div>
                  <label className="flex gap-2 text-muted-foreground mb-1.5">
                    <span className="text-primary">$</span> name:
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Linus Torvalds"
                    className="w-full bg-background/60 border border-border rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="flex gap-2 text-muted-foreground mb-1.5">
                    <span className="text-primary">$</span> email:
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full bg-background/60 border border-border rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="flex gap-2 text-muted-foreground mb-1.5">
                    <span className="text-primary">$</span> message:
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Hey Goutham, we'd love to chat about…"
                    className="w-full bg-background/60 border border-border rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-semibold hover:shadow-[0_0_24px_hsl(var(--terminal-green)/0.5)] transition-shadow"
                >
                  $ send_message --to=goutham
                </button>
              </form>
            </TerminalWindow>
          </div>

          <div className="lg:col-span-2 space-y-4 reveal">
            <a
              href={`mailto:${p.email}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 glow-hover group"
            >
              <Mail className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">email</p>
                <p className="font-mono text-sm truncate group-hover:text-primary transition-colors">{p.email}</p>
              </div>
            </a>

            <a
              href={`tel:${p.phone}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 glow-hover group"
            >
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">phone</p>
                <p className="font-mono text-sm group-hover:text-primary transition-colors">{p.phone}</p>
              </div>
            </a>

            <a
              href={p.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 glow-hover group"
            >
              <Linkedin className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">linkedin</p>
                <p className="font-mono text-sm truncate group-hover:text-primary transition-colors">/in/gouthamksuresh</p>
              </div>
            </a>

            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 glow-hover group"
            >
              <Github className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">github</p>
                <p className="font-mono text-sm truncate group-hover:text-primary transition-colors">/gouthamksuresh</p>
              </div>
            </a>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <LangIcon className="h-4 w-4 text-primary" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">languages</p>
              </div>
              <ul className="space-y-1.5">
                {languages.map((l) => (
                  <li key={l.name} className="flex justify-between font-mono text-xs">
                    <span className="text-foreground">{l.name}</span>
                    <span className="text-muted-foreground">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
