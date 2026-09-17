export default function ParameterCard({ label, value, unit, icon }) {
  return (
    <div className="parameter-card">
      <div className="parameter-icon">{icon}</div>
      <div>
        <p className="parameter-label">{label}</p>
        <strong className="parameter-value">{value ?? "—"}</strong>
        {unit && <span className="parameter-unit">{unit}</span>}
      </div>
    </div>
  );
}