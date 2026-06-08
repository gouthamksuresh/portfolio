import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal } from "lucide-react";

type OutputLine = { text: string; className?: string };

const COMMANDS: Record<string, (args: string) => OutputLine[]> = {
  help: () => [
    { text: "Available commands:", className: "text-primary" },
    { text: "  help          — show this help" },
    { text: "  whoami        — about me" },
    { text: "  ls            — list sections" },
    { text: "  date          — current date" },
    { text: "  skills        — tech stack" },
    { text: "  sudo hire goutham — 😏" },
    { text: "  matrix        — take the red pill" },
    { text: "  neofetch      — system info" },
    { text: "  clear         — clear terminal" },
  ],
  whoami: () => [
    { text: "Goutham K Suresh", className: "text-primary font-bold" },
    { text: "Cloud & DevOps Engineer | Full-Stack Developer" },
    { text: "Location: Kochi, India 🇮🇳" },
  ],
  ls: () => [
    { text: "drwxr-xr-x  about/", className: "text-terminal-cyan" },
    { text: "drwxr-xr-x  experience/", className: "text-terminal-cyan" },
    { text: "drwxr-xr-x  projects/", className: "text-terminal-cyan" },
    { text: "drwxr-xr-x  skills/", className: "text-terminal-cyan" },
    { text: "drwxr-xr-x  credentials/", className: "text-terminal-cyan" },
    { text: "-rw-r--r--  contact.sh", className: "text-terminal-green" },
    { text: "-rw-r--r--  resume.pdf", className: "text-foreground" },
  ],
  date: () => [{ text: new Date().toString(), className: "text-terminal-yellow" }],
  skills: () => [
    { text: "☁️  AWS · Azure · GCP · Terraform · Kubernetes" },
    { text: "🐳  Docker · CI/CD · GitHub Actions · Jenkins" },
    { text: "⚛️  React · TypeScript · Node.js · Python" },
    { text: "🗄️  PostgreSQL · MongoDB · Redis · Supabase" },
  ],
  matrix: () => [
    { text: "Wake up, Neo...", className: "text-terminal-green" },
    { text: "The Matrix has you...", className: "text-terminal-green" },
    { text: "Follow the white rabbit. 🐇", className: "text-terminal-green" },
    { text: "" },
    { text: "01001000 01101001 01110010 01100101", className: "text-primary/60" },
    { text: "01000111 01101111 01110101 01110100", className: "text-primary/60" },
    { text: "01101000 01100001 01101101", className: "text-primary/60" },
  ],
  neofetch: () => [
    { text: "  ╔══════════════════════╗", className: "text-primary" },
    { text: "  ║   goutham@portfolio  ║", className: "text-primary" },
    { text: "  ╠══════════════════════╣", className: "text-primary" },
    { text: "  ║ OS: React 18 + Vite  ║", className: "text-terminal-cyan" },
    { text: "  ║ UI: Tailwind CSS v3  ║", className: "text-terminal-cyan" },
    { text: "  ║ Lang: TypeScript 5   ║", className: "text-terminal-cyan" },
    { text: "  ║ Cloud: AWS + Supabase║", className: "text-terminal-cyan" },
    { text: "  ║ Uptime: ∞            ║", className: "text-terminal-cyan" },
    { text: "  ╚══════════════════════╝", className: "text-primary" },
  ],
};

function handleCommand(raw: string): OutputLine[] | "CLEAR" {
  const input = raw.trim().toLowerCase();
  if (!input) return [];
  if (input === "clear") return "CLEAR";
  if (input === "sudo hire goutham" || input === "sudo hire") {
    return [
      { text: "[sudo] password for recruiter: ********", className: "text-muted-foreground" },
      { text: "✅ Access granted!", className: "text-terminal-green font-bold" },
      { text: "Redirecting to contact form... 🚀", className: "text-terminal-cyan" },
    ];
  }
  const cmd = input.split(" ")[0];
  if (COMMANDS[cmd]) return COMMANDS[cmd](input);
  return [
    { text: `bash: ${cmd}: command not found`, className: "text-terminal-red" },
    { text: 'Type "help" for available commands.', className: "text-muted-foreground" },
  ];
}

export function TerminalEasterEgg() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<OutputLine[]>([
    { text: "Welcome to goutham.sh — type 'help' to get started", className: "text-primary" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const submit = useCallback(() => {
    if (!input.trim()) return;
    const result = handleCommand(input);
    setCmdHistory((h) => [...h, input]);
    setHistIdx(-1);
    if (result === "CLEAR") {
      setHistory([]);
    } else {
      setHistory((h) => [
        ...h,
        { text: `$ ${input}`, className: "text-foreground" },
        ...result,
      ]);
      // Navigate to contact on "sudo hire"
      if (input.trim().toLowerCase().startsWith("sudo hire")) {
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 1200);
      }
    }
    setInput("");
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIdx = histIdx < cmdHistory.length - 1 ? histIdx + 1 : histIdx;
      setHistIdx(newIdx);
      setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx <= 0) { setHistIdx(-1); setInput(""); return; }
      const newIdx = histIdx - 1;
      setHistIdx(newIdx);
      setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-md border border-border hover:border-primary/60 hover:text-primary transition-colors"
        title="Open interactive terminal"
      >
        <Terminal className="h-3.5 w-3.5" /> ./easter_egg
      </button>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-lg border border-primary/30 bg-background/95 backdrop-blur overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-card border-b border-border">
        <div className="flex gap-1.5">
          <button onClick={() => setOpen(false)} className="h-3 w-3 rounded-full bg-terminal-red hover:brightness-125 transition" title="Close" />
          <span className="h-3 w-3 rounded-full bg-terminal-yellow" />
          <span className="h-3 w-3 rounded-full bg-terminal-green" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground ml-2">goutham.sh — interactive terminal</span>
      </div>
      {/* Output */}
      <div ref={scrollRef} className="p-3 h-48 overflow-y-auto space-y-0.5 font-mono text-xs">
        {history.map((line, i) => (
          <div key={i} className={line.className || "text-muted-foreground"}>
            {line.text}
          </div>
        ))}
      </div>
      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
        <span className="text-primary font-mono text-xs">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
