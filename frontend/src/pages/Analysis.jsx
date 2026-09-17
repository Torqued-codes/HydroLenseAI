import { useState } from "react";
import WaterInput from "../components/WaterInput";
import AnalysisResult from "../components/AnalysisResult";
import WaterChart from "../components/WaterChart";
import { analyzeWaterQuality } from "../api/api";

export default function Analysis() {
  const [result, setResult] = useState(null);
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalysis(input) {
    setLoading(true);
    setError("");
    try {
      const response = await analyzeWaterQuality(input);
      setValues(input);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const chartData = values
    ? Object.entries(values).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="page analysis-page">
      <div className="page-heading">
        <p className="eyebrow">DETAILED ANALYSIS</p>
        <h1>Water Quality Analysis</h1>
        <p>Submit measurements to run the AquaGuard anomaly detector.</p>
      </div>

      <WaterInput onSubmit={handleAnalysis} loading={loading} />
      {error && <div className="error-box">{error}</div>}

      {values && (
        <section className="chart-card">
          <h2>Submitted Measurements</h2>
          <WaterChart data={chartData} />
        </section>
      )}

      {result && values && <AnalysisResult result={result} values={values} />}
    </div>
  );
}