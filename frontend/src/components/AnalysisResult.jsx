import RiskCard from "./RiskCard";
import WaterChart from "./WaterChart";

export default function AnalysisResult({ result, values }) {
  if (!result) return <RiskCard result={null} />;

  return (
    <div className="results-stack">
      <RiskCard result={result} />
      <WaterChart values={values} />

      <section className="card">
        <div className="card-heading">
          <div>
            <div className="section-kicker">EXPLANATION</div>
            <h3>Why this result was generated</h3>
          </div>
        </div>
        <p className="explanation-text">{result.explanation}</p>
      </section>

      <section className="card">
        <div className="card-heading">
          <div>
            <div className="section-kicker">RECOMMENDED NEXT STEPS</div>
            <h3>Verification checklist</h3>
          </div>
        </div>
        <div className="recommendations">
          {(result.recommendations || []).map((item, index) => (
            <div className="recommendation" key={index}>
              <span>✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}