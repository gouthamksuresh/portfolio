import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Save } from "lucide-react";

interface Rec {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  sort_order: number;
}

export default function AdminRecommendations() {
  const [items, setItems] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("recommendations")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as Rec[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addItem = async () => {
    const { error } = await supabase.from("recommendations").insert({
      title: "New Recommendation",
      url: "https://example.com",
      category: "general",
      sort_order: items.length,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Added" });
    load();
  };

  const updateItem = async (item: Rec) => {
    const { error } = await supabase.from("recommendations").update({
      title: item.title,
      description: item.description,
      url: item.url,
      category: item.category,
      icon: item.icon,
      sort_order: item.sort_order,
    }).eq("id", item.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Saved" });
  };

  const deleteItem = async (id: string) => {
    await supabase.from("recommendations").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  const setField = (id: string, field: keyof Rec, value: string | number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <AdminShell title="recommendations.sh">
      <button
        onClick={addItem}
        className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded border border-terminal-green/40 text-terminal-green font-mono text-xs hover:bg-terminal-green/10 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" /> add recommendation
      </button>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded border border-border bg-card" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-border rounded bg-card p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={item.title}
                  onChange={(e) => setField(item.id, "title", e.target.value)}
                  placeholder="Title"
                  className="bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                />
                <input
                  value={item.url}
                  onChange={(e) => setField(item.id, "url", e.target.value)}
                  placeholder="URL"
                  className="bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                />
                <input
                  value={item.category}
                  onChange={(e) => setField(item.id, "category", e.target.value)}
                  placeholder="Category"
                  className="bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                />
                <input
                  value={item.sort_order}
                  type="number"
                  onChange={(e) => setField(item.id, "sort_order", parseInt(e.target.value) || 0)}
                  placeholder="Sort order"
                  className="bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                />
              </div>
              <textarea
                value={item.description || ""}
                onChange={(e) => setField(item.id, "description", e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => updateItem(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 transition-colors"
                >
                  <Save className="h-3 w-3" /> save
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-terminal-red/40 text-terminal-red hover:bg-terminal-red/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
