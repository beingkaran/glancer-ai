/*
 * SignalTicker — the masthead "Signal" strip: a slow, pausable ticker of live AI
 * signals (releases, cost shifts, observability moves). The signature element of
 * the "AI Intelligence Desk" identity. Pure CSS marquee (see .signal-ticker*).
 */
import { Link } from 'react-router-dom';

const SIGNALS = [
  { b: 'GPT-5.6', t: 'ships 400K context', tag: 'up', tv: '▲ latency −18%', to: '/blog/openai-gpt-56-sol-cerebras-750-tokens-second' },
  { b: 'Datadog', t: 'LLM Observability GA', tag: 'warn', tv: '◆ pricing shift', to: '/blog/datadog-full-stack-observability-2026' },
  { b: 'Anthropic', t: 'Claude agents expand tool-calling', to: '/topic/anthropic' },
  { b: 'Grafana', t: 'adds native trace-to-metric correlation', to: '/blog/distributed-tracing-explained' },
  { b: 'OpenAI', t: 'agents API', tag: 'up', tv: '▲ tool-calls 2.1×', to: '/topic/ai-agents' },
  { b: 'Dynatrace', t: 'Davis AI adds root-cause replay', to: '/topic/apm' },
];

function signalLabel({ b, t, tag, tv }) {
  const extra = tag ? ` ${tv}` : '';
  return `${b}: ${t}${extra}`;
}

function SignalItem({ signal }) {
  const body = (
    <>
      <b>{signal.b}</b> {signal.t}
      {signal.tag && <span className={signal.tag}> {signal.tv}</span>}
    </>
  );

  if (signal.to) {
    return (
      <Link
        to={signal.to}
        className="signal-ticker-item"
        aria-label={signalLabel(signal)}
      >
        {body}
      </Link>
    );
  }

  if (signal.href) {
    return (
      <a
        href={signal.href}
        className="signal-ticker-item"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={signalLabel(signal)}
      >
        {body}
      </a>
    );
  }

  return <span className="signal-ticker-item">{body}</span>;
}

export default function SignalTicker() {
  // Duplicated inline so the marquee reads continuously as it loops.
  const run = SIGNALS.map((s, i) => <SignalItem key={i} signal={s} />);

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
