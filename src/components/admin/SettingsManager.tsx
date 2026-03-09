import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsManager = () => {
  const qc = useQueryClient();
  const [siteTitle, setSiteTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [social, setSocial] = useState({ behance: "", dribbble: "", linkedin: "", github: "" });
  const [availableForWork, setAvailableForWork] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setSiteTitle(data.site_title || "");
      setTagline(data.tagline || "");
      setEmail(data.email || "");
      const sl = (data.social_links || {}) as Record<string, string>;
      setSocial({ behance: sl.behance || "", dribbble: sl.dribbble || "", linkedin: sl.linkedin || "", github: sl.github || "" });
      setAvailableForWork(data.available_for_work ?? false);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!data?.id) return;
      const { error } = await supabase.from("site_settings").update({
        site_title: siteTitle, tagline, email, social_links: social, available_for_work: availableForWork,
      }).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-settings"] }); toast.success("Saved!"); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-4 max-w-xl">
      <h3 className="text-lg font-semibold text-foreground">Site Settings</h3>
      <Input placeholder="Site Title" value={siteTitle} onChange={e => setSiteTitle(e.target.value)} className="bg-muted" />
      <Input placeholder="Tagline" value={tagline} onChange={e => setTagline(e.target.value)} className="bg-muted" />
      <Input placeholder="Contact Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-muted" />
      <div className="flex items-center gap-3 py-2">
        <Switch id="available-toggle" checked={availableForWork} onCheckedChange={setAvailableForWork} />
        <Label htmlFor="available-toggle" className="text-sm text-foreground cursor-pointer">
          {availableForWork ? "Available for Work" : "Not Available for Work"}
        </Label>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Social Links</label>
        {(["behance", "dribbble", "linkedin", "github"] as const).map(key => (
          <Input key={key} placeholder={key.charAt(0).toUpperCase() + key.slice(1) + " URL"} value={social[key]} onChange={e => setSocial({ ...social, [key]: e.target.value })} className="bg-muted" />
        ))}
      </div>
      <Button onClick={() => save.mutate()}>Save Settings</Button>
    </div>
  );
};

export default SettingsManager;
