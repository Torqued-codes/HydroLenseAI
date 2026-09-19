import { AlertIcon, CheckIcon, WaveIcon } from "./Icons";

export default function RiskCard({ result }) {
  if (!result) {
    return (
      <section className="card risk-card empty-risk">
        <WaveIcon size={26} className="empty-icon" />
        <span className="risk-label">Analysis status</span>
        <h3>Waiting for a water-quality reading</h3>
        <p>Run an analysis to see the anomaly status, priority and explanation here.</p>
      </section>
    );
  }

  const anomaly = result.analysis?.anomaly;
  const priority = result.risk?.priority || (anomaly ? "High" : "Normal");

  return (
    <section className={`card risk-card ${anomaly ? "risk-high" : "risk-normal"}`}>
      <div className="risk-banner">
        <span className="risk-icon">{anomaly ? <AlertIcon size={20} /> : <CheckIcon size={20} />}</span>
        <div>
          <span className="risk-label">Analysis status</span>
          <h2>{anomaly ? "Unusual pattern detected" : "No unusual pattern detected"}</h2>
        </div>
      </div>

      <div className="risk-body">
        <div className="risk-meta">
          <div>
            <span>Priority</span>
            <strong>{priority}</strong>
          </div>
          <div>
            <span>Anomaly score</span>
            <strong>{Number(result.analysis?.anomaly_score ?? 0).toFixed(3)}</strong>
          </div>
        </div>
        <p className="risk-explanation">{result.risk?.explanation}</p>
        <div className="notice">
          <strong>Decision support only.</strong> An anomaly is not proof that water is safe or unsafe. Verify unusual readings before consequential action.
        </div>
      </div>
    </section>
  );
}
