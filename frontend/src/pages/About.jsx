import PageHeader from "../components/PageHeader";

const STEPS = [
  ["Measure", "Collect pH, turbidity, TDS, temperature, dissolved oxygen and conductivity."],
  ["Detect", "The ML model checks whether the combined pattern differs from its learned baseline."],
  ["Explain", "The RAG layer adds contextual guidance to make the output understandable."],
  ["Verify", "Users receive practical next steps such as checking sensors or arranging testing."]
];

const PRINCIPLES = [
  ["Transparent", "shows anomaly status, score and explanation."],
  ["Human verification", "unusual readings should be checked before consequential action."],
  ["Safety-aware", "the model does not certify water as safe or unsafe."],
  ["Extendable", "the prototype can later accept real-time IoT sensor streams."]
];

export default function About() {
  return (
    <>
      <PageHeader
        large
        title="A practical AI layer for water-quality monitoring."
        description="HydroLense AI combines statistical anomaly detection with retrieval-based guidance to turn water-quality measurements into a clear, repeatable early-warning workflow."
      />

      <div className="container page-body about-body">
        <section className="card">
          <h2 className="panel-title panel-title--lg">Measure → Detect → Explain → Verify</h2>
          <ol className="flow">
            {STEPS.map(([title, text], index) => (
              <li key={title}>
                <span className="flow-num">{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="card responsible-card">
          <div className="responsible-head">
            <span className="responsible-label">Responsible AI</span>
            <h2>Designed as decision support</h2>
          </div>
          <ul className="principles">
            {PRINCIPLES.map(([lead, text]) => (
              <li key={lead}>
                <strong>{lead}:</strong> {text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
