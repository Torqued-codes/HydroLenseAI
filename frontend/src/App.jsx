import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Recent from "./pages/Recent";
import About from "./pages/About";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <Navbar />

      <main className="page-main" id="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026 HydroLense AI</span>
          <span>SDG 6 · Clean Water & Sanitation</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
