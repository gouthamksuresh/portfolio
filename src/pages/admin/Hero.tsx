import { AdminPage } from "@/components/admin/AdminPage";
import { RepeatableList, FieldDef } from "@/components/admin/RepeatableList";

const fields: FieldDef[] = [
  { key: "cmd", label: "command (typed)", type: "text" },
  { key: "out", label: "output lines", type: "tags" },
];

export default function AdminHero() {
  return (
    <AdminPage<Array<Record<string, unknown>>>
      title="hero.sh"
      subtitle="commands typed in the homepage terminal"
      sectionKey="heroSequence"
    >
      {({ draft, setDraft }) => (
        <RepeatableList
          items={draft}
          onChange={setDraft}
          itemFields={fields}
          itemLabel={(it) => `$ ${it.cmd ?? ""}`}
          newItem={() => ({ cmd: "", out: [] })}
          addLabel="add command"
        />
      )}
    </AdminPage>
  );
}
