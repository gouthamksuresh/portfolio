import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function TagListEditor({ values, onChange, placeholder = "type and press Enter…" }: Props) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...values, v]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };
  return (
    <div className="border border-border rounded-md bg-background/50 p-2 flex flex-wrap gap-1.5 items-center">
      {values.map((v, i) => (
        <span
          key={`${v}-${i}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-terminal-green/10 text-terminal-green border border-terminal-green/30"
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={placeholder}
        className="flex-1 min-w-[140px] h-7 border-0 bg-transparent text-xs focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
      />
    </div>
  );
}
