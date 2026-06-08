import { Heart, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { VisitorCounter } from "@/components/VisitorCounter";
import { TerminalEasterEgg } from "@/components/TerminalEasterEgg";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 mt-10">
      <div className="container py-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="font-mono text-xs text-muted-foreground space-y-2">
            <pre className="text-primary text-[10px] leading-tight hidden sm:block">
{`  ____             _   _                  
 / ___| ___  _   _| |_| |__   __ _ _ __ ___
| |  _ / _ \\| | | | __| '_ \\ / _\` | '_ \` _ \\
| |_| | (_) | |_| | |_| | | | (_| | | | | | |
 \\____|\\___/ \\__,_|\\__|_| |_|\\__,_|_| |_| |_|`}
            </pre>
            <p className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary">$</span> echo "© {year} Goutham K Suresh — built with"{" "}
              <Heart className="h-3 w-3 fill-terminal-red text-terminal-red" /> "and React + Tailwind"
            </p>
            <VisitorCounter />
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              to="/recommendations"
              className="font-mono text-xs px-4 py-2 rounded-md border border-border hover:border-primary/60 hover:text-primary transition-colors"
            >
              ./recommendations
            </Link>
            <a
              href="#hero"
              className="font-mono text-xs px-4 py-2 rounded-md border border-border hover:border-primary/60 hover:text-primary transition-colors"
            >
              ↑ back_to_top
            </a>
          </div>
        </div>
        {/* Interactive Terminal Easter Egg */}
        <div className="flex justify-center">
          <TerminalEasterEgg />
        </div>
      </div>
    </footer>
  );
}
