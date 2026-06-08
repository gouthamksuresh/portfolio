import { AdminPage } from "@/components/admin/AdminPage";
import { RepeatableList, FieldDef } from "@/components/admin/RepeatableList";

const metricFields: FieldDef[] = [
  { key: "label", label: "label", type: "text" },
  { key: "value", label: "value", type: "number" },
  { key: "suffix", label: "suffix (e.g. %, x)", type: "text" },
];

const fields: FieldDef[] = [
  { key: "title", label: "title", type: "text" },
  { key: "slug", label: "slug", type: "text" },
  { key: "duration", label: "duration", type: "text" },
  { key: "tagline", label: "tagline", type: "text" },
  { key: "description", label: "description", type: "textarea", rows: 4 },
  { key: "github", label: "github url", type: "url" },
  { key: "features", label: "features", type: "tags" },
  { key: "stack", label: "stack", type: "tags" },
  { key: "pipeline", label: "pipeline steps", type: "tags" },
  {
    key: "metrics",
    label: "metrics",
    type: "objectList",
    itemFields: metricFields,
    itemLabel: (m) => `${m.label ?? "<label>"} = ${m.value ?? 0}${m.suffix ?? ""}`,
    newItem: () => ({ label: "", value: 0, suffix: "%" }),
  },
];

export default function AdminProjects() {
  return (
    <AdminPage<Array<Record<string, unknown>>>
      title="projects/"
      subtitle="case studies shown on the public site"
      sectionKey="projects"
    >
      {({ draft, setDraft }) => (
        <RepeatableList
          items={draft}
          onChange={setDraft}
          itemFields={fields}
          itemLabel={(it) => (it.title as string) ?? "<title>"}
          newItem={() => ({
            id: Date.now(),
            title: "",
            slug: "",
            duration: "",
            tagline: "",
            description: "",
            github: "",
            features: [],
            stack: [],
            pipeline: [],
            metrics: [],
          })}
          addLabel="add project"
        />
      )}
    </AdminPage>
  );
}
