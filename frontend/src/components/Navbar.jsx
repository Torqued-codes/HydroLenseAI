import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="brand">
          <span className="brand-icon">💧</span>
          AquaGuard AI
        </NavLink>

        <nav>
          <NavLink to="/" end className="nav-link">Dashboard</NavLink>
          <NavLink to="/analysis" className="nav-link">Analysis</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </nav>
      </div>
    </header>
  );
}