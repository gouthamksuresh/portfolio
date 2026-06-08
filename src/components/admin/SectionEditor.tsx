import { ReactNode } from "react";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  subtitle?: string;
  dirty?: boolean;
  saving?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  children: ReactNode;
}

export function SectionEditor({ title, subtitle, dirty, saving, onSave, onReset, children }: Props) {
  return (
    <div className="max-w-4xl">
      <div className="border border-border rounded-md bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
          <div>
            <div className="text-sm text-terminal-green">{title}</div>
            {subtitle && <div className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2">
            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
                <RotateCcw className="h-3 w-3 mr-1" /> reset
              </Button>
            )}
            {onSave && (
              <Button
                size="sm"
                onClick={onSave}
                disabled={!dirty || saving}
                className="text-xs bg-terminal-green text-background hover:bg-terminal-green/90"
              >
                {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                save
              </Button>
            )}
          </div>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
