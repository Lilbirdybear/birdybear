import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FileManager = () => {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ["admin-files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("cms-uploads").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return data;
    },
  });

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast.error("File too large (max 20MB)"); return; }
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("cms-uploads").upload(path, file);
    setUploading(false);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin-files"] });
    toast.success("Uploaded!");
  };

  const del = useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage.from("cms-uploads").remove([path]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-files"] }); toast.success("Deleted"); },
  });

  const getUrl = (name: string) => {
    const { data } = supabase.storage.from("cms-uploads").getPublicUrl(name);
    return data.publicUrl;
  };

  const copyUrl = (name: string) => {
    navigator.clipboard.writeText(getUrl(name));
    toast.success("URL copied!");
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Files ({files?.length || 0})</h3>
        <div>
          <input ref={fileRef} type="file" className="hidden" onChange={upload} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading..." : "+ Upload File"}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {files?.map(f => (
          <div key={f.name} className="glass-panel p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {f.metadata?.mimetype?.startsWith("image/") && (
                <img src={getUrl(f.name)} alt="" className="w-10 h-10 object-cover rounded" />
              )}
              <div className="min-w-0">
                <p className="text-foreground text-sm truncate">{f.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {((f.metadata?.size || 0) / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyUrl(f.name)}>Copy URL</Button>
              <Button variant="destructive" size="sm" onClick={() => del.mutate(f.name)}>Delete</Button>
            </div>
          </div>
        ))}
        {files?.length === 0 && <p className="text-muted-foreground text-sm">No files uploaded yet.</p>}
      </div>
    </div>
  );
};

export default FileManager;
