import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, MapPin, ArrowDown, Volume2, VolumeX, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TerminalWindow } from "@/components/TerminalWindow";
import { NetworkParticles } from "@/components/NetworkParticles";
import { usePortfolioSection } from "@/lib/portfolioStore";
import { useTypingSound } from "@/hooks/useTypingSound";
import type { Portfolio } from "@/data/portfolio";

type SeqStep = { cmd: string; out: string[] };

function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`whitespace-pre-wrap break-words ${className}`}>{children}</div>;
}

function HeroTerminal() {
  const { data: sequence } = usePortfolioSection<SeqStep[]>("heroSequence");
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const { click, muted, toggle } = useTypingSound();

  useEffect(() => {
    if (!sequence || sequence.length === 0) return;
    if (step >= sequence.length) {
      const restart = setTimeout(() => {
        setStep(0);
        setTyped("");
      }, 6000);
      return () => clearTimeout(restart);
    }
    const cmd = sequence[step].cmd;
    const soundEnabled = cmd.trim().toLowerCase().includes("whoami");
    setTyped("");
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(cmd.slice(0, i));
      if (soundEnabled) click();
      if (i >= cmd.length) {
        clearInterval(typer);
        setTimeout(() => setStep((s) => s + 1), 900);
      }
    }, 45);
    return () => clearInterval(typer);
  }, [step, sequence, click]);

  const completed = (sequence ?? []).slice(0, step);

  const renderBlock = (s: SeqStep, idx: number) => (
    <div key={idx} className="space-y-1">
      <Line>
        <span className="text-terminal-green">➜</span>{" "}
        <span className="text-terminal-cyan">~/goutham</span>{" "}
        <span className="text-foreground">{s.cmd}</span>
      </Line>
      {s.out.map((o, j) => (
        <Line key={j} className="text-muted-foreground pl-4">
          {o}
        </Line>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <TerminalWindow glow>
        <div className="relative">
          <div className="invisible space-y-1.5" aria-hidden="true">
            {(sequence ?? []).map((s, idx) => renderBlock(s, idx))}
            <Line>&nbsp;</Line>
          </div>
          <div className="absolute inset-0 space-y-1.5">
            {completed.map((s, idx) => renderBlock(s, idx))}
            {sequence && step < sequence.length && (
              <Line>
                <span className="text-terminal-green">➜</span>{" "}
                <span className="text-terminal-cyan">~/goutham</span>{" "}
                <span className="text-foreground">{typed}</span>
                <span className="cursor-blink" />
              </Line>
            )}
          </div>
        </div>
      </TerminalWindow>
      {/* Sound toggle */}
      <button
        onClick={toggle}
        className="absolute top-2 right-2 z-10 h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-primary transition-colors bg-background/50"
        aria-label={muted ? "Unmute typing sound" : "Mute typing sound"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function HeroBackground() {
  return <NetworkParticles />;
}

export function Hero() {
  const { data: p } = usePortfolioSection<Portfolio["personal"]>("identity");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  useEffect(() => {
    const url = supabase.storage.from("resumes").getPublicUrl("resume.pdf").data.publicUrl;
    fetch(url, { method: "HEAD" })
      .then((r) => { if (r.ok) setResumeUrl(url); })
      .catch(() => {});
  }, []);
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-20 flex items-center">
      <HeroBackground />
      <div className="container grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-xs text-primary">OPEN TO WORK · IMMEDIATELY AVAILABLE</span>
          </div>

          <p className="bracket-label mb-3">{p.title}</p>

          <h1 className="font-mono font-extrabold text-3xl sm:text-4xl md:text-5xl xl:text-7xl leading-[1.05] tracking-tight break-words">
            {(() => {
              const parts = (p.displayName || p.fullName || "").split(" ");
              const last = parts.pop() ?? "";
              const first = parts.join(" ");
              return (
                <>
                  <span className="block">{first}</span>
                  <span className="block">
                    <span className="text-primary text-glow">{last}</span>
                    <span className="cursor-blink" />
                  </span>
                </>
              );
            })()}
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {p.bio}
          </p>

          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> {p.location}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_hsl(var(--terminal-green)/0.4)]"
            >
              ./view_projects
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                download="Goutham_K_Suresh_Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-terminal-cyan/40 text-terminal-cyan hover:border-terminal-cyan hover:bg-terminal-cyan/10 font-mono text-sm transition-colors"
                title="Download my resume/CV"
              >
                <Download className="h-3.5 w-3.5" /> ./download_cv
              </a>
            )}
            <div className="flex items-center gap-2">
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="h-10 w-10 grid place-items-center rounded-md border border-border hover:border-primary/60 hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={p.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-10 grid place-items-center rounded-md border border-border hover:border-primary/60 hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${p.email}`}
                aria-label="Email"
                className="h-10 w-10 grid place-items-center rounded-md border border-border hover:border-primary/60 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="reveal">
          <HeroTerminal />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
      >
        <ArrowDown className="h-5 w-5" />
      </a>
    </section>
  );
}
