import { AdminPage } from "@/components/admin/AdminPage";
import { RepeatableList, FieldDef } from "@/components/admin/RepeatableList";

const fields: FieldDef[] = [
  { key: "name", label: "language", type: "text" },
  { key: "level", label: "proficiency", type: "text" },
];

export default function AdminLanguages() {
  return (
    <AdminPage<Array<Record<string, unknown>>>
      title="languages.md"
      subtitle="spoken languages"
      sectionKey="languages"
    >
      {({ draft, setDraft }) => (
        <RepeatableList
          items={draft}
          onChange={setDraft}
          itemFields={fields}
          itemLabel={(it) => `${it.name ?? "<name>"} — ${it.level ?? ""}`}
          newItem={() => ({ name: "", level: "" })}
          addLabel="add language"
        />
      )}
    </AdminPage>
  );
}
