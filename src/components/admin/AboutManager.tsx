import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AboutManager = () => {
  const qc = useQueryClient();
  const [heading, setHeading] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([""]);
  const [avatarUrl, setAvatarUrl] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-about"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_content").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setHeading(data.heading);
      setParagraphs(data.bio_paragraphs || [""]);
      setAvatarUrl(data.avatar_url || "");
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!data?.id) return;
      const { error } = await supabase.from("about_content").update({
        heading, bio_paragraphs: paragraphs.filter(Boolean), avatar_url: avatarUrl || null,
      }).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-about"] }); toast.success("Saved!"); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="text-lg font-semibold text-foreground">About Section</h3>
      <Input placeholder="Heading" value={heading} onChange={e => setHeading(e.target.value)} className="bg-muted" />
      <Input placeholder="Avatar URL" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="bg-muted" />
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">Bio Paragraphs</label>
        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <Textarea value={p} onChange={e => { const copy = [...paragraphs]; copy[i] = e.target.value; setParagraphs(copy); }} className="bg-muted" />
            <Button variant="destructive" size="sm" onClick={() => setParagraphs(paragraphs.filter((_, j) => j !== i))} disabled={paragraphs.length <= 1}>×</Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setParagraphs([...paragraphs, ""])}>+ Add Paragraph</Button>
      </div>
      <Button onClick={() => save.mutate()}>Save About</Button>
    </div>
  );
};

export default AboutManager;
