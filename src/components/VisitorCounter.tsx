import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Read current count
    supabase
      .from("visitor_counts")
      .select("count")
      .single()
      .then(({ data }) => {
        if (data) setCount(data.count);
      });

    // Track visit via edge function (fire-and-forget)
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      sessionStorage.setItem("visited", "1");
      supabase.functions.invoke("track-visit").then(({ data }) => {
        if (data?.count) setCount(data.count);
      });
    }
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <Eye className="h-3 w-3 text-primary" />
      <span>
        <span className="text-primary">{count.toLocaleString()}</span> visitors
      </span>
    </div>
  );
}
