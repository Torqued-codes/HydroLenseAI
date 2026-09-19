import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
 * Keeps a small log of the analyses run in this browser so the Dashboard has real
 * data to show. It is stored on this device only (localStorage) and is never sent anywhere.
 */

const STORAGE_KEY = "hydrolense.analysis-history.v1";
const LEGACY_KEY = "aquaguard.analysis-history.v1"; // read once, then migrated
const MAX_ENTRIES = 20;

const AnalysisHistoryContext = createContext(null);

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.at === "string" &&
    typeof entry.anomaly === "boolean" &&
    entry.values &&
    typeof entry.values === "object"
  );
}

function loadEntries() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidEntry).slice(0, MAX_ENTRIES) : [];
  } catch {
    return [];
  }
}

export function AnalysisHistoryProvider({ children }) {
  const [entries, setEntries] = useState(loadEntries);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      window.localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* storage unavailable (private mode, quota): the log simply won't persist */
    }
  }, [entries]);

  const record = useCallback((payload, result) => {
    const anomaly = Boolean(result?.analysis?.anomaly);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      values: payload,
      anomaly,
      score: Number(result?.analysis?.anomaly_score ?? 0),
      priority: result?.risk?.priority || (anomaly ? "High" : "Normal")
    };
    setEntries((current) => [entry, ...current].slice(0, MAX_ENTRIES));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo(() => ({ entries, record, clear }), [entries, record, clear]);

  return <AnalysisHistoryContext.Provider value={value}>{children}</AnalysisHistoryContext.Provider>;
}

export function useAnalysisHistory() {
  const context = useContext(AnalysisHistoryContext);
  if (!context) throw new Error("useAnalysisHistory must be used inside AnalysisHistoryProvider");
  return context;
}
