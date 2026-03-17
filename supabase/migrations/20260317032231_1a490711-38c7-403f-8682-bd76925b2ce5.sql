
CREATE TABLE public.ixd_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  content text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ixd_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "IXD pages viewable by everyone" ON public.ixd_pages
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admins can manage IXD pages" ON public.ixd_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Articles/case studies within each IXD page
CREATE TABLE public.ixd_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.ixd_pages(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  content text,
  cover_image_url text,
  tags text[] DEFAULT '{}'::text[],
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_id, slug)
);

ALTER TABLE public.ixd_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "IXD articles viewable by everyone" ON public.ixd_articles
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admins can manage IXD articles" ON public.ixd_articles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
