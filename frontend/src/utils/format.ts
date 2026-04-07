export function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatCourseDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatDayBadge(dateString: string) {
  const date = new Date(dateString);
  const day = new Intl.DateTimeFormat("ru-RU", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(date).toUpperCase();
  return { day, month };
}
