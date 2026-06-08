import { AdminPage } from "@/components/admin/AdminPage";
import { FieldRenderer, FieldDef } from "@/components/admin/RepeatableList";
import type { Portfolio } from "@/data/portfolio";

type Identity = Portfolio["personal"];

const fields: FieldDef[] = [
  { key: "fullName", label: "full name", type: "text" },
  { key: "displayName", label: "display name", type: "text" },
  { key: "pronouns", label: "pronouns", type: "text" },
  { key: "title", label: "job title", type: "text" },
  { key: "tagline", label: "tagline", type: "text" },
  { key: "location", label: "location", type: "text" },
  { key: "email", label: "email", type: "email" },
  { key: "phone", label: "phone", type: "text" },
  { key: "linkedin", label: "linkedin url", type: "url" },
  { key: "github", label: "github url", type: "url" },
  { key: "bio", label: "bio", type: "textarea", rows: 4 },
  { key: "philosophy", label: "philosophy", type: "textarea", rows: 4 },
  { key: "highlights", label: "highlights", type: "tags" },
];

export default function AdminIdentity() {
  return (
    <AdminPage<Identity> title="identity.json" subtitle="who you are" sectionKey="identity">
      {({ draft, setDraft }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" || f.type === "tags" ? "md:col-span-2" : ""}>
              <FieldRenderer
                field={f}
                value={(draft as unknown as Record<string, unknown>)[f.key]}
                onChange={(v) => setDraft({ ...draft, [f.key]: v } as Identity)}
              />
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
