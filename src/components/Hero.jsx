/*
 * Hero — a compact masthead band, not a full-viewport hero.
 *
 * The front page (Deep Dives + The Wire) is the real above-the-fold content;
 * this band just carries the byline and gets out of the way.
 */
export default function Hero() {
  return (
    <section className="masthead-band" id="hero">
      <div className="container masthead-inner">
        <p className="masthead-byline">Written by an engineer, not a marketing team.</p>
      </div>
    </section>
  );
}
