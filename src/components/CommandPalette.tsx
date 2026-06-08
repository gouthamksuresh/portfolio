import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Hash } from "lucide-react";

const commands = [
  { id: "hero", label: "Home / Hero", section: "#hero", type: "section" },
  { id: "about", label: "About", section: "#about", type: "section" },
  { id: "experience", label: "Experience", section: "#experience", type: "section" },
  { id: "projects", label: "Projects", section: "#projects", type: "section" },
  { id: "skills", label: "Skills", section: "#skills", type: "section" },
  { id: "credentials", label: "Education & Certs", section: "#credentials", type: "section" },
  { id: "contact", label: "Contact", section: "#contact", type: "section" },
  { id: "recommendations", label: "Recommendations", section: "/recommendations", type: "page" },
  { id: "resume", label: "Download Resume", section: "resume", type: "action" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback(
    (cmd: (typeof commands)[0]) => {
      setOpen(false);
      setQuery("");
      if (cmd.type === "page") {
        navigate(cmd.section);
      } else if (cmd.type === "action" && cmd.id === "resume") {
        // Trigger resume download
        const a = document.createElement("a");
        a.href = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/resumes/resume.pdf`;
        a.download = "Goutham_K_Suresh_Resume.pdf";
        a.click();
      } else {
        const el = document.querySelector(cmd.section);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [navigate]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && filtered[selected]) {
        execute(filtered[selected]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, filtered, execute]);

  useEffect(() => setSelected(0), [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden animate-fade-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6 font-mono">
              No results found.
            </p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => execute(cmd)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors ${
                  i === selected
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted/50"
                }`}
              >
                <Hash className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                <span className="flex-1 text-left">{cmd.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
