import { bandPercent, positionPercent } from "../utils/reference";

/*
 * A calibrated scale for one parameter: shaded band = indicative range,
 * marker = the reading. The pH strip uses indicator-paper colours.
 */
export default function RangeStrip({ row }) {
  const { start, end } = bandPercent(row.key);
  const hasValue = row.value !== null;
  const position = hasValue ? positionPercent(row.key, row.value) : null;
  const isPh = row.key === "pH";

  const description = hasValue
    ? `${row.label} ${row.display} ${row.unit}. Indicative range ${row.range} ${row.unit}.`
    : `${row.label}: no reading yet. Indicative range ${row.range} ${row.unit}.`;

  return (
    <div className="range-strip-wrap" role="img" aria-label={description}>
      <div className={`range-strip ${isPh ? "range-strip--ph" : ""}`}>
        <span className="range-band" style={{ left: `${start}%`, width: `${end - start}%` }} />
        {hasValue && (
          <span className={`range-marker range-marker--${row.status}`} style={{ left: `${position}%` }} />
        )}
      </div>
      <div className="range-ticks" style={{ "--ticks": row.ticks }} />
      <div className="range-scale">
        <span>{row.scaleMin}</span>
        <span>{row.scaleMax}</span>
      </div>
    </div>
  );
}
