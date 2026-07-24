export type TaskStatus = "Belum" | "Selesai" | "Terlewat";
export type Priority = "Tinggi" | "Sedang" | "Rendah";
export type RecurrenceType = "daily" | "weekly" | "monthly" | "custom";

export interface Task {
  id: number;
  name: string;
  description: string;
  date: string;
  status: TaskStatus;
  priority: Priority;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  recurrence_type: RecurrenceType | null;
  recurrence_day_of_week: number | null;
  recurrence_day_of_month: number | null;
  recurrence_interval: number;
  parent_task_id: number | null;
  phase_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface Phase {
  id: number;
  project_id: number;
  name: string;
  description: string;
  phase_order: number;
  created_at: string;
}

export interface Subtask {
  id: number;
  phase_id: number;
  name: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  estimated_days: number | null;
  actual_days: number | null;
  due_date: string | null;
  created_at: string;
}

export interface Advisor {
  id: number;
  project_id: number;
  name: string;
  phone: string | null;
  email: string | null;
}

export interface Partner {
  id: number;
  project_id: number;
  name: string;
  phone: string | null;
  email: string | null;
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  day_of_week: number | null;
  day_of_month: number | null;
}

export interface TaskFormData {
  name: string;
  description: string;
  date: string;
  priority: Priority;
  is_recurring: boolean;
  recurrence_type: RecurrenceType | null;
  recurrence_day_of_week: number | null;
  recurrence_day_of_month: number | null;
  recurrence_interval: number;
}

export interface ProjectWithDetails extends Project {
  advisors: Advisor[];
  partners: Partner[];
  phases: PhaseWithDetails[];
}

export interface PhaseWithDetails extends Phase {
  subtasks: Subtask[];
  progress: number;
}

export interface ProjectFormData {
  name: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
}

export interface PhaseFormData {
  project_id: number;
  name: string;
  description: string;
  phase_order: number;
}

export interface SubtaskFormData {
  phase_id: number;
  name: string;
  description: string;
  priority: Priority;
  estimated_days: number | null;
  actual_days: number | null;
  due_date: string | null;
}

export interface AdvisorFormDataUpdate {
  id: number;
  project_id: number;
  name: string;
  phone: string;
  email: string;
}

export interface PartnerFormDataUpdate {
  id: number;
  project_id: number;
  name: string;
  phone: string;
  email: string;
}
