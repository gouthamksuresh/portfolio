import { AdminPage } from "@/components/admin/AdminPage";
import { RepeatableList, FieldDef } from "@/components/admin/RepeatableList";

const fields: FieldDef[] = [
  { key: "degree", label: "degree", type: "text" },
  { key: "specialization", label: "specialization", type: "text" },
  { key: "institution", label: "institution", type: "text" },
  { key: "location", label: "location", type: "text" },
  { key: "duration", label: "duration", type: "text" },
  { key: "status", label: "status", type: "text" },
  { key: "focus", label: "focus areas", type: "tags" },
];

export default function AdminEducation() {
  return (
    <AdminPage<Array<Record<string, unknown>>>
      title="education.md"
      subtitle="schools and degrees"
      sectionKey="education"
    >
      {({ draft, setDraft }) => (
        <RepeatableList
          items={draft}
          onChange={setDraft}
          itemFields={fields}
          itemLabel={(it) => `${it.degree ?? "<degree>"} — ${it.institution ?? ""}`}
          newItem={() => ({
            degree: "",
            specialization: "",
            institution: "",
            location: "",
            duration: "",
            status: "",
            focus: [],
          })}
          addLabel="add education"
        />
      )}
    </AdminPage>
  );
}
