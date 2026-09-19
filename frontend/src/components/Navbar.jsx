import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LensIcon } from "./Icons";
import ServiceStatus from "./ServiceStatus";
import StatusChip from "./StatusChip";
import { useAnalysisHistory } from "../context/AnalysisHistory";
import { formatWhen } from "../utils/format";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/analysis", label: "Analysis" },
  { to: "/about", label: "About" }
];

function HeaderClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className="utility-clock" dateTime={now.toISOString()}>
      {now.toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
    </time>
  );
}

function LatestResult() {
  const { entries } = useAnalysisHistory();
  const latest = entries[0];

  return (
    <Link to="/" className="latest-pill" title="Open the dashboard">
      <span className="latest-pill-label">Latest analysis</span>
      {latest ? (
        <>
          <StatusChip anomaly={latest.anomaly} />
          <span className="latest-pill-time">{formatWhen(latest.at)}</span>
        </>
      ) : (
        <span className="latest-pill-empty">None yet</span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="utility" role="region" aria-label="Site information">
        <div className="container utility-inner">
          <p className="utility-tagline">
            <span className="sdg-badge">SDG 6</span>
            <span>Early-warning decision support for water quality</span>
          </p>
          <div className="utility-right">
            <HeaderClock />
            <ServiceStatus />
          </div>
        </div>
      </div>

      <header className="mainbar">
        <div className="container mainbar-inner">
          <Link to="/" className="brand" aria-label="HydroLense AI, go to dashboard">
            <span className="brand-mark">
              <LensIcon size={22} />
            </span>
            <span className="brand-name">
              HydroLense<small>AI</small>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mainbar-actions">
            <LatestResult />
            {pathname !== "/analysis" && (
              <Link className="primary-button primary-button--sm" to="/analysis">
                New analysis
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
