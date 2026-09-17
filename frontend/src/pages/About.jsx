export default function About() {
  return (
    <div className="page about-page">
      <div className="page-heading">
        <p className="eyebrow">ABOUT AQUAGUARD AI</p>
        <h1>Responsible AI for water-quality monitoring</h1>
        <p>
          AquaGuard AI identifies unusual patterns in water-quality observations
          and provides explainable early-warning decision support.
        </p>
      </div>

      <div className="about-grid">
        <article className="info-card">
          <h2>How it works</h2>
          <ol>
            <li>Water-quality measurements are submitted.</li>
            <li>Data is validated and processed.</li>
            <li>An Isolation Forest model detects unusual patterns.</li>
            <li>Retrieved guidance supports the explanation.</li>
            <li>The system provides verification-focused next steps.</li>
          </ol>
        </article>

        <article className="info-card">
          <h2>Responsible AI</h2>
          <p>
            The anomaly model is a decision-support tool. It does not prove
            contamination and does not certify water as safe or unsafe.
            Consequential findings should be verified using appropriate
            measurements, laboratory testing, and responsible authorities.
          </p>
        </article>

        <article className="info-card">
          <h2>Primary SDG</h2>
          <p>
            Sustainable Development Goal 6 — Clean Water and Sanitation,
            with emphasis on identifying unusual water-quality patterns and
            supporting faster verification.
          </p>
        </article>
      </div>
    </div>
  );
}