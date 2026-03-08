import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Post = Tables<"blog_posts">;

const BlogManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (p: Partial<Post>) => {
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      const slug = p.slug || (p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { ...p, tags, slug, published_at: p.published ? new Date().toISOString() : null };
      if (p.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload as TablesInsert<"blog_posts">);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); setEditing(null); toast.success("Saved!"); },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast.success("Deleted"); },
  });

  const startEdit = (p?: Post) => {
    if (p) { setEditing(p); setTagsInput((p.tags || []).join(", ")); }
    else { setEditing({ title: "", slug: "", excerpt: "", content: "", published: false, tags: [] }); setTagsInput(""); }
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  if (editing) {
    return (
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-foreground">{editing.id ? "Edit" : "New"} Post</h3>
        <Input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="bg-muted" />
        <Input placeholder="Slug (auto-generated if empty)" value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="bg-muted" />
        <Input placeholder="Excerpt" value={editing.excerpt || ""} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} className="bg-muted" />
        <Textarea placeholder="Content (Markdown supported)" value={editing.content || ""} onChange={e => setEditing({ ...editing, content: e.target.value })} className="bg-muted min-h-[200px]" />
        <Input placeholder="Cover image URL" value={editing.cover_image_url || ""} onChange={e => setEditing({ ...editing, cover_image_url: e.target.value })} className="bg-muted" />
        <Input placeholder="Tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="bg-muted" />
        <div className="flex items-center gap-2">
          <Switch checked={editing.published ?? false} onCheckedChange={v => setEditing({ ...editing, published: v })} />
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
        <h3 className="text-lg font-semibold text-foreground">Blog Posts ({posts?.length || 0})</h3>
        <Button onClick={() => startEdit()}>+ New Post</Button>
      </div>
      <div className="space-y-2">
        {posts?.map(p => (
          <div key={p.id} className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-foreground font-medium">{p.title}</span>
              <span className="font-mono text-xs text-muted-foreground ml-3">/{p.slug}</span>
              {!p.published && <span className="text-xs text-destructive font-mono ml-2">DRAFT</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(p)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => del.mutate(p.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {posts?.length === 0 && <p className="text-muted-foreground text-sm">No blog posts yet.</p>}
      </div>
    </div>
  );
};

export default BlogManager;
