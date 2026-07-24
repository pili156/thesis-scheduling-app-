import { create } from "zustand";
import type { Task, TaskFormData, TaskStatus, Priority } from "../types";
import * as api from "../lib/api";
import { createNextInstanceData, shouldCreateNextInstance } from "./useRecurringTasks";

interface TaskFilters {
  search: string;
  status: TaskStatus | "Semua";
  priority: Priority | "Semua";
  showRecurring: "Semua" | "Berulang" | "Biasa";
}

interface TaskStore {
  tasks: Task[];
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
  _filteredVersion: number;
  _filteredCache: Task[] | null;

  fetchTasks: () => Promise<void>;
  refreshOverdueTasks: () => Promise<void>;
  addTask: (data: TaskFormData) => Promise<Task>;
  updateTask: (id: number, data: Partial<TaskFormData>) => Promise<Task>;
  updateTaskStatus: (id: number, status: string) => Promise<Task | void>;
  deleteTask: (id: number) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  getFilteredTasks: () => Task[];
}

export const useTasks = create<TaskStore>((set, get) => ({
  tasks: [],
  filters: {
    search: "",
    status: "Semua",
    priority: "Semua",
    showRecurring: "Biasa",
  },
  loading: false,
  error: null,
  _filteredVersion: 0,
  _filteredCache: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await api.getTasks();
      set({ tasks, loading: false, _filteredVersion: get()._filteredVersion + 1 });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  refreshOverdueTasks: async () => {
    try {
      await api.updateOverdueTasks();
      const tasks = await api.getTasks();
      set({ tasks, error: null, _filteredVersion: get()._filteredVersion + 1 });
    } catch (error) {
      set({ error: String(error) });
    }
  },

  addTask: async (data) => {
    try {
      const task = await api.createTask(data);
      set((state) => ({ tasks: [...state.tasks, task], error: null, _filteredVersion: state._filteredVersion + 1 }));
      return task;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  updateTask: async (id, data) => {
    try {
      const task = await api.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: null,
        _filteredVersion: state._filteredVersion + 1,
      }));
      return task;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const task = await api.updateTaskStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: null,
        _filteredVersion: state._filteredVersion + 1,
      }));

      if (status === "Selesai" && shouldCreateNextInstance(task)) {
        const nextData = createNextInstanceData(task);
        if (nextData) {
          const nextDate = nextData.date;
          await api.createRecurringTaskInstance(id, nextDate);
          const updatedTasks = await api.getTasks();
          set({ tasks: updatedTasks, _filteredVersion: get()._filteredVersion + 1 });
        }
      }

      return task;
    } catch (error) {
      set({ error: String(error) });
    }
  },

  deleteTask: async (id) => {
    try {
      await api.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        error: null,
        _filteredVersion: state._filteredVersion + 1,
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      _filteredVersion: state._filteredVersion + 1,
    }));
  },

  getFilteredTasks: () => {
    const { tasks, filters, _filteredVersion, _filteredCache } = get();
    if (_filteredCache && get()._filteredVersion === _filteredVersion) {
      return _filteredCache;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = tasks
      .filter((task) => {
        const matchesSearch = task.name
          .toLowerCase()
          .includes(filters.search.toLowerCase());
        const matchesStatus =
          filters.status === "Semua" || task.status === filters.status;
        const matchesPriority =
          filters.priority === "Semua" || task.priority === filters.priority;
        const matchesRecurring =
          filters.showRecurring === "Semua" ||
          (filters.showRecurring === "Berulang" && task.is_recurring) ||
          (filters.showRecurring === "Biasa" && !task.is_recurring);
        return matchesSearch && matchesStatus && matchesPriority && matchesRecurring;
      })
      .sort((a, b) => {
        if (a.status === "Selesai" && b.status !== "Selesai") return 1;
        if (a.status !== "Selesai" && b.status === "Selesai") return -1;

        if (a.status === "Selesai" && b.status === "Selesai") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        const priorityOrder: Record<string, number> = {
          Tinggi: 0,
          Sedang: 1,
          Rendah: 2,
        };
        const priorityDiff =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        const diffA = Math.abs(
          new Date(a.date).getTime() - today.getTime()
        );
        const diffB = Math.abs(
          new Date(b.date).getTime() - today.getTime()
        );
        return diffA - diffB;
      });

    set({ _filteredCache: result });
    return result;
  },
}));
