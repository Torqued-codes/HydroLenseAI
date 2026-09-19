export function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  });
}

/** Turns the browser's raw network failure into something a person can act on. */
export function friendlyError(err) {
  const message = err?.message || "";
  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return "Can't reach the AquaGuard service. Check that the backend is running, then try again.";
  }
  return message || "Something went wrong. Try again.";
}
