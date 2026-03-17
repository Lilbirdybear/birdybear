import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IxdPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  cover_image_url: string | null;
  published: boolean;
  sort_order: number;
}

interface IxdArticle {
  id: string;
  page_id: string;
  slug: string;
  title: string;
  content: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  published: boolean;
  sort_order: number;
}

const IxdManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<IxdPage | null>(null);
  const [editingArticle, setEditingArticle] = useState<IxdArticle | null>(null);
  const [newArticle, setNewArticle] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    content: "",
    cover_image_url: "",
    tags: "",
    published: false,
  });

  const { data: pages, isLoading } = useQuery({
    queryKey: ["admin-ixd-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ixd_pages")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as IxdPage[];
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["admin-ixd-articles", selectedPage?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ixd_articles")
        .select("*")
        .eq("page_id", selectedPage!.id)
        .order("sort_order");
      if (error) throw error;
      return data as IxdArticle[];
    },
    enabled: !!selectedPage?.id,
  });

  const updatePage = useMutation({
    mutationFn: async (page: Partial<IxdPage> & { id: string }) => {
      const { error } = await supabase.from("ixd_pages").update(page).eq("id", page.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ixd-pages"] });
      toast({ title: "Page updated" });
    },
  });

  const saveArticle = useMutation({
    mutationFn: async (article: any) => {
      if (article.id) {
        const { error } = await supabase.from("ixd_articles").update(article).eq("id", article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ixd_articles").insert(article);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ixd-articles"] });
      setEditingArticle(null);
      setNewArticle(false);
      setArticleForm({ title: "", slug: "", content: "", cover_image_url: "", tags: "", published: false });
      toast({ title: "Article saved" });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ixd_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ixd-articles"] });
      toast({ title: "Article deleted" });
    },
  });

  const handleSaveArticle = () => {
    const payload: any = {
      title: articleForm.title,
      slug: articleForm.slug,
      content: articleForm.content || null,
      cover_image_url: articleForm.cover_image_url || null,
      tags: articleForm.tags ? articleForm.tags.split(",").map((t) => t.trim()) : [],
      published: articleForm.published,
      page_id: selectedPage?.id,
    };
    if (editingArticle) payload.id = editingArticle.id;
    saveArticle.mutate(payload);
  };

  const startEditArticle = (article: IxdArticle) => {
    setEditingArticle(article);
    setNewArticle(false);
    setArticleForm({
      title: article.title,
      slug: article.slug,
      content: article.content || "",
      cover_image_url: article.cover_image_url || "",
      tags: article.tags?.join(", ") || "",
      published: article.published,
    });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">IXD Pages</h2>

      {!selectedPage ? (
        <div className="space-y-3">
          {pages?.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between border border-border rounded p-4"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-foreground">{page.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">/ixd/{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Published</span>
                  <Switch
                    checked={page.published}
                    onCheckedChange={(checked) =>
                      updatePage.mutate({ id: page.id, published: checked })
                    }
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedPage(page)}>
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedPage(null); setEditingArticle(null); setNewArticle(false); }}>
            ← Back to pages
          </Button>

          <div className="border border-border rounded p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">{selectedPage.title}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <Textarea
                  defaultValue={selectedPage.description || ""}
                  onBlur={(e) => updatePage.mutate({ id: selectedPage.id, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Page Content</label>
                <Textarea
                  defaultValue={selectedPage.content || ""}
                  rows={6}
                  onBlur={(e) => updatePage.mutate({ id: selectedPage.id, content: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cover Image URL</label>
                <Input
                  defaultValue={selectedPage.cover_image_url || ""}
                  onBlur={(e) => updatePage.mutate({ id: selectedPage.id, cover_image_url: e.target.value || null })}
                />
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-bold text-foreground">Articles & Case Studies</h4>
              <Button
                size="sm"
                onClick={() => {
                  setNewArticle(true);
                  setEditingArticle(null);
                  setArticleForm({ title: "", slug: "", content: "", cover_image_url: "", tags: "", published: false });
                }}
              >
                + Add Article
              </Button>
            </div>

            {(newArticle || editingArticle) && (
              <div className="border border-primary/30 rounded p-4 space-y-3">
                <Input
                  placeholder="Title"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm((f) => ({ ...f, title: e.target.value }))}
                />
                <Input
                  placeholder="Slug (e.g. my-case-study)"
                  value={articleForm.slug}
                  onChange={(e) => setArticleForm((f) => ({ ...f, slug: e.target.value }))}
                />
                <Textarea
                  placeholder="Content (supports HTML)"
                  value={articleForm.content}
                  rows={8}
                  onChange={(e) => setArticleForm((f) => ({ ...f, content: e.target.value }))}
                />
                <Input
                  placeholder="Cover image URL"
                  value={articleForm.cover_image_url}
                  onChange={(e) => setArticleForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={articleForm.tags}
                  onChange={(e) => setArticleForm((f) => ({ ...f, tags: e.target.value }))}
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={articleForm.published}
                    onCheckedChange={(checked) => setArticleForm((f) => ({ ...f, published: checked }))}
                  />
                  <span className="text-sm text-muted-foreground">Published</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveArticle}>
                    {editingArticle ? "Update" : "Create"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setNewArticle(false); setEditingArticle(null); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {articles?.map((article) => (
              <div key={article.id} className="flex items-center justify-between border border-border rounded p-4">
                <div>
                  <p className="font-medium text-foreground">{article.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{article.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEditArticle(article)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteArticle.mutate(article.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {(!articles || articles.length === 0) && !newArticle && (
              <p className="text-sm text-muted-foreground">No articles yet. Add one above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IxdManager;
