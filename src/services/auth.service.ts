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

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const getViewers = async (): Promise<User[]> => {
  const response = await api.get("/auth/viewers");
  return response.data;
};