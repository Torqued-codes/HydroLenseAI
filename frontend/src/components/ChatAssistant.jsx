import { useState } from "react";
import { askAssistant } from "../api/api";
import Loading from "./Loading";

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card assistant-card">
      <div className="assistant-header">
        <div className="assistant-avatar">✦</div>
        <div>
          <div className="section-kicker">RAG ASSISTANT</div>
          <h2>Ask about water quality</h2>
          <p>Get guidance about anomalies, verification and monitoring.</p>
        </div>
      </div>

      <form className="chat-form" onSubmit={ask}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What should I do after an anomaly is detected?"
        />
        <button className="primary-button" disabled={loading}>
          {loading ? <Loading label="Asking" /> : "Ask"}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {answer && (
        <div className="chat-answer">
          <span className="answer-label">AquaGuard</span>
          <p>{answer}</p>
        </div>
      )}
    </section>
  );
}