import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
 * Keeps a small log of what has been done in this browser (analyses and questions
 * asked to the assistant) so the Dashboard and the Recent page have real data to show.
 * It is stored on this device only (localStorage) and is never sent anywhere.
 */

const STORAGE_KEY = "hydrolense.analysis-history.v1";
const LEGACY_KEY = "aquaguard.analysis-history.v1"; // read once, then migrated
const QUESTIONS_KEY = "hydrolense.question-history.v1";
const MAX_ENTRIES = 20;
const MAX_QUESTIONS = 20;
const MAX_TEXT = 4000;

const AnalysisHistoryContext = createContext(null);

const clip = (value) => (typeof value === "string" ? value.slice(0, MAX_TEXT) : "");

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.at === "string" &&
    typeof entry.anomaly === "boolean" &&
    entry.values &&
    typeof entry.values === "object"
  );
}

function isValidQuestion(item) {
  return item && typeof item.at === "string" && typeof item.question === "string" && typeof item.answer === "string";
}

function loadList(keys, isValid, max) {
  try {
    const raw = keys.map((key) => window.localStorage.getItem(key)).find((value) => value !== null);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValid).slice(0, max) : [];
  } catch {
    return [];
  }
}

function saveList(key, list) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode, quota): the log simply won't persist */
  }
}

export function AnalysisHistoryProvider({ children }) {
  const [entries, setEntries] = useState(() => loadList([STORAGE_KEY, LEGACY_KEY], isValidEntry, MAX_ENTRIES));
  const [questions, setQuestions] = useState(() => loadList([QUESTIONS_KEY], isValidQuestion, MAX_QUESTIONS));

  useEffect(() => {
    saveList(STORAGE_KEY, entries);
    try {
      window.localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
  }, [entries]);

  useEffect(() => {
    saveList(QUESTIONS_KEY, questions);
  }, [questions]);

  /** Log one analysis, including the written result so it can be reviewed later. */
  const record = useCallback((payload, result) => {
    const anomaly = Boolean(result?.analysis?.anomaly);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      values: payload,
      anomaly,
      score: Number(result?.analysis?.anomaly_score ?? 0),
      priority: result?.risk?.priority || (anomaly ? "High" : "Normal"),
      riskExplanation: clip(result?.risk?.explanation),
      explanation: clip(result?.explanation),
      recommendations: Array.isArray(result?.recommendations)
        ? result.recommendations.filter((item) => typeof item === "string").slice(0, 12)
        : []
    };
    setEntries((current) => [entry, ...current].slice(0, MAX_ENTRIES));
  }, []);

  /** Log one question to the assistant and its answer. */
  const recordQuestion = useCallback((question, answer) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      question: clip(question),
      answer: clip(answer)
    };
    setQuestions((current) => [item, ...current].slice(0, MAX_QUESTIONS));
  }, []);

  /** Clears analyses only (used by the Dashboard's "Clear history"). */
  const clear = useCallback(() => setEntries([]), []);

  /** Clears everything (used by the Recent page). */
  const clearAll = useCallback(() => {
    setEntries([]);
    setQuestions([]);
  }, []);

  const value = useMemo(
    () => ({ entries, record, clear, questions, recordQuestion, clearAll }),
    [entries, record, clear, questions, recordQuestion, clearAll]
  );

  return <AnalysisHistoryContext.Provider value={value}>{children}</AnalysisHistoryContext.Provider>;
}

export function useAnalysisHistory() {
  const context = useContext(AnalysisHistoryContext);
  if (!context) throw new Error("useAnalysisHistory must be used inside AnalysisHistoryProvider");
  return context;
}
