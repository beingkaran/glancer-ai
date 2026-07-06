/*
 * Hero — a compact masthead band, not a full-viewport hero.
 *
 * The front page (Deep Dives + The Wire) is the real above-the-fold content;
 * this band just states the thesis in one line and gets out of the way. The
 * h1 keeps the original headline for SEO.
 */
export default function Hero() {
  return (
    <section className="masthead-band" id="hero">
      <div className="container masthead-inner">
        <div className="masthead-copy">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            AIOps · Observability · SRE
          </p>
          <h1 className="masthead-title">
            Observability intelligence, <span className="masthead-title-accent">without the vendor spin</span>
          </h1>
        </div>
        <p className="masthead-byline">Written by an engineer, not a marketing team.</p>
      </div>
    </section>
  );
}
