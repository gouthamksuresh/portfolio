import { AdminPage } from "@/components/admin/AdminPage";
import { RepeatableList, FieldDef } from "@/components/admin/RepeatableList";

const fields: FieldDef[] = [
  { key: "title", label: "title", type: "text" },
  { key: "issuer", label: "issuer", type: "text" },
  { key: "date", label: "date", type: "text" },
  { key: "credentialId", label: "credential id", type: "text" },
  { key: "tags", label: "tags", type: "tags" },
];

export default function AdminCertifications() {
  return (
    <AdminPage<Array<Record<string, unknown>>>
      title="certs.md"
      subtitle="badges, courses, simulations"
      sectionKey="certifications"
    >
      {({ draft, setDraft }) => (
        <RepeatableList
          items={draft}
          onChange={setDraft}
          itemFields={fields}
          itemLabel={(it) => `${it.title ?? "<title>"} — ${it.issuer ?? ""}`}
          newItem={() => ({ title: "", issuer: "", date: "", credentialId: "", tags: [] })}
          addLabel="add certification"
        />
      )}
    </AdminPage>
  );
}
