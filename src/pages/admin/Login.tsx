import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Terminal } from "lucide-react";

export default function AdminLogin() {
  const { user, isAdmin, loading, refreshAdmin } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/goth", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (search.get("denied")) toast.error("not an admin. ask the owner to grant access.");
  }, [search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/goth`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast.success("account created. you are signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const claim = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("claim-first-admin");
      if (error) throw error;
      if (data?.claimed) {
        toast.success("admin role claimed.");
        await refreshAdmin();
        navigate("/goth", { replace: true });
      } else {
        toast.error("an admin already exists.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="text-xs text-muted-foreground hover:text-terminal-green">
          ← back to site
        </Link>
        <div className="mt-3 border border-border rounded-md bg-card overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-terminal-green" />
            <span className="text-xs text-terminal-green">./auth.sh --{mode}</span>
          </div>
          <form onSubmit={submit} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 font-mono text-sm bg-background/50"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">password</Label>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 font-mono text-sm bg-background/50"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-terminal-green text-background hover:bg-terminal-green/90 text-xs"
            >
              {busy && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              $ {mode === "login" ? "sign in" : "create account"}
            </Button>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="hover:text-terminal-green underline-offset-2 hover:underline"
              >
                {mode === "login" ? "no account? sign up" : "have an account? sign in"}
              </button>
            </div>
            {user && !isAdmin && (
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-[11px] text-terminal-green">
                  ✓ signed in as {user.email}
                </p>
                <Button
                  type="button"
                  onClick={claim}
                  disabled={busy}
                  className="w-full bg-cyan-500 text-background hover:bg-cyan-400 text-xs"
                >
                  {busy && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  $ claim first admin →
                </Button>
                <p className="text-[10px] text-muted-foreground">
                  click above to take ownership of this portfolio
                </p>
              </div>
            )}
            {!user && (
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-2 border-t border-border">
                <span className="text-terminal-green">tip:</span> first time? sign up, then click{" "}
                <span className="text-cyan-400">claim first admin</span> to take ownership of this portfolio.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
