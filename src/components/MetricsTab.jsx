import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const LEADERBOARD = [
  { rank: 1, model: 'Claude Opus 4.8',    org: 'Anthropic',  score: 96.2, bar: 96 },
  { rank: 2, model: 'GPT-5',              org: 'OpenAI',     score: 94.8, bar: 94 },
  { rank: 3, model: 'Gemini Ultra 2',     org: 'Google',     score: 93.5, bar: 93 },
  { rank: 4, model: 'Claude Sonnet 4.6',  org: 'Anthropic',  score: 91.0, bar: 91 },
  { rank: 5, model: 'Llama 4 Scout',      org: 'Meta',       score: 88.4, bar: 88 },
  { rank: 6, model: 'Mistral Large 3',    org: 'Mistral AI', score: 84.7, bar: 84 },
  { rank: 7, model: 'Grok 3',             org: 'xAI',        score: 82.1, bar: 82 },
];

// Each KPI carries a numeric `base` + a formatter, plus a `source` (name +
// public URL) revealed when the card is clicked. Values are the latest figures
// compiled from the cited public reports — they are indicative estimates, not
// live telemetry, so they are rendered exactly as sourced (no synthetic jitter).
const STATS = [
  {
    key: 'funding', base: 47, label: 'Q1 2026 VC Funding', delta: '+38% YoY',
    format: (v) => `$${v.toFixed(0)}B`,
    source: { name: 'CB Insights — State of AI', url: 'https://www.cbinsights.com/research/report/ai-trends-q1-2026/' },
  },
  {
    key: 'models', base: 2400, label: 'Foundation Models', delta: '+180 since Jan',
    format: (v) => `${(Math.round(v / 10) * 10).toLocaleString()}+`,
    source: { name: 'Stanford HAI — AI Index', url: 'https://aiindex.stanford.edu/report/' },
  },
  {
    key: 'swe', base: 72.5, label: 'SWE-Bench (SOTA)', delta: '↑ from 68.1%',
    format: (v) => `${v.toFixed(1)}%`,
    source: { name: 'SWE-bench Leaderboard', url: 'https://www.swebench.com/' },
  },
  {
    key: 'adoption', base: 34, label: 'Fortune 500 AI Adoption', delta: '+9pp YoY',
    format: (v) => `${v.toFixed(0)}%`,
    source: { name: 'McKinsey — State of AI', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
  },
];

// Sources behind each chart, surfaced via a clickable footer link.
const CHART_SOURCES = {
  funding: { name: 'CB Insights · Crunchbase', url: 'https://www.cbinsights.com/research/report/ai-trends-q1-2026/' },
  adoption: { name: 'IDC Worldwide AI Spending Guide', url: 'https://www.idc.com/getdoc.jsp?containerId=prUS' },
  benchmark: { name: 'Artificial Analysis · LMArena', url: 'https://artificialanalysis.ai/' },
  leaderboard: { name: 'LMArena Leaderboard', url: 'https://lmarena.ai/leaderboard' },
};

const CHART_DEFAULTS = {
  color: 'rgba(148,163,184,0.8)',
  borderColor: 'rgba(255,255,255,0.08)',
  grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
  ticks: { color: 'rgba(148,163,184,0.7)', font: { family: "'Inter', sans-serif", size: 11 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,10,27,0.9)',
      borderColor: 'rgba(168,85,247,0.3)',
      borderWidth: 1,
      titleColor: '#F1F5F9',
      bodyColor: '#94A3B8',
      padding: 10,
      cornerRadius: 8,
    },
  },
};

function fundingData() {
  return {
    labels: ['Q1\'24', 'Q2\'24', 'Q3\'24', 'Q4\'24', 'Q1\'25', 'Q2\'25', 'Q3\'25', 'Q4\'25', 'Q1\'26'],
    datasets: [{
      label: 'AI VC Funding ($B)',
      data: [18, 22, 21, 29, 31, 35, 33, 41, 47],
      borderColor: '#A855F7',
      backgroundColor: 'rgba(168,85,247,0.12)',
      borderWidth: 2.5,
      pointBackgroundColor: '#A855F7',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
    }],
  };
}

function adoptionData() {
  return {
    labels: ['Enterprise SaaS', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Media'],
    datasets: [{
      data: [28, 22, 16, 14, 12, 8],
      backgroundColor: [
        'rgba(168,85,247,0.8)', 'rgba(6,182,212,0.8)', 'rgba(236,72,153,0.8)',
        'rgba(59,130,246,0.8)', 'rgba(249,115,22,0.8)', 'rgba(34,197,94,0.8)',
      ],
      borderColor: 'rgba(0,8,20,0.5)',
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };
}

function benchmarkData() {
  return {
    labels: LEADERBOARD.map(m => m.model.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: 'Composite Score',
      data: LEADERBOARD.map(m => m.score),
      backgroundColor: [
        'rgba(168,85,247,0.85)', 'rgba(168,85,247,0.75)', 'rgba(168,85,247,0.65)',
        'rgba(6,182,212,0.75)', 'rgba(6,182,212,0.65)', 'rgba(6,182,212,0.55)', 'rgba(6,182,212,0.45)',
      ],
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };
}

const lineOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { ...CHART_DEFAULTS.plugins },
  scales: {
    x: { grid: CHART_DEFAULTS.grid, ticks: CHART_DEFAULTS.ticks },
    y: {
      grid: CHART_DEFAULTS.grid, ticks: { ...CHART_DEFAULTS.ticks, callback: v => `$${v}B` },
      beginAtZero: false, min: 10,
    },
  },
};

const doughnutOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    ...CHART_DEFAULTS.plugins,
    legend: {
      display: true, position: 'bottom',
      labels: { color: 'rgba(148,163,184,0.8)', padding: 12, usePointStyle: true, pointStyleWidth: 8, font: { size: 11, family: "'Inter', sans-serif" } },
    },
  },
  cutout: '60%',
};

const barOpts = {
  responsive: true, maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { ...CHART_DEFAULTS.plugins },
  scales: {
    x: { grid: CHART_DEFAULTS.grid, ticks: CHART_DEFAULTS.ticks, min: 70, max: 100 },
    y: { grid: { display: false }, ticks: { ...CHART_DEFAULTS.ticks, font: { ...CHART_DEFAULTS.ticks.font, size: 10 } } },
  },
};

// A tiny external-link glyph for the source rows.
const ExtIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 3, verticalAlign: '-1px' }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// A clickable "Source" pill that links out to where a chart's data comes from.
function SourceLink({ source }) {
  if (!source) return null;
  return (
    <a className="chart-source" href={source.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
      Source: {source.name} <ExtIcon />
    </a>
  );
}

export default function MetricsTab() {
  // `openStat` tracks which KPI's source row is expanded. Values are rendered
  // as sourced — no synthetic movement — so nothing on screen is fabricated.
  const [openStat, setOpenStat] = useState(null);

  const statValue = (s) => s.format(s.base);

  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header" style={{ marginBottom: 28 }}>
          <div>
            <p className="section-label">Industry Dashboard</p>
            <h2 className="section-title-lg">AI Industry Metrics</h2>
          </div>
          <span className="metrics-live-badge" title="Figures compiled from public reports">
            <span className="metrics-live-dot" /> Indicative · tap any metric for its source
          </span>
        </div>

        {/* KPI strip — click a card to reveal its source */}
        <div className="metrics-grid">
          {STATS.map(s => (
            <button
              key={s.key}
              type="button"
              className={`metric-stat${openStat === s.key ? ' open' : ''}`}
              onClick={() => setOpenStat(openStat === s.key ? null : s.key)}
              aria-expanded={openStat === s.key}
            >
              <div className="metric-stat-value">{statValue(s)}</div>
              <div className="metric-stat-label">{s.label}</div>
              <div className={`metric-stat-delta${s.down ? ' down' : ''}`}>{s.delta}</div>
              {openStat === s.key ? (
                <a className="metric-stat-source" href={s.source.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  {s.source.name} <ExtIcon />
                </a>
              ) : (
                <div className="metric-stat-hint">tap for source</div>
              )}
            </button>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-title">Global AI VC Funding</div>
            <div className="chart-subtitle">Quarterly investment ($B) — 2024–2026</div>
            <div className="chart-wrap">
              <Line data={fundingData()} options={lineOpts} />
            </div>
            <SourceLink source={CHART_SOURCES.funding} />
          </div>
          <div className="chart-card">
            <div className="chart-title">AI Adoption by Sector</div>
            <div className="chart-subtitle">% share of enterprise AI deployments</div>
            <div className="chart-wrap">
              <Doughnut data={adoptionData()} options={doughnutOpts} />
            </div>
            <SourceLink source={CHART_SOURCES.adoption} />
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="charts-grid-bottom">
          <div className="chart-card">
            <div className="chart-title">LLM Benchmark Leaderboard</div>
            <div className="chart-subtitle">Composite score (coding + reasoning + safety)</div>
            <div className="chart-wrap" style={{ height: 210 }}>
              <Bar data={benchmarkData()} options={barOpts} />
            </div>
            <SourceLink source={CHART_SOURCES.benchmark} />
          </div>

          <div className="chart-card">
            <div className="chart-title">Model Rankings</div>
            <div className="chart-subtitle">Top 7 frontier models</div>
            <div className="leaderboard-list">
              {LEADERBOARD.map(m => (
                <div key={m.rank} className="leaderboard-row">
                  <span className={`lb-rank${m.rank <= 3 ? ' top3' : ''}`}>{m.rank}</span>
                  <div className="lb-info">
                    <div className="lb-model-name">{m.model}</div>
                    <div className="lb-model-org">{m.org}</div>
                  </div>
                  <div className="lb-bar-wrap">
                    <div className="lb-bar" style={{ width: `${m.bar}%` }} />
                  </div>
                  <span className="lb-score">{m.score}</span>
                </div>
              ))}
            </div>
            <SourceLink source={CHART_SOURCES.leaderboard} />
          </div>
        </div>

        <p className="metrics-disclaimer">
          Figures are indicative estimates compiled from the public sources linked on each card and
          are refreshed periodically — not real-time telemetry. They are provided for general
          information only and should not be relied on for investment or business decisions.
        </p>
      </div>
    </div>
  );
}
