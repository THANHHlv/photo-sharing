export default function formatDateTime(dateTime) {
  const normalized = typeof dateTime === "string" ? dateTime.replace(" ", "T") : dateTime;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? dateTime : date.toLocaleString();
}
