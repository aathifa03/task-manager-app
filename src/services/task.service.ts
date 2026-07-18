import api from "./api";
import { Task } from "@/types";

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (data: {
  title: string;
  description: string;
  assignedTo: string;
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

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
