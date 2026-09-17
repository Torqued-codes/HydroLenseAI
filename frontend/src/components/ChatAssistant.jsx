import { useState } from "react";
import { sendChatMessage } from "../api/api";
import Loading from "./Loading";

export default function ChatAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();
    setMessages((m) => [...m, { role: "user", text: currentQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await sendChatMessage(currentQuestion);
      setMessages((m) => [...m, {
        role: "assistant",
        text: response.answer,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages((m) => [...m, {
        role: "assistant",
        text: `Error: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat-card">
      <div>
        <p className="eyebrow">RAG ASSISTANT</p>
        <h2>Ask about water quality</h2>
      </div>

      <div className="chat-messages">
        {!messages.length && (
          <p className="chat-empty">
            Ask a question about anomalies, verification, monitoring, or the
            project guidance.
          </p>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role === "user" ? "You" : "AquaGuard AI"}</strong>
            <p>{message.text}</p>
          </div>
        ))}

        {loading && <Loading text="Retrieving guidance..." />}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What should I do after an anomaly?"
        />
        <button className="primary-button" type="submit" disabled={loading}>
          Ask
        </button>
      </form>
    </section>
  );
}