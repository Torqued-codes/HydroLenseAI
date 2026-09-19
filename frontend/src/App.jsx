import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import About from "./pages/About";

function Brand() {
  return (
    <NavLink to="/" className="brand">
      <span className="brand-mark">◉</span>
      <span>
        <strong>AquaGuard</strong>
        <small>AI</small>
      </span>
    </NavLink>
  );
}

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Brand />
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/analysis" className={({ isActive }) => isActive ? "active" : ""}>Analysis</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>
        </nav>
        <div className="status-pill"><span></span> System ready</div>
      </header>

      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>© 2026 AquaGuard AI</span>
        <span>SDG 6 · Clean Water & Sanitation</span>
      </footer>
    </div>
  );
}

export default App;