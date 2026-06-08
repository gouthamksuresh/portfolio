import { useEffect, useState, useCallback, useRef } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

async function checkAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const refreshAdmin = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s?.user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const admin = await checkAdmin(s.user.id);
      setIsAdmin(admin);
      return admin;
    } catch (error) {
      console.error("Failed to check admin role", error);
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Restore session first, THEN set up listener
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        try {
          const admin = await checkAdmin(s.user.id);
          if (mounted) setIsAdmin(admin);
        } catch (error) {
          console.error("Failed to check admin role", error);
          if (mounted) setIsAdmin(false);
        }
      } else if (mounted) {
        setIsAdmin(false);
      }
      if (mounted) {
        setLoading(false);
        initialized.current = true;
      }
    });

    // Listen for future changes — ignore events until initialized
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!mounted || !initialized.current) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (!s?.user) {
        setIsAdmin(false);
      } else {
        checkAdmin(s.user.id).then((admin) => {
          if (mounted) setIsAdmin(admin);
        }).catch((error) => {
          console.error("Failed to check admin role", error);
          if (mounted) setIsAdmin(false);
        });
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = () => supabase.auth.signOut();
  return { session, user, isAdmin, loading, signOut, refreshAdmin };
}
