import { AdminPage } from "@/components/admin/AdminPage";
import { RepeatableList, FieldDef } from "@/components/admin/RepeatableList";

const fields: FieldDef[] = [
  { key: "role", label: "role", type: "text" },
  { key: "company", label: "company", type: "text" },
  { key: "type", label: "type (e.g. Internship · Remote)", type: "text" },
  { key: "duration", label: "duration", type: "text" },
  { key: "commit", label: "commit hash", type: "text" },
  { key: "branch", label: "branch", type: "text" },
  { key: "description", label: "description", type: "textarea", rows: 3 },
  { key: "bullets", label: "bullets", type: "tags" },
  { key: "stack", label: "stack", type: "tags" },
];

export default function AdminExperience() {
  return (
    <AdminPage<Array<Record<string, unknown>>>
      title="experience.log"
      subtitle="git log of your work history"
      sectionKey="experience"
    >
      {({ draft, setDraft }) => (
        <RepeatableList
          items={draft}
          onChange={setDraft}
          itemFields={fields}
          itemLabel={(it) => `${it.role ?? "<role>"} @ ${it.company ?? "<company>"}`}
          newItem={() => ({
            id: Date.now(),
            role: "",
            company: "",
            type: "",
            duration: "",
            commit: "",
            branch: "",
            description: "",
            bullets: [],
            stack: [],
          })}
          addLabel="add experience"
        />
      )}
    </AdminPage>
  );
}
