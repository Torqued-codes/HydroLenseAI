export default function PageHeader({ title, description, aside, large = false }) {
  return (
    <section className={`page-band ${large ? "page-band--large" : ""}`}>
      <div className="container page-band-inner">
        <div className="page-band-copy">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {aside && <div className="page-band-aside">{aside}</div>}
      </div>
    </section>
  );
}
