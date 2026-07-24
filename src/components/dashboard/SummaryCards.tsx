import { memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../../types";

interface SummaryCardsProps {
  tasks: Task[];
}

export const SummaryCards = memo(function SummaryCards({ tasks }: SummaryCardsProps) {
  const navigate = useNavigate();

  const now = new Date();
  const counts = useMemo(() => {
    const c = { threeDays: 0, sevenDays: 0, thirtyDays: 0, ninetyDays: 0 };
    for (const task of tasks) {
      if (task.status !== "Belum") continue;
      const taskDate = new Date(task.date);
      const diffDays = Math.ceil(
        (taskDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 3) c.threeDays++;
      if (diffDays <= 7) c.sevenDays++;
      if (diffDays <= 30) c.thirtyDays++;
      if (diffDays <= 90) c.ninetyDays++;
    }
    return c;
  }, [tasks]);

  const cards = [
    {
      count: counts.threeDays,
      label: "3 Hari ke Depan",
      days: 3,
    },
    {
      count: counts.sevenDays,
      label: "7 Hari ke Depan",
      days: 7,
    },
    {
      count: counts.thirtyDays,
      label: "30 Hari ke Depan",
      days: 30,
    },
    {
      count: counts.ninetyDays,
      label: "90 Hari ke Depan",
      days: 90,
    },
  ];

  const handleClick = useCallback((days: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endStr = endDate.toISOString().split("T")[0];
    navigate(`/tasks?until=${endStr}`);
  }, [navigate]);

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div
          key={card.days}
          className="summary-card"
          onClick={() => handleClick(card.days)}
          style={{ cursor: "pointer" }}
        >
          <div className="summary-card-count">{card.count}</div>
          <div className="summary-card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
});
