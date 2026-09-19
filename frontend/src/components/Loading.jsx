export default function Loading({ label = "Analyzing…" }) {
  return (
    <div className="loading-inline">
      <span className="spinner"></span>
      <span>{label}</span>
    </div>
  );
}