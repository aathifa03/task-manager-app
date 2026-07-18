export interface User {
  id: string;
  name: string;
  email: string;
  role: "assigner" | "viewer";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "done";
  assignedTo: string; // Email of the user assigned to this task
  assignedToName?: string; // Display name of the assigned user
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}
