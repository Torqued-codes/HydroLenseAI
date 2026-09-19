import { useCallback, useEffect, useRef, useState } from "react";
import { checkService } from "../api/api";

const POLL_MS = 30000;

/** Tracks whether the backend is reachable: on mount, every 30s, on window focus, and on demand. */
export function useServiceStatus() {
  const [state, setState] = useState({ status: "checking", checkedAt: null });
  const mounted = useRef(true);

  const check = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setState((current) => ({ ...current, status: "checking" }));
    const ok = await checkService();
    if (mounted.current) setState({ status: ok ? "online" : "offline", checkedAt: new Date() });
  }, []);

  useEffect(() => {
    mounted.current = true;
    check();
    const timer = setInterval(() => check({ quiet: true }), POLL_MS);
    const onFocus = () => check({ quiet: true });
    window.addEventListener("focus", onFocus);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [check]);

  return { ...state, check };
}
