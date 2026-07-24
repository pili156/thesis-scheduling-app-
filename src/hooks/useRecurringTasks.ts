import type { Task, RecurrencePattern } from "../types";
import {
  getNextOccurrence,
  generateRecurrenceDescription,
} from "../lib/recurrence";
import { formatDate } from "../lib/dateParser";

export function shouldCreateNextInstance(task: Task): boolean {
  if (!task.is_recurring || task.status !== "Selesai") {
    return false;
  }
  return true;
}

export function createNextInstanceData(
  task: Task
): Omit<Task, "id" | "created_at" | "updated_at"> | null {
  if (!task.is_recurring || !task.recurrence_type) {
    return null;
  }

  const pattern: RecurrencePattern = {
    type: task.recurrence_type,
    interval: task.recurrence_interval,
    day_of_week: task.recurrence_day_of_week,
    day_of_month: task.recurrence_day_of_month,
  };

  const nextDate = getNextOccurrence(pattern, new Date(task.date));

  return {
    name: task.name,
    description: task.description,
    date: formatDate(nextDate),
    status: "Belum",
    priority: task.priority,
    is_recurring: true,
    recurrence_pattern: task.recurrence_pattern,
    recurrence_type: task.recurrence_type,
    recurrence_day_of_week: task.recurrence_day_of_week,
    recurrence_day_of_month: task.recurrence_day_of_month,
    recurrence_interval: task.recurrence_interval,
    parent_task_id: task.id,
    phase_id: task.phase_id,
  };
}

export function getRecurringDescription(task: Task): string | null {
  if (!task.is_recurring || !task.recurrence_type) {
    return null;
  }

  const pattern: RecurrencePattern = {
    type: task.recurrence_type,
    interval: task.recurrence_interval,
    day_of_week: task.recurrence_day_of_week,
    day_of_month: task.recurrence_day_of_month,
  };

  return generateRecurrenceDescription(pattern);
}

export function expandRecurringTasks(tasks: Task[]): Task[] {
  const result: Task[] = [];
  const processed = new Set<number>();

  for (const task of tasks) {
    if (task.parent_task_id && !processed.has(task.parent_task_id)) {
      continue;
    }
    result.push(task);
    processed.add(task.id);
  }

  return result.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
