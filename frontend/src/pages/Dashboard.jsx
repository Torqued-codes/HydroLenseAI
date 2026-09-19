import { useState } from "react";
import { Link } from "react-router-dom";
import { analyzeWater } from "../api/api";
import WaterInput from "../components/WaterInput";
import AnalysisResult from "../components/AnalysisResult";
import ChatAssistant from "../components/ChatAssistant";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [values, setValues] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (payload, rawValues) => {
    setError("");
    try {
      const data = await analyzeWater(payload);
      setResult(data);
      setValues(rawValues);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span>SDG 6</span> · CLEAN WATER & SANITATION</div>
          <h1>Spot unusual water patterns <em>before</em> they become surprises.</h1>
          <p>AI-powered anomaly detection and explainable early-warning decision support for water-quality monitoring.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/analysis">Open analysis <span>→</span></Link>
            <Link className="text-button" to="/about">How it works</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb orb-one"></div>
          <div className="orb orb-two"></div>
          <div className="hero-panel">
            <div className="mini-label">AQUAGUARD SIGNAL</div>
            <div className="signal-line"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div className="signal-value">EARLY WARNING</div>
            <p>Pattern-based monitoring · Explainable output</p>
          </div>
        </div>
      </section>

      <div className="stat-strip">
        <div><strong>6</strong><span>water parameters</span></div>
        <div><strong>ML</strong><span>anomaly detection</span></div>
        <div><strong>RAG</strong><span>guidance layer</span></div>
        <div><strong>SDG 6</strong><span>primary alignment</span></div>
      </div>

      {error && <div className="error-box page-error">{error}</div>}

      <section className="workspace">
        <div>
          <WaterInput onAnalyze={handleAnalyze} />
          <ChatAssistant />
        </div>
        <div>
          <AnalysisResult result={result} values={values} />
        </div>
      </section>
    </>
  );
}