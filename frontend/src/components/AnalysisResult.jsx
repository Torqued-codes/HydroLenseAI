import RiskCard from "./RiskCard";
import ParameterCard from "./ParameterCard";

export default function AnalysisResult({ result, values }) {
  if (!result) return null;

  const analysis = result.analysis || {};

  return (
    <section className="result-section">
      <div className="result-header">
        <div>
          <p className="eyebrow">AI ANALYSIS</p>
          <h2>{analysis.anomaly ? "Unusual Pattern Detected" : "No Unusual Pattern Detected"}</h2>
        </div>
        <span className={`status-badge ${analysis.anomaly ? "status-anomaly" : "status-normal"}`}>
          {analysis.label}
        </span>
      </div>

      <RiskCard risk={result.risk} />

      <div className="parameter-grid">
        <ParameterCard label="pH" value={values.pH} icon="pH" />
        <ParameterCard label="Turbidity" value={values.turbidity_ntu} unit="NTU" icon="≈" />
        <ParameterCard label="TDS" value={values.tds_mg_l} unit="mg/L" icon="T" />
        <ParameterCard label="Temperature" value={values.temperature_c} unit="°C" icon="°" />
        <ParameterCard label="Dissolved Oxygen" value={values.dissolved_oxygen_mg_l} unit="mg/L" icon="O₂" />
        <ParameterCard label="Conductivity" value={values.conductivity_us_cm} unit="µS/cm" icon="C" />
      </div>

      <div className="explanation-box">
        <h3>Explanation</h3>
        <p>{result.explanation}</p>
      </div>

      <div className="recommendation-box">
        <h3>Recommended Actions</h3>
        <ul>
          {(result.recommendations || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="disclaimer">{result.disclaimer}</p>
    </section>
  );
}