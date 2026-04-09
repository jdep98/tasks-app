export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  completed: boolean;
  categoryId: string;
  isImportant: boolean; // Managed by Remote Config
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}
