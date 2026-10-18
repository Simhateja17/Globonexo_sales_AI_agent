// One numbered section of a long-form legal page (/privacy, /terms).
export default function LegalSection({ id, n, title, children }) {
  return (
    <section className="privacy-sec" id={id}>
      <div className="privacy-sec-n">{n}</div>
      <div className="privacy-sec-body">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
