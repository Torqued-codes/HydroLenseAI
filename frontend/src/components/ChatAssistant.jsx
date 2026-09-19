import { useState } from "react";
import { askAssistant } from "../api/api";
import { friendlyError } from "../utils/format";
import Loading from "./Loading";
import { ChatIcon } from "./Icons";

export default function ChatAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ask = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await askAssistant(question.trim());
      setAnswer(data.answer || data.response || data.message || JSON.stringify(data));
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card assistant-card">
      <div className="assistant-header">
        <span className="assistant-avatar"><ChatIcon size={18} /></span>
        <div>
          <h2 className="panel-title panel-title--lg">Ask about water quality</h2>
          <p className="panel-sub">Get guidance about anomalies, verification and monitoring.</p>
        </div>
      </div>

      <form className="chat-form" onSubmit={ask}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What should I do after an anomaly is detected?"
          aria-label="Your question about water quality"
        />
        <button className="primary-button" disabled={loading}>
          {loading ? <Loading label="Asking" /> : "Ask"}
        </button>
      </form>

      {error && <div className="error-box" role="alert">{error}</div>}
      {answer && (
        <div className="chat-answer" aria-live="polite">
          <span className="answer-label">HydroLense</span>
          <p>{answer}</p>
        </div>
      )}
    </section>
  );
}
