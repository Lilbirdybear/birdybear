CREATE OR REPLACE FUNCTION public.verify_project_password(_project_id uuid, _password text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = _project_id
      AND access_password = _password
  )
$$;