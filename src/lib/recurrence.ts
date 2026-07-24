import type { RecurrenceType } from "../types";

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  day_of_week: number | null;
  day_of_month: number | null;
}

export function getNextOccurrence(
  pattern: RecurrencePattern,
  fromDate: Date
): Date {
  const next = new Date(fromDate);

  switch (pattern.type) {
    case "daily":
      next.setDate(next.getDate() + pattern.interval);
      break;

    case "weekly": {
      const currentDay = next.getDay();
      const targetDay = pattern.day_of_week ?? currentDay;
      let daysUntil = targetDay - currentDay;
      if (daysUntil <= 0) {
        daysUntil += 7;
      }
      next.setDate(next.getDate() + daysUntil + (pattern.interval - 1) * 7);
      break;
    }

    case "monthly": {
      const targetDayOfMonth = pattern.day_of_month ?? next.getDate();
      next.setMonth(next.getMonth() + pattern.interval);
      next.setDate(targetDayOfMonth);
      break;
    }

    case "custom": {
      next.setDate(next.getDate() + pattern.interval);
      break;
    }
  }

  return next;
}

export function generateRecurrenceDescription(
  pattern: RecurrencePattern
): string {
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  switch (pattern.type) {
    case "daily":
      return pattern.interval === 1
        ? "Setiap hari"
        : `Setiap ${pattern.interval} hari`;

    case "weekly":
      if (pattern.day_of_week !== null) {
        return pattern.interval === 1
          ? `Setiap ${dayNames[pattern.day_of_week]}`
          : `Setiap ${pattern.interval} minggu sekali pada ${dayNames[pattern.day_of_week]}`;
      }
      return pattern.interval === 1
        ? "Setiap minggu"
        : `Setiap ${pattern.interval} minggu`;

    case "monthly":
      if (pattern.day_of_month !== null) {
        return pattern.interval === 1
          ? `Setiap tanggal ${pattern.day_of_month}`
          : `Setiap ${pattern.interval} bulan sekali tanggal ${pattern.day_of_month}`;
      }
      return pattern.interval === 1
        ? "Setiap bulan"
        : `Setiap ${pattern.interval} bulan`;

    case "custom":
      return `Setiap ${pattern.interval} hari`;

    default:
      return "Tidak berulang";
  }
}

export function getRecurrenceTypeLabel(type: RecurrenceType): string {
  switch (type) {
    case "daily":
      return "Harian";
    case "weekly":
      return "Mingguan";
    case "monthly":
      return "Bulanan";
    case "custom":
      return "Kustom";
    default:
      return type;
  }
}
