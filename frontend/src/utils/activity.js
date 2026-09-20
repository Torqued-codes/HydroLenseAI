import { assessReading, isOutside } from "./reference";

/** Analyses and questions merged into one list, newest first. */
export function mergeActivity(entries, questions) {
  const items = [
    ...entries.map((entry) => ({ kind: "analysis", id: entry.id, at: entry.at, entry })),
    ...questions.map((question) => ({ kind: "question", id: question.id, at: question.at, question }))
  ];
  return items.sort((a, b) => new Date(b.at) - new Date(a.at));
}

/** "pH, Turbidity" or "None": which parameters were outside their indicative range. */
export function outsideRangeLabel(values) {
  const names = assessReading(values).filter((row) => isOutside(row.status)).map((row) => row.label);
  return names.length ? names.join(", ") : "None";
}

/**
 * Scrolls an element into view only when its top is not already visible, so picking
 * an item never makes the page jump when the details are already on screen.
 */
export function revealElement(id) {
  requestAnimationFrame(() => {
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top;
    if (top < 90 || top > window.innerHeight - 140) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  });
}
