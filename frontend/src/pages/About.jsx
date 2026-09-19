const STEPS = [
  ["Measure", "Collect pH, turbidity, TDS, temperature, dissolved oxygen and conductivity."],
  ["Detect", "The ML model checks whether the combined pattern differs from its learned baseline."],
  ["Explain", "The RAG layer adds contextual guidance to make the output understandable."],
  ["Verify", "Users receive practical next steps such as checking sensors or arranging testing."]
];

export default function About() {
  return (
    <div className="about-page">
      <header className="page-head about-head">
        <div>
          <h1>A practical AI layer for water-quality monitoring.</h1>
          <p>
            AquaGuard AI combines statistical anomaly detection with retrieval-based guidance
            to turn water-quality measurements into a clear, repeatable early-warning workflow.
          </p>
        </div>
      </header>

      <div className="about-grid">
        <section className="card">
          <h2 className="panel-title panel-title--lg">Measure → Detect → Explain → Verify</h2>
          <ol className="steps steps--large">
            {STEPS.map(([title, text], index) => (
              <li key={title}>
                <span className="step-num">{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="card responsible-card">
          <span className="responsible-label">Responsible AI</span>
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
