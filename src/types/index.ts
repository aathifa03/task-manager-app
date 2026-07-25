export interface User {
  id: string;
  name: string;
  email: string;
  role: "assigner" | "viewer";
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  text: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
}

export type IssueType = "task" | "bug" | "feature" | "improvement";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "done";
  issueType?: IssueType;
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  assignedTo: string;
  assignedToName?: string;
  subtasks?: Subtask[];
  comments?: Comment[];
  activityLog?: ActivityItem[];
  createdAt?: string;
  columnId?: string;
  position?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}
