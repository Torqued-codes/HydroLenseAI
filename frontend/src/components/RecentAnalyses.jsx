import { useState } from "react";
import { Link } from "react-router-dom";
import StatusChip from "./StatusChip";
import { WaveIcon } from "./Icons";
import { outsideRangeLabel } from "../utils/activity";
import { formatWhen } from "../utils/format";

const VISIBLE = 5;

export default function RecentAnalyses({ entries, selectedId, onSelect, onClear }) {
  const [confirming, setConfirming] = useState(false);
  const shown = entries.slice(0, VISIBLE);

  const clear = () => {
    onClear();
    setConfirming(false);
  };

  return (
    <section className="card ledger" aria-labelledby="ledger-title">
      <div className="panel-head">
        <div>
          <h2 className="panel-title" id="ledger-title">Recent analyses</h2>
          <p className="panel-sub">Logged on this device only. Nothing here is uploaded. Select a row to see that analysis above.</p>
        </div>

        {entries.length > 0 &&
          (confirming ? (
            <div className="confirm-inline" role="group" aria-label="Confirm clearing history">
              <span>Clear {entries.length === 1 ? "this entry" : `all ${entries.length}`}?</span>
              <button type="button" className="ghost-button ghost-button--danger" onClick={clear}>Clear</button>
              <button type="button" className="ghost-button" onClick={() => setConfirming(false)}>Keep</button>
            </div>
          ) : (
            <button type="button" className="ghost-button" onClick={() => setConfirming(true)}>Clear history</button>
          ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon"><WaveIcon size={22} /></span>
          <div>
            <h3>No analyses yet</h3>
            <p>
              Run an analysis and it is logged here with its result and score. On the Analysis page,
              Load demo fills in a sample reading so you can try it.
            </p>
            <Link className="primary-button" to="/analysis">Start an analysis</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Result</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Score</th>
                  <th scope="col">Outside range</th>
                  <th scope="col"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((entry) => {
                  const isSelected = entry.id === selectedId;
                  return (
                  <tr
                    key={entry.id}
                    className={isSelected ? "is-selected" : ""}
                    onClick={() => onSelect(entry.id)}
                  >
                    <td data-label="Time">{formatWhen(entry.at)}</td>
                    <td data-label="Result"><StatusChip anomaly={entry.anomaly} /></td>
                    <td data-label="Priority">{entry.priority}</td>
                    <td data-label="Score" className="num">{Number(entry.score).toFixed(3)}</td>
                    <td data-label="Outside range">{outsideRangeLabel(entry.values)}</td>
                    <td data-label="Details" className="cell-action">
                      <button type="button" className="row-view" aria-current={isSelected ? "true" : undefined}>
                        {isSelected ? "Shown above" : "View details"}
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="panel-note">
            {entries.length > VISIBLE ? `Showing the latest ${VISIBLE} of ${entries.length} analyses. ` : ""}
            <Link className="inline-link" to="/recent">Open everything in Recent</Link>
          </p>
        </>
      )}
    </section>
  );
}
