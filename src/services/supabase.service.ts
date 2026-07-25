import { supabase } from "@/lib/supabaseClient";
import { Task, KanbanColumn } from "@/types";

// Fetch all tasks from Supabase
export const getSupabaseTasks = async (userEmail?: string, role?: string): Promise<Task[]> => {
  let query = supabase.from("tasks").select("*");
  
  if (role === "viewer" && userEmail) {
    query = query.eq("assigned_to", userEmail.toLowerCase());
  }

  const { data, error } = await query;
  if (error) {
    console.error("Supabase fetch error:", error);
    return [];
  }

  return (data || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    issueType: t.issue_type,
    dueDate: t.due_date,
    assignedTo: t.assigned_to,
    assignedToName: t.assigned_to_name,
    subtasks: t.subtasks || [],
    comments: t.comments || [],
    activityLog: t.activity_log || [],
    columnId: t.column_id,
    position: t.position,
    createdAt: t.created_at,
  }));
};

// Subscribe to Realtime Postgres changes
export const subscribeToSupabaseTasks = (
  role: "assigner" | "viewer",
  userEmail: string,
  onUpdate: (tasks: Task[]) => void
) => {
  getSupabaseTasks(userEmail, role).then(onUpdate);

  const channel = supabase
    .channel("realtime_tasks")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      () => {
        getSupabaseTasks(userEmail, role).then(onUpdate);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Create a new task in Supabase
export const createSupabaseTask = async (taskData: {
  title: string;
  description: string;
  assignedTo: string;
  assignedToName?: string;
  priority?: string;
  issueType?: string;
  dueDate?: string | null;
}) => {
  const { data, error } = await supabase.from("tasks").insert([
    {
      title: taskData.title,
      description: taskData.description,
      status: "pending",
      priority: taskData.priority || "medium",
      issue_type: taskData.issueType || "task",
      due_date: taskData.dueDate || null,
      assigned_to: taskData.assignedTo.toLowerCase(),
      assigned_to_name: taskData.assignedToName || taskData.assignedTo.split("@")[0],
      column_id: "col-pending",
      subtasks: [],
      comments: [],
      activity_log: [{ id: "act-" + Date.now(), action: "Created via Supabase Cloud", timestamp: new Date().toISOString() }],
    },
  ]).select();

  if (error) throw error;
  return data?.[0];
};

// Update task in Supabase
export const updateSupabaseTask = async (id: string, updates: Partial<Task>) => {
  const payload: any = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.issueType !== undefined) payload.issue_type = updates.issueType;
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
  if (updates.subtasks !== undefined) payload.subtasks = updates.subtasks;
  if (updates.comments !== undefined) payload.comments = updates.comments;
  if (updates.columnId !== undefined) payload.column_id = updates.columnId;

  const { data, error } = await supabase.from("tasks").update(payload).eq("id", id).select();
  if (error) throw error;
  return data?.[0];
};

// Delete task in Supabase
export const deleteSupabaseTask = async (id: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  return true;
};
