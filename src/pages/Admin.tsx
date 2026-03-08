import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProjectsManager from "@/components/admin/ProjectsManager";
import BlogManager from "@/components/admin/BlogManager";
import AboutManager from "@/components/admin/AboutManager";
import SettingsManager from "@/components/admin/SettingsManager";
import FileManager from "@/components/admin/FileManager";
import MessagesManager from "@/components/admin/MessagesManager";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to site
          </a>
          <h1 className="text-lg font-bold text-foreground">CMS</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">{user.email}</span>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="projects">
          <TabsList className="bg-muted mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="projects"><ProjectsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="about"><AboutManager /></TabsContent>
          <TabsContent value="settings"><SettingsManager /></TabsContent>
          <TabsContent value="files"><FileManager /></TabsContent>
          <TabsContent value="messages"><MessagesManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
