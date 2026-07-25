import api from "./api";
import { KanbanColumn } from "@/types";

export const getColumns = async (): Promise<KanbanColumn[]> => {
  const response = await api.get("/columns");
  return response.data;
};

export const createColumn = async (title: string): Promise<KanbanColumn> => {
  const response = await api.post("/columns", { title });
  return response.data;
};

export const updateColumn = async (
  id: string,
  data: Partial<KanbanColumn>
): Promise<KanbanColumn> => {
  const response = await api.put(`/columns/${id}`, data);
  return response.data;
};

export const deleteColumn = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/columns/${id}`);
  return response.data;
};

export const reorderColumns = async (orderedIds: string[]): Promise<KanbanColumn[]> => {
  const response = await api.put("/columns/reorder/all", { orderedIds });
  return response.data;
};
