ALTER TABLE public.projects 
ADD COLUMN is_password_protected boolean NOT NULL DEFAULT true,
ADD COLUMN access_password text DEFAULT NULL;