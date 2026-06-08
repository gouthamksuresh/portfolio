import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const tabs = [
  { id: "hero", label: "hero.tsx" },
  { id: "about", label: "about.md" },
  { id: "experience", label: "experience.log" },
  { id: "projects", label: "projects/" },
  { id: "skills", label: "skills.yml" },
  { id: "credentials", label: "credentials/" },
  { id: "contact", label: "contact.sh" },
];

export function Nav() {
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Update sliding indicator position
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || isMobile) return;
    const activeEl = nav.querySelector(`[data-tab="${active}"]`) as HTMLElement | null;
    if (activeEl) {
      const navRect = nav.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    }
  }, [active, isMobile]);

  // Close mobile menu on nav
  const handleMobileNav = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border/60"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-14">
        <a href="#hero" className="font-mono font-bold text-sm flex items-center gap-2 group">
          <span className="text-primary">$</span>
          <span className="group-hover:text-primary transition-colors">goutham.sh</span>
          <span className="cursor-blink" />
        </a>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-1 font-mono text-xs relative">
          <div
            className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_hsl(var(--terminal-green)/0.6)]"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {tabs.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              data-tab={t.id}
              className={cn(
                "px-3 py-1.5 rounded-md transition-all border border-transparent",
                active === t.id
                  ? "text-primary border-primary/40 bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {t.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/goth"
              className="hidden sm:inline-flex items-center gap-1 font-mono text-xs px-3 py-1.5 rounded-md border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400 hover:text-background transition-colors"
            >
              ~/control
            </Link>
          )}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-md border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            ./hire_me
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg animate-fade-in">
          <nav className="container py-3 space-y-1 font-mono text-sm">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleMobileNav(t.id)}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-md transition-colors",
                  active === t.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {t.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border flex gap-2">
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2 rounded-md border border-primary/50 text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                ./hire_me
              </a>
              {isAdmin && (
                <Link
                  to="/goth"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-3 py-2 rounded-md border border-cyan-400/40 text-cyan-400 text-xs hover:bg-cyan-400 hover:text-background transition-colors"
                >
                  ~/control
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
