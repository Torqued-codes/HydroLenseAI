import RangeStrip from "./RangeStrip";
import { STATUS_TEXT, assessReading } from "../utils/reference";
import { formatWhen } from "../utils/format";

export default function ParameterMonitor({ reading, at }) {
  const rows = assessReading(reading);

  return (
    <section className="card monitor" aria-labelledby="monitor-title">
      <div className="panel-head">
        <div>
          <h2 className="panel-title" id="monitor-title">Latest reading against reference ranges</h2>
          <p className="panel-sub">
            {reading
              ? `From your analysis on ${formatWhen(at)}.`
              : "No reading yet. The shaded band on each scale marks the indicative range."}
          </p>
        </div>
      </div>

      <ul className="strip-list">
        {rows.map((row) => (
          <li className="strip-row" key={row.key}>
            <div className="strip-name">
              <span className="strip-label">{row.label}</span>
              <span className="strip-range">{row.range} {row.unit}</span>
            </div>

            <RangeStrip row={row} />

            <div className="strip-reading">
              <span className="strip-value">
                {row.value === null ? "—" : row.display}
                {row.value !== null && <span className="strip-unit"> {row.unit}</span>}
              </span>
              <span className={`strip-status strip-status--${row.status}`}>{STATUS_TEXT[row.status]}</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="panel-note">
        Reference ranges are indicative and are not a safety certification. The anomaly result is a
        separate, pattern-based check, so a reading can be in range and still look unusual.
      </p>
    </section>
  );
}
