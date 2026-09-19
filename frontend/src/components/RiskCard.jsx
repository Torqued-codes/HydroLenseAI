export default function RiskCard({ result }) {
  if (!result) {
    return (
      <section className="card risk-card empty-risk">
        <div className="section-kicker">ANALYSIS STATUS</div>
        <div className="empty-state-icon">◌</div>
        <h3>Waiting for a water-quality reading</h3>
        <p>Run an analysis to see the anomaly status, priority and explanation here.</p>
      </section>
    );
  }

  const anomaly = result.analysis?.anomaly;
  const priority = result.risk?.priority || (anomaly ? "High" : "Normal");

  return (
    <section className={`card risk-card ${anomaly ? "risk-high" : "risk-normal"}`}>
      <div className="risk-top">
        <div>
          <div className="section-kicker">ANALYSIS STATUS</div>
          <h2>{anomaly ? "Unusual pattern detected" : "No unusual pattern detected"}</h2>
        </div>
        <div className="risk-icon">{anomaly ? "!" : "✓"}</div>
      </div>
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
    </section>
  );
}