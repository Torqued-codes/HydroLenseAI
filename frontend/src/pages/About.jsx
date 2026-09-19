export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="eyebrow"><span>ABOUT THE PROJECT</span></div>
        <h1>A practical AI layer for water-quality monitoring.</h1>
        <p>
          AquaGuard AI combines statistical anomaly detection with retrieval-based guidance
          to turn water-quality measurements into a clear, repeatable early-warning workflow.
        </p>
      </section>

      <div className="about-grid">
        <section className="card">
          <div className="section-kicker">THE WORKFLOW</div>
          <h2>Measure → Detect → Explain → Verify</h2>
          <div className="workflow">
            {[
              ["01", "Measure", "Collect pH, turbidity, TDS, temperature, dissolved oxygen and conductivity."],
              ["02", "Detect", "The ML model checks whether the combined pattern differs from its learned baseline."],
              ["03", "Explain", "The RAG layer adds contextual guidance to make the output understandable."],
              ["04", "Verify", "Users receive practical next steps such as checking sensors or arranging testing."]
            ].map(([n, title, text]) => (
              <div className="workflow-item" key={n}>
                <span>{n}</span><div><h3>{title}</h3><p>{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="card responsible-card">
          <div className="section-kicker">RESPONSIBLE AI</div>
          <h2>Designed as decision support</h2>
          <ul>
            <li><strong>Transparent:</strong> shows anomaly status, score and explanation.</li>
            <li><strong>Human verification:</strong> unusual readings should be checked before consequential action.</li>
            <li><strong>Safety-aware:</strong> the model does not certify water as safe or unsafe.</li>
            <li><strong>Extendable:</strong> the prototype can later accept real-time IoT sensor streams.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}