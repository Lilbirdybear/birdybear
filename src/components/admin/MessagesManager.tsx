import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MessagesManager = () => {
  const qc = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success("Deleted"); },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-6">Messages ({messages.length})</h3>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="glass-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-foreground font-medium">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="font-mono text-xs text-primary hover:text-primary/80">{m.email}</a>
                </div>
                {m.subject && <p className="text-sm text-foreground mb-1 font-medium">{m.subject}</p>}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                <p className="font-mono text-[10px] text-muted-foreground/50 mt-2">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => del.mutate(m.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
      </div>
    </div>
  );
};

export default MessagesManager;
