import { Link, NavLink } from "react-router-dom";
import { DropIcon } from "./Icons";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/analysis", label: "Analysis" },
  { to: "/about", label: "About" }
];

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" aria-label="AquaGuard AI, go to dashboard">
          <span className="brand-mark">
            <DropIcon size={18} />
          </span>
          <span className="brand-name">
            AquaGuard<small>AI</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="status-pill">
          <span className="status-dot" aria-hidden="true"></span>
          System ready
        </div>
      </div>
    </header>
  );
}
