const RU_MONTHS_SHORT = [
  "ЯНВ",
  "ФЕВ",
  "МАР",
  "АПР",
  "МАЙ",
  "ИЮН",
  "ИЮЛ",
  "АВГ",
  "СЕН",
  "ОКТ",
  "НОЯ",
  "ДЕК"
];

function parseDate(dateString: string) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatEventDate(dateString: string) {
  const date = parseDate(dateString);
  if (!date) {
    return "Дата уточняется";
  }
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatCourseDate(dateString: string) {
  const date = parseDate(dateString);
  if (!date) {
    return "Дата уточняется";
  }
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatShortDateLabel(dateString: string) {
  const date = parseDate(dateString);
  if (!date) {
    return "Дата уточняется";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short"
  }).format(date);
}

export function formatDayBadge(dateString: string) {
  const date = parseDate(dateString);
  if (!date) {
    return { day: "--", month: "---" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: RU_MONTHS_SHORT[date.getMonth()] ?? "---"
  };
}

export function formatEventTime(dateString: string) {
  const date = parseDate(dateString);
  if (!date) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
