export default function Loading({ text = "Analyzing water quality..." }) {
  return (
    <div className="loading">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}