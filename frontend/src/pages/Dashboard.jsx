import { useState } from "react";
import { Link } from "react-router-dom";
import CaseSummary from "../components/CaseSummary";
import ChatAssistant from "../components/ChatAssistant";
import PageHeader from "../components/PageHeader";
import ParameterMonitor from "../components/ParameterMonitor";
import RecentAnalyses from "../components/RecentAnalyses";
import StatusChip from "../components/StatusChip";
import { CheckIcon } from "../components/Icons";
import { useAnalysisHistory } from "../context/AnalysisHistory";
import { PARAMS } from "../utils/validation";
import { assessReading, isOutside } from "../utils/reference";
import { formatWhen } from "../utils/format";
import { revealElement } from "../utils/activity";

const FLAG_STEPS = [
  "Measure the same sample again to rule out a handling error or a sensor glitch.",
  "Check the sensor: calibration date, fouling and probe placement.",
  "Compare with a second instrument or a laboratory test before acting.",
  "Record the reading with its time and location so the trend can be reviewed."
];

const WORKFLOW = [
  ["Measure", "Enter pH, turbidity, TDS, temperature, dissolved oxygen and conductivity."],
  ["Detect", "The model compares the combination of readings with its learned baseline."],
  ["Explain", "Retrieved guidance turns the result into plain-language reasons."],
  ["Verify", "Follow the checklist before taking any consequential action."]
];

function SummaryBar({ entries }) {
  const latest = entries[0] ?? null;
  const flagged = entries.filter((entry) => entry.anomaly).length;
  const outside = latest
    ? assessReading(latest.values).filter((row) => isOutside(row.status)).map((row) => row.label)
    : [];

  return (
    <section className="kpi-bar" aria-label="Summary">
      <div className="kpi">
        <span className="kpi-label">Latest result</span>
        <div className="kpi-value">
          {latest ? <StatusChip anomaly={latest.anomaly} /> : <span className="kpi-empty">No analysis yet</span>}
        </div>
        <span className="kpi-note">
          {latest ? `${formatWhen(latest.at)}, priority ${latest.priority}` : "Run one from the Analysis page."}
        </span>
      </div>

      <div className="kpi">
        <span className="kpi-label">Analyses run</span>
        <div className="kpi-value">{entries.length}</div>
        <span className="kpi-note">Kept on this device</span>
      </div>

      <div className="kpi">
        <span className="kpi-label">Flagged as unusual</span>
        <div className="kpi-value">{flagged}</div>
        <span className="kpi-note">
          {entries.length ? `${Math.round((flagged / entries.length) * 100)}% of analyses` : "Nothing logged yet"}
        </span>
      </div>

      <div className="kpi">
        <span className="kpi-label">Outside indicative range</span>
        <div className="kpi-value">
          {latest ? (
            <>
              {outside.length}
              <span className="kpi-unit"> of {PARAMS.length}</span>
            </>
          ) : (
            "—"
          )}
        </div>
        <span className="kpi-note">
          {latest ? (outside.length ? outside.join(", ") : "Every parameter is in range") : "Based on your latest reading"}
        </span>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { entries, clear } = useAnalysisHistory();
  const latest = entries[0] ?? null;

  // Which analysis the panels show: the latest one by default, or a row the user picked.
  const [pickedId, setPickedId] = useState(null);
  const shown = entries.find((entry) => entry.id === pickedId) ?? latest;
  const showingLatest = shown === latest;

  const pick = (id) => {
    setPickedId(id);
    revealElement("reading-monitor");
  };

  return (
    <>
      <PageHeader
        title="Water quality overview"
        description="Your recent analyses, checked against indicative reference ranges."
        aside={
          <ul className="legend" aria-label="Colour key">
            <li><span className="legend-swatch legend-swatch--ok"></span>In range</li>
            <li><span className="legend-swatch legend-swatch--watch"></span>Outside indicative range</li>
            <li><span className="legend-swatch legend-swatch--alert"></span>Unusual pattern from the model</li>
          </ul>
        }
      />

      <div className="container page-body">
        <SummaryBar entries={entries} />

        <div className="dash-grid">
          <div className="dash-main">
            <ParameterMonitor
              reading={shown?.values}
              at={shown?.at}
              title={showingLatest ? undefined : "Reading against reference ranges"}
              subtitle={showingLatest ? undefined : `Showing your analysis from ${formatWhen(shown.at)}, not the latest one.`}
              action={
                showingLatest ? null : (
                  <button type="button" className="ghost-button" onClick={() => setPickedId(null)}>
                    Back to latest
                  </button>
                )
              }
            />
            <CaseSummary entry={shown} />
            <RecentAnalyses entries={entries} selectedId={shown?.id} onSelect={pick} onClear={clear} />
          </div>

          <aside className="dash-side" aria-label="Guidance">
            <ChatAssistant />

            <div className="dash-side-notes">
              <section className="side-section">
                <h2 className="panel-title">When a reading is flagged</h2>
                <ul className="checklist">
                  {FLAG_STEPS.map((step) => (
                    <li key={step}>
                      <CheckIcon size={18} className="checklist-icon" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="side-section">
                <h2 className="panel-title">How HydroLense works</h2>
                <ol className="steps">
                  {WORKFLOW.map(([title, text], index) => (
                    <li key={title}>
                      <span className="step-num">{index + 1}</span>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </li>
                  ))}
                </ol>
                <Link className="text-button" to="/about">Read more about the approach</Link>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
