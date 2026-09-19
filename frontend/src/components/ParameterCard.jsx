export default function ParameterCard({ label, unit, value, onChange, error }) {
  return (
    <label className={`parameter-card ${error ? "has-error" : ""}`}>
      <span className="parameter-label">{label}</span>
      <span className="parameter-input-row">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step="any"
          placeholder="0.0"
        />
        <span>{unit}</span>
      </span>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}