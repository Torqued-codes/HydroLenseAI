import { AlertIcon, CheckIcon } from "./Icons";

export default function StatusChip({ anomaly }) {
  return (
    <span className={`chip ${anomaly ? "chip-alert" : "chip-ok"}`}>
      {anomaly ? <AlertIcon size={14} /> : <CheckIcon size={14} />}
      {anomaly ? "Unusual pattern" : "No unusual pattern"}
    </span>
  );
}
