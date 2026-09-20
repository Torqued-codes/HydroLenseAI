import StatusChip from "./StatusChip";
import { CheckIcon } from "./Icons";
import { formatWhen } from "../utils/format";
import { outsideRangeLabel } from "../utils/activity";

/* The written result for one logged analysis: status, priority, score, explanation, checklist. */
export default function CaseSummary({ entry }) {
  if (!entry) return null;

  const recommendations = entry.recommendations || [];
  const hasDetails = Boolean(entry.riskExplanation || entry.explanation || recommendations.length);

  return (
    <section className="card case-summary" aria-labelledby="case-title">
      <div className="panel-head">
        <div>
          <h2 className="panel-title" id="case-title">Result for this analysis</h2>
          <p className="panel-sub">{formatWhen(entry.at)}</p>
        </div>
        <StatusChip anomaly={entry.anomaly} />
      </div>

      <div className="case-meta">
        <div>
          <span>Priority</span>
          <strong className={entry.anomaly ? "case-meta-alert" : ""}>{entry.priority}</strong>
        </div>
        <div>
          <span>Anomaly score</span>
          <strong>{Number(entry.score).toFixed(3)}</strong>
        </div>
        <div>
          <span>Outside range</span>
          <strong className="case-meta-text">{outsideRangeLabel(entry.values)}</strong>
        </div>
      </div>

      {hasDetails ? (
        <div className="case-grid">
          <div className="case-block">
            <h3 className="case-heading">Why this result was generated</h3>
            {entry.riskExplanation && <p className="case-text">{entry.riskExplanation}</p>}
            {entry.explanation && <p className="case-text">{entry.explanation}</p>}
          </div>

          {recommendations.length > 0 && (
            <div className="case-block">
              <h3 className="case-heading">Verification checklist</h3>
              <ul className="checklist">
                {recommendations.map((item, index) => (
                  <li key={index}>
                    <CheckIcon size={18} className="checklist-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="panel-note">
          The written explanation was not saved for this older entry. Analyses run from now on keep it.
        </p>
      )}

      <div className="notice">
        <strong>Decision support only.</strong> An anomaly is not proof that water is safe or unsafe. Verify unusual readings before consequential action.
      </div>
    </section>
  );
}
