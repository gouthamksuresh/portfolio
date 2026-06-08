import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, Trash2 } from "lucide-react";

export default function AdminResume() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkResume();
  }, []);

  const checkResume = async () => {
    const { data } = await supabase.storage.from("resumes").list();
    const file = data?.find((f) => f.name === "resume.pdf");
    if (file) {
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl("resume.pdf");
      setResumeUrl(urlData.publicUrl);
    } else {
      setResumeUrl(null);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Only PDF files allowed", variant: "destructive" });
      return;
    }
    setUploading(true);
    const { error } = await supabase.storage
      .from("resumes")
      .upload("resume.pdf", file, { upsert: true });
    setUploading(false);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Resume uploaded!" });
    checkResume();
  };

  const handleDelete = async () => {
    await supabase.storage.from("resumes").remove(["resume.pdf"]);
    setResumeUrl(null);
    toast({ title: "Resume deleted" });
  };

  return (
    <AdminShell title="resume.sh">
      <div className="space-y-6">
        <div className="border border-border rounded bg-card p-6">
          <h3 className="font-mono text-sm text-primary mb-4">// current resume</h3>

          {resumeUrl ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded border border-terminal-green/30 bg-terminal-green/5">
                <FileText className="h-5 w-5 text-terminal-green" />
                <span className="font-mono text-sm text-terminal-green">resume.pdf</span>
                <span className="text-[10px] text-muted-foreground font-mono">uploaded</span>
              </div>
              <div className="flex gap-3">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border font-mono text-xs hover:border-primary/60 hover:text-primary transition-colors"
                >
                  view resume
                </a>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-terminal-red/40 text-terminal-red font-mono text-xs hover:bg-terminal-red/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> delete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground font-mono text-sm">No resume uploaded yet.</p>
          )}
        </div>

        <div className="border border-dashed border-border rounded p-8 text-center">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground font-mono text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "uploading..." : "upload resume.pdf"}
          </button>
          <p className="text-muted-foreground text-xs font-mono mt-3">PDF files only</p>
        </div>
      </div>
    </AdminShell>
  );
}
