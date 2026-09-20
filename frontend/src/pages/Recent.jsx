import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ParameterMonitor from "../components/ParameterMonitor";
import CaseSummary from "../components/CaseSummary";
import { ChatIcon, WaveIcon } from "../components/Icons";
import { useAnalysisHistory } from "../context/AnalysisHistory";
import { formatWhen } from "../utils/format";
import { mergeActivity, outsideRangeLabel, revealElement } from "../utils/activity";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "analysis", label: "Analyses" },
  { id: "question", label: "Questions" }
];

function ActivityItem({ item, selected, onSelect }) {
  const isAnalysis = item.kind === "analysis";
  const tone = isAnalysis ? (item.entry.anomaly ? "alert" : "ok") : "question";

  return (
    <button
      type="button"
      className={`activity-item activity-item--${tone} ${selected ? "is-selected" : ""}`}
      aria-current={selected ? "true" : undefined}
      onClick={() => onSelect(item.id)}
    >
      <span className="activity-icon">{isAnalysis ? <WaveIcon size={18} /> : <ChatIcon size={18} />}</span>
      <span className="activity-body">
        <span className="activity-kind">
          {isAnalysis ? "Analysis" : "Question"}
          <span className="activity-time">{formatWhen(item.at)}</span>
        </span>
        {isAnalysis ? (
          <>
            <span className="activity-title">
              {item.entry.anomaly ? "Unusual pattern" : "No unusual pattern"}, priority {item.entry.priority}
            </span>
            <span className="activity-sub">Outside range: {outsideRangeLabel(item.entry.values)}</span>
          </>
        ) : (
          <span className="activity-title activity-title--clamp">{item.question.question}</span>
        )}
      </span>
    </button>
  );
}

function QuestionDetail({ item }) {
  return (
    <section className="card question-detail" aria-labelledby="question-title">
      <div className="panel-head">
        <div>
          <h2 className="panel-title" id="question-title">Question to the assistant</h2>
          <p className="panel-sub">{formatWhen(item.at)}</p>
        </div>
      </div>
      <div className="qa-block">
        <span className="qa-label">You asked</span>
        <p className="qa-text">{item.question}</p>
      </div>
      <div className="qa-block qa-block--answer">
        <span className="answer-label">HydroLense</span>
        <p className="qa-text">{item.answer}</p>
      </div>
    </section>
  );
}

export default function Recent() {
  const { entries, questions, clearAll } = useAnalysisHistory();
  const [filter, setFilter] = useState("all");
  const [pickedId, setPickedId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const activity = useMemo(() => mergeActivity(entries, questions), [entries, questions]);
  const counts = { all: activity.length, analysis: entries.length, question: questions.length };
  const visible = filter === "all" ? activity : activity.filter((item) => item.kind === filter);
  const selected = visible.find((item) => item.id === pickedId) ?? visible[0] ?? null;

  const pick = (id) => {
    setPickedId(id);
    revealElement("activity-detail");
  };

  const clearEverything = () => {
    clearAll();
    setConfirming(false);
    setPickedId(null);
  };

  const aside =
    activity.length === 0 ? null : confirming ? (
      <div className="confirm-inline" role="group" aria-label="Confirm clearing all activity">
        <span>Clear all {activity.length} items?</span>
        <button type="button" className="ghost-button ghost-button--danger" onClick={clearEverything}>Clear</button>
        <button type="button" className="ghost-button" onClick={() => setConfirming(false)}>Keep</button>
      </div>
    ) : (
      <button type="button" className="ghost-button" onClick={() => setConfirming(true)}>Clear all activity</button>
    );

  return (
    <>
      <PageHeader
        title="Recent activity"
        description="The analyses you have run and the questions you have asked, kept on this device only. Select an item to review it."
        aside={aside}
      />

      <div className="container page-body">
        {activity.length === 0 ? (
          <section className="card empty-state empty-state--page">
            <span className="empty-state-icon"><WaveIcon size={22} /></span>
            <div>
              <h2 className="panel-title panel-title--lg">Nothing here yet</h2>
              <p>
                Analyses you run and questions you ask the assistant are listed here, newest first,
                so you can come back to any of them.
              </p>
              <Link className="primary-button" to="/analysis">Start an analysis</Link>
            </div>
          </section>
        ) : (
          <div className="recent-layout">
            <section className="card activity-card" aria-label="Activity list">
              <div className="filter-tabs" role="group" aria-label="Filter activity">
                {FILTERS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`filter-tab ${filter === option.id ? "is-active" : ""}`}
                    aria-pressed={filter === option.id}
                    onClick={() => setFilter(option.id)}
                  >
                    {option.label}
                    <span className="filter-count">{counts[option.id]}</span>
                  </button>
                ))}
              </div>

              {visible.length === 0 ? (
                <p className="panel-note">Nothing in this filter yet.</p>
              ) : (
                <ul className="activity-list">
                  {visible.map((item) => (
                    <li key={item.id}>
                      <ActivityItem item={item} selected={selected?.id === item.id} onSelect={pick} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="activity-detail" id="activity-detail">
              {selected?.kind === "analysis" && (
                <>
                  <ParameterMonitor
                    reading={selected.entry.values}
                    at={selected.entry.at}
                    title="Reading against reference ranges"
                  />
                  <CaseSummary entry={selected.entry} />
                </>
              )}
              {selected?.kind === "question" && <QuestionDetail item={selected.question} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
