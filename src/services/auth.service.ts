import api from "./api";
import { User } from "@/types";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type LoginData = {
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  // Client-side logout clears localStorage token
};

export const getProfile = async (): Promise<{ user: User }> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (data: { name: string }): Promise<{ user: User; message: string }> => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await api.put("/auth/password", data);
  return response.data;
};

export const getViewers = async (): Promise<User[]> => {
  const response = await api.get("/auth/viewers");
  return response.data;
};