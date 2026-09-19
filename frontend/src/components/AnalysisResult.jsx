import RiskCard from "./RiskCard";
import WaterChart from "./WaterChart";
import { CheckIcon } from "./Icons";

export default function AnalysisResult({ result, values }) {
  if (!result) return <RiskCard result={null} />;

  return (
    <div className="results-stack">
      <RiskCard result={result} />
      <WaterChart values={values} />

      <section className="card result-detail">
        <div className="detail-block">
          <h3 className="panel-title">Why this result was generated</h3>
          <p className="explanation-text">{result.explanation}</p>
        </div>

        <div className="detail-block">
          <h3 className="panel-title">Verification checklist</h3>
          <p className="panel-sub">Recommended next steps</p>
          <ul className="checklist">
            {(result.recommendations || []).map((item, index) => (
              <li key={index}>
                <CheckIcon size={18} className="checklist-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
