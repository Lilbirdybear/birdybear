ALTER TABLE public.site_settings 
ALTER COLUMN social_links SET DEFAULT '{"instagram": "", "artstation": "", "cara": "", "linkedin": "", "github": ""}'::jsonb;