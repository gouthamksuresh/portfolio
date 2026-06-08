import { AdminPage } from "@/components/admin/AdminPage";
import { FieldRenderer, FieldDef } from "@/components/admin/RepeatableList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Portfolio } from "@/data/portfolio";

type OTW = Portfolio["openToWork"];

const fields: FieldDef[] = [
  { key: "availability", label: "availability text", type: "text" },
  { key: "workMode", label: "work modes", type: "tags" },
  { key: "roles", label: "open roles", type: "tags" },
];

export default function AdminAvailability() {
  return (
    <AdminPage<OTW> title="availability.json" subtitle="open-to-work flag and roles" sectionKey="openToWork">
      {({ draft, setDraft }) => (
        <div className="space-y-4">
          <div className="flex items-center justify-between border border-border rounded p-3 bg-background/40">
            <div>
              <Label className="text-xs text-foreground">currently open to work</Label>
              <div className="text-[10px] text-muted-foreground">shows the green badge on the public site</div>
            </div>
            <Switch checked={!!draft.status} onCheckedChange={(v) => setDraft({ ...draft, status: v })} />
          </div>
          <div className="flex items-center justify-between border border-border rounded p-3 bg-background/40">
            <div>
              <Label className="text-xs text-foreground">willing to relocate</Label>
            </div>
            <Switch checked={!!draft.relocate} onCheckedChange={(v) => setDraft({ ...draft, relocate: v })} />
          </div>
          {fields.map((f) => (
            <FieldRenderer
              key={f.key}
              field={f}
              value={(draft as unknown as Record<string, unknown>)[f.key]}
              onChange={(v) => setDraft({ ...draft, [f.key]: v } as OTW)}
            />
          ))}
        </div>
      )}
    </AdminPage>
  );
}
