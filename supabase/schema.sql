-- ========================================================
-- TaskFlow — Supabase PostgreSQL Schema & Realtime Setup
-- Copy and paste this whole script into Supabase SQL Editor!
-- ========================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('assigner', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY DEFAULT ('t' || extract(epoch from now())::bigint),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  issue_type TEXT DEFAULT 'task' CHECK (issue_type IN ('task', 'bug', 'feature', 'improvement')),
  due_date DATE,
  assigned_to TEXT NOT NULL,
  assigned_to_name TEXT NOT NULL,
  subtasks JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  activity_log JSONB DEFAULT '[]'::jsonb,
  column_id TEXT DEFAULT 'col-pending',
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Kanban Columns Table
CREATE TABLE IF NOT EXISTS public.kanban_columns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Public Access Policies for Demo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to columns" ON public.kanban_columns FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_columns;

-- 6. Insert Default Seed Data
INSERT INTO public.users (name, email, role) VALUES
  ('Hajeeth Ahamed', 'assigner@taskflow.com', 'assigner'),
  ('Maya', 'viewer@taskflow.com', 'viewer')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.kanban_columns (id, title, position) VALUES
  ('col-pending', 'Pending Tasks', 1),
  ('col-done', 'Completed Tasks', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (title, description, status, priority, issue_type, assigned_to, assigned_to_name, column_id, position) VALUES
  ('Design login screen', 'Build the responsive login screen with dark glassmorphic design.', 'done', 'high', 'feature', 'viewer@taskflow.com', 'Maya', 'col-done', 1),
  ('Connect Register API', 'Integrate registration page with Express authentication endpoints.', 'pending', 'medium', 'task', 'viewer@taskflow.com', 'Maya', 'col-pending', 1)
ON CONFLICT (id) DO NOTHING;
