import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { defaults, SectionKey, usePortfolioSection, useUpdateSection } from "@/lib/portfolioStore";

export function useEditableSection<T>(key: SectionKey) {
  const { data, isLoading } = usePortfolioSection<T>(key);
  const update = useUpdateSection(key);
  const [draft, setDraft] = useState<T | null>(null);

  useEffect(() => {
    if (!isLoading && data && draft === null) setDraft(data);
  }, [data, isLoading, draft]);

  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(data);
  const save = async () => {
    if (!draft) return;
    try {
      await update.mutateAsync(draft);
      toast.success("saved.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const reset = () => {
    setDraft(defaults[key] as T);
    toast.message("reset to defaults — click save to persist.");
  };
  return { draft, setDraft, dirty, save, reset, saving: update.isPending, isLoading };
}

export function AdminPage<T>({
  title,
  subtitle,
  sectionKey,
  children,
}: {
  title: string;
  subtitle?: string;
  sectionKey: SectionKey;
  children: (state: {
    draft: T;
    setDraft: (next: T) => void;
  }) => React.ReactNode;
}) {
  const ctrl = useEditableSection<T>(sectionKey);
  return (
    <AdminShell title={title}>
      <SectionEditor
        title={title}
        subtitle={subtitle}
        dirty={ctrl.dirty}
        saving={ctrl.saving}
        onSave={ctrl.save}
        onReset={ctrl.reset}
      >
        {ctrl.draft === null ? (
          <div className="text-xs text-muted-foreground">$ loading…</div>
        ) : (
          children({ draft: ctrl.draft, setDraft: (n) => ctrl.setDraft(n) })
        )}
      </SectionEditor>
    </AdminShell>
  );
}
