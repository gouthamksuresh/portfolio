import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagListEditor } from "./TagListEditor";

export type FieldDef =
  | { key: string; label: string; type: "text" | "url" | "email" }
  | { key: string; label: string; type: "textarea"; rows?: number }
  | { key: string; label: string; type: "tags" }
  | { key: string; label: string; type: "number" }
  | {
      key: string;
      label: string;
      type: "objectList";
      itemFields: FieldDef[];
      itemLabel: (item: Record<string, unknown>, idx: number) => string;
      newItem: () => Record<string, unknown>;
    };

export interface RepeatableListProps {
  items: Array<Record<string, unknown>>;
  onChange: (next: Array<Record<string, unknown>>) => void;
  itemFields: FieldDef[];
  itemLabel: (item: Record<string, unknown>, idx: number) => string;
  newItem: () => Record<string, unknown>;
  addLabel?: string;
}

function setIn(obj: Record<string, unknown>, key: string, value: unknown) {
  return { ...obj, [key]: value };
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "text" || field.type === "url" || field.type === "email") {
    return (
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">{field.label}</Label>
        <Input
          type={field.type === "email" ? "email" : "text"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 text-sm font-mono bg-background/50"
        />
      </div>
    );
  }
  if (field.type === "number") {
    return (
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">{field.label}</Label>
        <Input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9 text-sm font-mono bg-background/50"
        />
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">{field.label}</Label>
        <Textarea
          value={(value as string) ?? ""}
          rows={field.rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-mono bg-background/50"
        />
      </div>
    );
  }
  if (field.type === "tags") {
    return (
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">{field.label}</Label>
        <TagListEditor values={(value as string[]) ?? []} onChange={(v) => onChange(v)} />
      </div>
    );
  }
  if (field.type === "objectList") {
    return (
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">{field.label}</Label>
        <div className="border border-dashed border-border rounded-md p-2">
          <RepeatableList
            items={((value as Array<Record<string, unknown>>) ?? [])}
            onChange={(v) => onChange(v)}
            itemFields={field.itemFields}
            itemLabel={field.itemLabel}
            newItem={field.newItem}
          />
        </div>
      </div>
    );
  }
  return null;
}

export function RepeatableList({
  items,
  onChange,
  itemFields,
  itemLabel,
  newItem,
  addLabel = "add item",
}: RepeatableListProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(items.length === 1 ? 0 : null);

  useEffect(() => {
    if (openIdx !== null && openIdx >= items.length) setOpenIdx(null);
  }, [items.length, openIdx]);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const del = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: unknown) =>
    onChange(items.map((it, idx) => (idx === i ? setIn(it, k, v) : it)));
  const add = () => {
    onChange([...items, newItem()]);
    setOpenIdx(items.length);
  };

  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className="border border-border rounded bg-background/40">
            <div className="flex items-center justify-between px-2 py-1.5">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex-1 text-left text-xs text-foreground truncate hover:text-terminal-green"
              >
                <span className="text-muted-foreground mr-2">[{String(i).padStart(2, "0")}]</span>
                {itemLabel(it, i) || "<unnamed>"}
              </button>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => del(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {open && (
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                {itemFields.map((f) => (
                  <FieldRenderer
                    key={f.key}
                    field={f}
                    value={(it as Record<string, unknown>)[f.key]}
                    onChange={(v) => update(i, f.key, v)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="w-full text-xs border-dashed h-8"
      >
        <Plus className="h-3 w-3 mr-1" /> {addLabel}
      </Button>
    </div>
  );
}
