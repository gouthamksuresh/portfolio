import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-muted-foreground">
        $ loading session…
      </div>
    );
  }
  if (!user) return <Navigate to="/goth/login" replace />;
  if (!isAdmin) return <Navigate to="/goth/login?denied=1" replace />;
  return <>{children}</>;
}
