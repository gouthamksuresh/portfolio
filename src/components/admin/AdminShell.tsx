import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  FolderGit2,
  Code2,
  GraduationCap,
  Award,
  Languages,
  Terminal,
  CircleCheck,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  Users as UsersIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/goth", icon: LayoutDashboard, label: "dashboard.sh", end: true },
  { to: "/goth/identity", icon: User, label: "identity.json" },
  { to: "/goth/availability", icon: CircleCheck, label: "availability.json" },
  { to: "/goth/experience", icon: Briefcase, label: "experience.log" },
  { to: "/goth/projects", icon: FolderGit2, label: "projects/" },
  { to: "/goth/skills", icon: Code2, label: "skills.yaml" },
  { to: "/goth/education", icon: GraduationCap, label: "education.md" },
  { to: "/goth/certifications", icon: Award, label: "certs.md" },
  { to: "/goth/languages", icon: Languages, label: "languages.md" },
  { to: "/goth/hero", icon: Terminal, label: "hero.sh" },
  { to: "/goth/users", icon: UsersIcon, label: "users.db" },
];

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-background text-foreground font-mono">
      <aside className="w-60 border-r border-border bg-card/50 flex flex-col">
        <div className="px-4 py-5 border-b border-border">
          <Link to="/" className="text-terminal-green text-lg font-bold tracking-tight">
            ~/control
          </Link>
          <div className="text-[10px] text-muted-foreground mt-1">portfolio control</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-xs border-l-2 transition-colors ${
                  isActive
                    ? "border-terminal-green bg-terminal-green/5 text-terminal-green"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`
              }
            >
              <it.icon className="h-3.5 w-3.5" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3 text-[10px] text-muted-foreground truncate">
          {user?.email}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-border flex items-center justify-between px-4">
          <div className="text-xs text-muted-foreground">
            <span className="text-terminal-green">$</span> {title}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" target="_blank" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" /> view site
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/goth/login");
              }}
              className="text-xs"
            >
              <LogOut className="h-3 w-3 mr-1" /> exit
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
