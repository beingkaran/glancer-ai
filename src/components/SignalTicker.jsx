/*
 * SignalTicker — the masthead "Signal" strip: a slow, pausable ticker of live AI
 * signals (releases, cost shifts, observability moves). The signature element of
 * the "AI Intelligence Desk" identity. Pure CSS marquee (see .signal-ticker*).
 */
const SIGNALS = [
  { b: 'GPT-5.6', t: 'ships 400K context', tag: 'up', tv: '▲ latency −18%' },
  { b: 'Datadog', t: 'LLM Observability GA', tag: 'warn', tv: '◆ pricing shift' },
  { b: 'Anthropic', t: 'Claude agents expand tool-calling' },
  { b: 'Grafana', t: 'adds native trace-to-metric correlation' },
  { b: 'OpenAI', t: 'agents API', tag: 'up', tv: '▲ tool-calls 2.1×' },
  { b: 'Dynatrace', t: 'Davis AI adds root-cause replay' },
];

export default function SignalTicker() {
  // Duplicated inline so the marquee reads continuously as it loops.
  const run = (
    <>
      {SIGNALS.map((s, i) => (
        <span key={i}>
          <b>{s.b}</b> {s.t}
          {s.tag && <span className={s.tag}> {s.tv}</span>}
        </span>
      ))}
    </>
  );

  return (
    <div className="signal-ticker" aria-label="Live AI signal feed">
      <div className="signal-ticker-inner">
        <div className="signal-ticker-label">
          <span className="signal-ticker-pulse" aria-hidden="true" />
          Signal
        </div>
        <div className="signal-ticker-track">
          <div className="signal-ticker-run">{run}{run}</div>
        </div>
      </div>
    </div>
  );
}
