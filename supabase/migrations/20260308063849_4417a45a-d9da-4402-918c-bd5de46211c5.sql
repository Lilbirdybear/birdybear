
-- Add slug to projects for URL routing
ALTER TABLE public.projects ADD COLUMN slug TEXT UNIQUE;

-- Generate slugs for existing projects
UPDATE public.projects SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));

-- Make slug not null after populating
ALTER TABLE public.projects ALTER COLUMN slug SET NOT NULL;

-- Add contact_messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a message
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admins can read messages
CREATE POLICY "Admins can read messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete messages" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
