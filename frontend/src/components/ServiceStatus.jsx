import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../api/api";
import { useServiceStatus } from "../hooks/useServiceStatus";

const LABELS = {
  checking: "Checking service",
  online: "Service online",
  offline: "Service offline"
};

export default function ServiceStatus() {
  const { status, checkedAt, check } = useServiceStatus();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="service" ref={rootRef}>
      <button
        type="button"
        className={`service-btn service-btn--${status}`}
        aria-expanded={open}
        aria-controls="service-popover"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="service-dot" aria-hidden="true"></span>
        {LABELS[status]}
      </button>

      {open && (
        <div className="service-popover" id="service-popover" role="dialog" aria-label="Backend connection">
          <div className="service-head">
            <strong>Backend connection</strong>
            <span className={`service-state service-state--${status}`}>{LABELS[status]}</span>
          </div>

          <dl className="service-list">
            <div>
              <dt>API address</dt>
              <dd>{API_BASE}</dd>
            </div>
            <div>
              <dt>This page</dt>
              <dd>{window.location.origin}</dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{checkedAt ? checkedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }) : "Not yet"}</dd>
            </div>
          </dl>

          {status === "offline" && (
            <p className="service-help">
              This browser can't reach the API. Start the backend and make sure its CORS settings allow
              the page address above. Analysis and the assistant need it.
            </p>
          )}

          <button type="button" className="ghost-button" onClick={() => check()} disabled={status === "checking"}>
            Check again
          </button>
        </div>
      )}
    </div>
  );
}
