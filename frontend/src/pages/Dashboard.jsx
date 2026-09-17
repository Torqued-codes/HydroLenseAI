import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterInput from "../components/WaterInput";
import AnalysisResult from "../components/AnalysisResult";
import ChatAssistant from "../components/ChatAssistant";
import Loading from "../components/Loading";
import { analyzeWaterQuality } from "../api/api";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleAnalysis(input) {
    setLoading(true);
    setError("");
    setValues(input);

    try {
      const response = await analyzeWaterQuality(input);
      setResult(response);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page dashboard-page">
      <section className="hero">
        <div>
          <p className="eyebrow">SDG 6 • CLEAN WATER AND SANITATION</p>
          <h1>AquaGuard AI</h1>
          <p className="hero-text">
            Water-quality anomaly detection and explainable early-warning
            decision support.
          </p>
          <button className="secondary-button" onClick={() => navigate("/about")}>
            Learn About the System
          </button>
        </div>
        <div className="hero-water">💧</div>
      </section>

      <WaterInput onSubmit={handleAnalysis} loading={loading} />

      {loading && <Loading />}

      {error && <div className="error-box">{error}</div>}

      {result && values && <AnalysisResult result={result} values={values} />}

      <ChatAssistant />
    </div>
  );
}