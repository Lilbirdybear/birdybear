import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import FooterSection from "@/components/FooterSection";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject || null,
      message: result.data.message,
    });
    setSending(false);

    if (error) {
      toast.error("Failed to send message. Please try again.");
      return;
    }

    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const update = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14">
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
                // CONTACT
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Let's work together</h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Have a project in mind? Want to collaborate on something exciting?
                Drop me a message and I'll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                <div className="glass-panel p-4">
                  <p className="font-mono text-xs text-muted-foreground mb-1">EMAIL</p>
                  <a href="mailto:eli.birdsall@daydreamingknights.com" className="text-primary hover:text-primary/80 transition-colors text-sm">
                    eli.birdsall@daydreamingknights.com
                  </a>
                </div>
                <div className="glass-panel p-4">
                  <p className="font-mono text-xs text-muted-foreground mb-1">AVAILABILITY</p>
                  <p className="text-foreground text-sm">Open to freelance & collaboration</p>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <div>
                <Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="bg-muted border-border"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="bg-muted border-border"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <Input
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="bg-muted border-border"
              />
              <div>
                <Textarea
                  placeholder="Your message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="bg-muted border-border min-h-[150px]"
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </section>
        <FooterSection />
      </div>
    </div>
  );
};

export default Contact;
