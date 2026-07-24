import { invoke } from "@tauri-apps/api/core";
import type {
  Task,
  Project,
  Phase,
  Subtask,
  Advisor,
  Partner,
  TaskFormData,
  ProjectWithDetails,
  PhaseWithDetails,
  ProjectFormData,
  PhaseFormData,
  SubtaskFormData,
  AdvisorFormDataUpdate,
  PartnerFormDataUpdate,
} from "../types";

export async function getTasks(): Promise<Task[]> {
  return JSON.parse(await invoke<string>("get_tasks"));
}

export async function getTaskById(id: number): Promise<Task> {
  return JSON.parse(await invoke<string>("get_task_by_id", { id }));
}

export async function createTask(data: TaskFormData): Promise<Task> {
  return JSON.parse(await invoke<string>("create_task", { data }));
}

export async function updateTask(
  id: number,
  data: Partial<TaskFormData>
): Promise<Task> {
  return JSON.parse(await invoke<string>("update_task", { id, data }));
}

export async function deleteTask(id: number): Promise<void> {
  return invoke<void>("delete_task", { id });
}

export async function getTasksByDateRange(
  startDate: string,
  endDate: string
): Promise<Task[]> {
  return JSON.parse(
    await invoke<string>("get_tasks_by_date_range", { startDate, endDate })
  );
}

export async function getTaskCounts(): Promise<{
  threeDays: number;
  sevenDays: number;
  thirtyDays: number;
  ninetyDays: number;
}> {
  return JSON.parse(await invoke<string>("get_task_counts"));
}

export async function getProjects(): Promise<Project[]> {
  return JSON.parse(await invoke<string>("get_projects"));
}

export async function getAllProjectsWithDetails(): Promise<ProjectWithDetails[]> {
  return JSON.parse(await invoke<string>("get_all_projects_with_details"));
}

export async function getProjectWithDetails(
  id: number
): Promise<ProjectWithDetails> {
  return JSON.parse(
    await invoke<string>("get_project_with_details", { id })
  );
}

export async function getPhasesByProject(
  projectId: number
): Promise<PhaseWithDetails[]> {
  return JSON.parse(
    await invoke<string>("get_phases_by_project", { projectId })
  );
}

export async function getSubtasksByPhase(
  phaseId: number
): Promise<Subtask[]> {
  return JSON.parse(
    await invoke<string>("get_subtasks_by_phase", { phaseId })
  );
}

export async function updateSubtaskStatus(
  id: number,
  status: string
): Promise<Subtask> {
  return JSON.parse(
    await invoke<string>("update_subtask_status", { id, status })
  );
}

export async function getAdvisorsByProject(
  projectId: number
): Promise<Advisor[]> {
  return JSON.parse(
    await invoke<string>("get_advisors_by_project", { projectId })
  );
}

export async function addAdvisor(data: {
  project_id: number;
  name: string;
  phone: string;
  email: string;
}): Promise<Advisor> {
  return JSON.parse(await invoke<string>("add_advisor", { data }));
}

export async function getPartnersByProject(
  projectId: number
): Promise<Partner[]> {
  return JSON.parse(
    await invoke<string>("get_partners_by_project", { projectId })
  );
}

export async function addPartner(data: {
  project_id: number;
  name: string;
  phone: string;
  email: string;
}): Promise<Partner> {
  return JSON.parse(await invoke<string>("add_partner", { data }));
}

export async function checkDueTasks(): Promise<Task[]> {
  return JSON.parse(await invoke<string>("check_due_tasks"));
}

// --- Project CRUD ---
export async function createProject(data: ProjectFormData): Promise<Project> {
  return JSON.parse(await invoke<string>("create_project", { data }));
}

export async function updateProject(
  id: number,
  data: ProjectFormData
): Promise<Project> {
  return JSON.parse(await invoke<string>("update_project", { id, data }));
}

export async function deleteProject(id: number): Promise<void> {
  return invoke<void>("delete_project", { id });
}

// --- Phase CRUD ---
export async function createPhase(data: PhaseFormData): Promise<Phase> {
  return JSON.parse(await invoke<string>("create_phase", { data }));
}

export async function updatePhase(
  id: number,
  data: PhaseFormData
): Promise<Phase> {
  return JSON.parse(await invoke<string>("update_phase", { id, data }));
}

export async function deletePhase(id: number): Promise<void> {
  return invoke<void>("delete_phase", { id });
}

// --- Subtask CRUD ---
export async function createSubtask(data: SubtaskFormData): Promise<Subtask> {
  return JSON.parse(await invoke<string>("create_subtask", { data }));
}

export async function updateSubtask(
  id: number,
  data: SubtaskFormData
): Promise<Subtask> {
  return JSON.parse(await invoke<string>("update_subtask", { id, data }));
}

export async function deleteSubtask(id: number): Promise<void> {
  return invoke<void>("delete_subtask", { id });
}

// --- Task Status & Recurring ---
export async function updateTaskStatus(
  id: number,
  status: string
): Promise<Task> {
  return JSON.parse(await invoke<string>("update_task_status", { id, status }));
}

export async function createRecurringTaskInstance(
  parentId: number,
  newDate: string
): Promise<Task> {
  return JSON.parse(
    await invoke<string>("create_recurring_task_instance", {
      parentId,
      newDate,
    })
  );
}

export async function updateOverdueTasks(): Promise<Task[]> {
  return JSON.parse(await invoke<string>("update_overdue_tasks"));
}

// --- Advisor & Partner CRUD ---
export async function updateAdvisor(
  data: AdvisorFormDataUpdate
): Promise<Advisor> {
  return JSON.parse(await invoke<string>("update_advisor", { data }));
}

export async function deleteAdvisor(id: number): Promise<void> {
  return invoke<void>("delete_advisor", { id });
}

export async function updatePartner(
  data: PartnerFormDataUpdate
): Promise<Partner> {
  return JSON.parse(await invoke<string>("update_partner", { data }));
}

export async function deletePartner(id: number): Promise<void> {
  return invoke<void>("delete_partner", { id });
}
