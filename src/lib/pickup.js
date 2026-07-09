import { STORE } from "@/lib/constants";

// Local calendar date as YYYY-MM-DD — deliberately not `toISOString()`, which
// converts to UTC and can shift the date by a day for positive UTC offsets
// (e.g. Europe/Paris), turning a selected Monday into a rejected Sunday.
export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function nextPickupDates(count = 4, referenceDate = new Date()) {
  const dates = [];
  const cursor = new Date(referenceDate);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);
  while (dates.length < count) {
    if (STORE.pickupWeekdays.includes(cursor.getDay())) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function isValidPickupDate(dateStr, referenceDate = new Date()) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  if (date < today) return false;

  return STORE.pickupWeekdays.includes(date.getDay());
}

export function formatPickupDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
