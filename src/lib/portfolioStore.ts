import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { portfolio } from "@/data/portfolio";

export type SectionKey =
  | "identity"
  | "openToWork"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "languages"
  | "heroSequence";

export const defaults: Record<SectionKey, unknown> = {
  identity: portfolio.personal,
  openToWork: portfolio.openToWork,
  experience: portfolio.experience,
  projects: portfolio.projects,
  skills: portfolio.skills,
  education: portfolio.education,
  certifications: portfolio.certifications,
  languages: portfolio.languages,
  heroSequence: [
    { cmd: "whoami", out: ["goutham — cloud & devops engineer (self-taught, ship-first)"] },
    {
      cmd: "cat about.txt",
      out: [
        "→ BCA in AI · Bengaluru North University",
        "→ Internships @ Elevate Labs, Prinston Smart Engineers",
        "→ Lives in containers, breathes pipelines",
      ],
    },
    {
      cmd: "kubectl get skills -n production",
      out: [
        "NAME              READY   STATUS    AGE",
        "docker            1/1     Running   3y",
        "kubernetes        1/1     Running   2y",
        "jenkins           1/1     Running   1y",
        "github-actions    1/1     Running   1y",
        "aws · gcp         1/1     Running   1y",
      ],
    },
    { cmd: "echo $STATUS", out: ["✔ open to work — ready to ship"] },
  ],
};

export function usePortfolioSection<T = unknown>(key: SectionKey) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["portfolio", key],
    queryFn: async (): Promise<T> => {
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("data")
        .eq("section", key)
        .maybeSingle();
      if (error) throw error;
      return ((data?.data as T) ?? (defaults[key] as T)) as T;
    },
  });

  useEffect(() => {
    const channelName = `portfolio:${key}:${crypto.randomUUID()}`;
    const ch = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio_content", filter: `section=eq.${key}` },
        () => qc.invalidateQueries({ queryKey: ["portfolio", key] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [key, qc]);

  return { ...q, data: (q.data ?? (defaults[key] as T)) as T };
}

export function useUpdateSection(key: SectionKey) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const { error } = await supabase
        .from("portfolio_content")
        .upsert({ section: key, data: data as never }, { onConflict: "section" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio", key] }),
  });
}
