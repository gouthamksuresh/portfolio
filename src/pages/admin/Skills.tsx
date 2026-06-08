import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { TagListEditor } from "@/components/admin/TagListEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Skills = Record<string, string[]>;

export default function AdminSkills() {
  return (
    <AdminPage<Skills> title="skills.yaml" subtitle="categories and chips" sectionKey="skills">
      {({ draft, setDraft }) => <Editor draft={draft} setDraft={setDraft} />}
    </AdminPage>
  );
}

function Editor({ draft, setDraft }: { draft: Skills; setDraft: (n: Skills) => void }) {
  const [newCat, setNewCat] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const addCat = () => {
    const name = newCat.trim();
    if (!name || draft[name]) return;
    setDraft({ ...draft, [name]: [] });
    setNewCat("");
  };

  const deleteCat = (cat: string) => {
    const next = { ...draft };
    delete next[cat];
    setDraft(next);
  };

  const renameCat = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName || draft[trimmed]) {
      setRenaming(null);
      return;
    }
    const entries = Object.entries(draft).map(([k, v]) => (k === oldName ? [trimmed, v] : [k, v]));
    setDraft(Object.fromEntries(entries));
    setRenaming(null);
  };

  return (
    <div className="space-y-3">
      {Object.entries(draft).map(([cat, items]) => (
        <div key={cat} className="border border-border rounded bg-background/40 p-3">
          <div className="flex items-center justify-between mb-2">
            {renaming === cat ? (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") renameCat(cat, renameValue);
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  className="h-7 text-sm font-mono"
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => renameCat(cat, renameValue)}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setRenaming(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <Label className="text-xs text-terminal-green">{cat}</Label>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => {
                      setRenaming(cat);
                      setRenameValue(cat);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => deleteCat(cat)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
          <TagListEditor values={items} onChange={(v) => setDraft({ ...draft, [cat]: v })} />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <Input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCat()}
          placeholder="new category…"
          className="h-9 text-sm font-mono bg-background/50"
        />
        <Button onClick={addCat} variant="outline" size="sm">
          <Plus className="h-3 w-3 mr-1" /> add category
        </Button>
      </div>
    </div>
  );
}
