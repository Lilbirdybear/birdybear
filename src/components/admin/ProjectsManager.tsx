import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const emptyProject: Partial<TablesInsert<"projects">> = {
  title: "", category: "ixd", year: new Date().getFullYear().toString(), tags: [], description: "", published: true, sort_order: 0,
};

const ProjectsManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (p: Partial<Project>) => {
      const slug = p.slug || (p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { ...p, slug, tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean) };
      if (p.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload as TablesInsert<"projects">);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); setEditing(null); toast.success("Saved!"); },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Deleted"); },
  });

  const startEdit = (p?: Project) => {
    if (p) {
      setEditing(p);
      setTagsInput((p.tags || []).join(", "));
    } else {
      setEditing(emptyProject);
      setTagsInput("");
    }
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  if (editing) {
    return (
      <div className="space-y-4 max-w-xl">
        <h3 className="text-lg font-semibold text-foreground">{editing.id ? "Edit" : "New"} Project</h3>
        <Input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="bg-muted" />
        <Select value={editing.category || "ixd"} onValueChange={v => setEditing({ ...editing, category: v })}>
          <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ixd">IXD</SelectItem>
            <SelectItem value="3d">3D</SelectItem>
            <SelectItem value="game">Game</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Year" value={editing.year || ""} onChange={e => setEditing({ ...editing, year: e.target.value })} className="bg-muted" />
        <Input placeholder="Tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="bg-muted" />
        <Textarea placeholder="Description" value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="bg-muted" />
        <Input placeholder="Image URL" value={editing.image_url || ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} className="bg-muted" />
        <Input type="number" placeholder="Sort order" value={editing.sort_order ?? 0} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="bg-muted" />
        <div className="flex items-center gap-2">
          <Switch checked={editing.published ?? true} onCheckedChange={v => setEditing({ ...editing, published: v })} />
          <span className="text-sm text-muted-foreground">Published</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => upsert.mutate(editing)}>Save</Button>
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Projects ({projects?.length || 0})</h3>
        <Button onClick={() => startEdit()}>+ New Project</Button>
      </div>
      <div className="space-y-2">
        {projects?.map(p => (
          <div key={p.id} className="glass-panel p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${p.category === 'ixd' ? 'bg-ixd' : p.category === '3d' ? 'bg-three-d' : 'bg-game'}`} />
              <span className="text-foreground font-medium">{p.title}</span>
              <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
              {!p.published && <span className="text-xs text-destructive font-mono">DRAFT</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(p)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => del.mutate(p.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
