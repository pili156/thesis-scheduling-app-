import type { Priority } from "../../types";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { className: string; label: string }> = {
  Tinggi: { className: "badge-tinggi", label: "Tinggi" },
  Sedang: { className: "badge-sedang", label: "Sedang" },
  Rendah: { className: "badge-rendah", label: "Rendah" },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
