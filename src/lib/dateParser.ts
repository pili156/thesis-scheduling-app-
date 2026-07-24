let chronoPromise: Promise<typeof import("chrono-node")> | null = null;

function getChrono() {
  if (!chronoPromise) {
    chronoPromise = import("chrono-node");
  }
  return chronoPromise;
}

export async function parseNaturalDate(text: string): Promise<Date | null> {
  const chrono = await getChrono();
  const results = chrono.parse(text, new Date(), {
    forwardDate: true,
  });

  if (results.length === 0) {
    return null;
  }

  return results[0].start.date();
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateTime(date: Date): string {
  return date.toISOString();
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
