import api from "./api";
import { Task } from "@/types";

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data;
};

export const subscribeToTasks = (
  role: "assigner" | "viewer",
  userEmail: string,
  onUpdate: (tasks: Task[]) => void
) => {
  // Initial fetch
  getTasks().then(onUpdate).catch(console.error);

  // Poll every 2 seconds for clean local synchronization
  const interval = setInterval(() => {
    getTasks().then(onUpdate).catch(console.error);
  }, 2000);

  return () => clearInterval(interval);
};

export const createTask = async (data: {
  title: string;
  description: string;
  assignedTo: string;
  priority?: string;
  dueDate?: string | null;
  issueType?: string;
  subtasks?: any[];
}): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<Task>
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const addCommentToTask = async (
  id: string,
  text: string
): Promise<Task> => {
  const response = await api.post(`/tasks/${id}/comments`, { text });
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const moveTask = async (
  id: string,
  data: { columnId: string; position?: number }
): Promise<Task> => {
  const response = await api.put(`/tasks/move/${id}`, data);
  return response.data;
};
