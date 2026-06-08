import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { usePortfolioSection } from "@/lib/portfolioStore";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, Eye, Clock } from "lucide-react";

const cards = [
  { to: "/goth/identity", title: "identity.json", desc: "name · title · bio · contact" },
  { to: "/goth/availability", title: "availability.json", desc: "open-to-work · roles · modes" },
  { to: "/goth/experience", title: "experience.log", desc: "internships & jobs" },
  { to: "/goth/projects", title: "projects/", desc: "portfolio case studies" },
  { to: "/goth/skills", title: "skills.yaml", desc: "categories & chips" },
  { to: "/goth/education", title: "education.md", desc: "schools & degrees" },
  { to: "/goth/certifications", title: "certs.md", desc: "badges & courses" },
  { to: "/goth/languages", title: "languages.md", desc: "spoken languages" },
  { to: "/goth/hero", title: "hero.sh", desc: "homepage terminal sequence" },
  { to: "/goth/resume", title: "resume.pdf", desc: "upload & manage CV" },
  { to: "/goth/recommendations", title: "recommendations/", desc: "referral links & tools" },
];

function AnalyticsPanel() {
  const [visitors, setVisitors] = useState<number>(0);

  useEffect(() => {
    supabase
      .from("visitor_counts")
      .select("count")
      .single()
      .then(({ data }) => {
        if (data) setVisitors(data.count);
      });
  }, []);

  const stats = [
    { icon: Eye, label: "Total Visitors", value: visitors.toLocaleString(), color: "text-terminal-green" },
    { icon: Users, label: "Analytics", value: "PostHog", color: "text-terminal-cyan" },
    { icon: BarChart3, label: "Tracking", value: "Active", color: "text-terminal-amber" },
    { icon: Clock, label: "Uptime", value: "24/7", color: "text-terminal-magenta" },
  ];

  return (
    <div className="mb-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
        <span className="text-terminal-green">$</span> analytics --overview
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-border rounded bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <div className={`text-xl font-mono font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground mt-2">
        Full analytics available at your PostHog dashboard. Events: pageviews, clicks, scroll depth.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const exp = usePortfolioSection<unknown[]>("experience");
  const proj = usePortfolioSection<unknown[]>("projects");
  const certs = usePortfolioSection<unknown[]>("certifications");
  return (
    <AdminShell title="dashboard.sh">
      <AnalyticsPanel />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="experiences" value={Array.isArray(exp.data) ? exp.data.length : 0} />
        <Stat label="projects" value={Array.isArray(proj.data) ? proj.data.length : 0} />
        <Stat label="certifications" value={Array.isArray(certs.data) ? certs.data.length : 0} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="border border-border rounded bg-card hover:border-terminal-green/60 hover:bg-terminal-green/5 transition-colors p-4 group"
          >
            <div className="text-sm text-terminal-green group-hover:text-terminal-green">{c.title}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{c.desc}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-mono text-terminal-green mt-1">{value}</div>
    </div>
  );
}
