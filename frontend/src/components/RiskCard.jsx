export default function RiskCard({ risk }) {
  if (!risk) return null;

  return (
    <div className={`risk-card ${risk.priority?.toLowerCase() === "high" ? "risk-high" : "risk-routine"}`}>
      <div>
        <span className="risk-title">Priority</span>
        <h3>{risk.priority}</h3>
      </div>
      <div>
        <span className="risk-title">Status</span>
        <p>{risk.status}</p>
      </div>
      <p className="risk-explanation">{risk.explanation}</p>
    </div>
  );
}