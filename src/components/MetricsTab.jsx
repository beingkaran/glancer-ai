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

const STATS = [
  { value: '$47B',  label: 'Q1 2026 VC Funding', delta: '+38% YoY' },
  { value: '2,400+', label: 'Foundation Models', delta: '+180 since Jan' },
  { value: '72.5%', label: 'SWE-Bench (SOTA)', delta: '↑ from 68.1%' },
  { value: '34%',   label: 'Fortune 500 AI Adoption', delta: '+9pp YoY', down: false },
];

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

export default function MetricsTab() {
  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header" style={{ marginBottom: 28 }}>
          <div>
            <p className="section-label">Live Dashboard</p>
            <h2 className="section-title-lg">AI Industry Metrics</h2>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Updated: Jun 25, 2026</span>
        </div>

        {/* KPI strip */}
        <div className="metrics-grid">
          {STATS.map(s => (
            <div key={s.label} className="metric-stat">
              <div className="metric-stat-value">{s.value}</div>
              <div className="metric-stat-label">{s.label}</div>
              <div className={`metric-stat-delta${s.down ? ' down' : ''}`}>{s.delta}</div>
            </div>
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
          </div>
          <div className="chart-card">
            <div className="chart-title">AI Adoption by Sector</div>
            <div className="chart-subtitle">% share of enterprise AI deployments</div>
            <div className="chart-wrap">
              <Doughnut data={adoptionData()} options={doughnutOpts} />
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
