import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { isPermissionGranted, sendNotification } from "@tauri-apps/plugin-notification";
import type { Task } from "../types";
import { getDaysUntil } from "../lib/dateParser";

const CHECK_INTERVAL = 60 * 60 * 1000;

async function checkAndNotifyTasks() {
  try {
    const permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      return;
    }

    const tasks: Task[] = await invoke("get_due_tasks_for_notification");

    for (const task of tasks) {
      const daysUntil = getDaysUntil(task.date);

      if (daysUntil === 1) {
        sendNotification({
          title: "Pengingat Tugas Besok",
          body: `"${task.name}" jatuh tempo besok.`,
        });
      } else if (daysUntil === 0) {
        sendNotification({
          title: "Tugas Hari Ini",
          body: `"${task.name}" harus diselesaikan hari ini.`,
        });
      } else if (daysUntil < 0) {
        sendNotification({
          title: "Tugas Terlewat",
          body: `"${task.name}" sudah melewati tenggat waktu.`,
        });
      }
    }
  } catch (error) {
    console.error("Error checking due tasks:", error);
  }
}

export function useNotifications() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    checkAndNotifyTasks();

    intervalRef.current = setInterval(checkAndNotifyTasks, CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const sendTaskNotification = async (title: string, body: string) => {
    const permissionGranted = await isPermissionGranted();
    if (permissionGranted) {
      sendNotification({ title, body });
    }
  };

  return { sendTaskNotification };
}
