import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ShieldCheck } from "lucide-react";

interface Row {
  id: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [newId, setNewId] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("user_roles").select("*").order("created_at");
    if (error) toast.error(error.message);
    else setRows(data as Row[]);
  };

  useEffect(() => {
    load();
  }, []);

  const grant = async () => {
    const id = newId.trim();
    if (!id) return;
    setBusy(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: id, role: "admin" });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("admin granted.");
      setNewId("");
      load();
    }
  };

  const revoke = async (row: Row) => {
    if (row.user_id === user?.id) {
      toast.error("can't revoke your own admin role.");
      return;
    }
    const { error } = await supabase.from("user_roles").delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else {
      toast.success("revoked.");
      load();
    }
  };

  return (
    <AdminShell title="users.db">
      <SectionEditor title="users.db" subtitle="who can edit this portfolio">
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between border border-border rounded p-2 bg-background/40">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-terminal-green" />
                <span className="font-mono">{r.user_id}</span>
                <span className="text-muted-foreground">[{r.role}]</span>
                {r.user_id === user?.id && (
                  <span className="text-[10px] text-cyan-400 ml-1">(you)</span>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => revoke(r)}
                disabled={r.user_id === user?.id}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2 pt-3 border-t border-border">
            <Input
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="user uuid (have them sign up first)…"
              className="h-9 text-xs font-mono bg-background/50"
            />
            <Button onClick={grant} disabled={busy} size="sm" variant="outline">
              <Plus className="h-3 w-3 mr-1" /> grant admin
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground pt-2">
            users sign up on /admin/login. paste their uuid here to promote them. their uuid is shown on the login screen after sign-in.
          </p>
        </div>
      </SectionEditor>
    </AdminShell>
  );
}
