import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const LEADERBOARD = [
  { rank: 1, model: 'Claude Opus 4.8',   org: 'Anthropic',  score: 96.2, bar: 96 },
  { rank: 2, model: 'GPT-5',             org: 'OpenAI',     score: 94.8, bar: 94 },
  { rank: 3, model: 'Gemini Ultra 2',    org: 'Google',     score: 93.5, bar: 93 },
  { rank: 4, model: 'Claude Sonnet 4.6', org: 'Anthropic',  score: 91.0, bar: 91 },
  { rank: 5, model: 'Llama 4 Scout',     org: 'Meta',       score: 88.4, bar: 88 },
  { rank: 6, model: 'Mistral Large 3',   org: 'Mistral AI', score: 84.7, bar: 84 },
  { rank: 7, model: 'Grok 3',            org: 'xAI',        score: 82.1, bar: 82 },
];

const STATS = [
  { value: '$47B',   label: 'Q1 2026 VC Funding', delta: '+38% YoY' },
  { value: '2,400+', label: 'Foundation Models',  delta: '+180 since Jan' },
  { value: '72.5%',  label: 'SWE-Bench (SOTA)',   delta: '↑ from 68.1%' },
  { value: '34%',    label: 'Fortune 500 AI Adoption', delta: '+9pp YoY' },
  { value: '$4.1T',  label: 'AI Market Cap (2026)', delta: '+61% YoY' },
  { value: '580M',   label: 'Daily ChatGPT Users', delta: '+120M MoM' },
  { value: '18ms',   label: 'Avg LLM Latency (p50)', delta: '↓ 34% vs 2025' },
  { value: '99.97%', label: 'API Uptime (top 3 labs)', delta: 'Stable' },
];

const grid  = { color: 'rgba(255,255,255,0.05)', drawBorder: false };
const ticks = { color: 'rgba(148,163,184,0.7)', font: { family: "'Inter',sans-serif", size: 11 } };
const tooltip = { backgroundColor:'rgba(10,10,27,0.9)', borderColor:'rgba(168,85,247,0.3)', borderWidth:1, titleColor:'#F1F5F9', bodyColor:'#94A3B8', padding:10, cornerRadius:8 };

const lineOpts = {
  responsive:true, maintainAspectRatio:false,
  plugins:{ legend:{display:false}, tooltip },
  scales:{
    x:{ grid, ticks },
    y:{ grid, ticks:{ ...ticks, callback:v=>`$${v}B` }, beginAtZero:false, min:10 },
  },
};
const doughnutOpts = {
  responsive:true, maintainAspectRatio:false,
  plugins:{ legend:{ display:true, position:'bottom', labels:{ color:'rgba(148,163,184,0.8)', padding:12, usePointStyle:true, font:{size:11} } }, tooltip },
  cutout:'60%',
};
const barOpts = {
  responsive:true, maintainAspectRatio:false, indexAxis:'y',
  plugins:{ legend:{display:false}, tooltip },
  scales:{ x:{ grid, ticks, min:70, max:100 }, y:{ grid:{display:false}, ticks:{ ...ticks, font:{...ticks.font,size:10} } } },
};
const lineOpts2 = {
  responsive:true, maintainAspectRatio:false,
  plugins:{ legend:{display:true, labels:{color:'rgba(148,163,184,0.8)',font:{size:11}}}, tooltip },
  scales:{ x:{ grid, ticks }, y:{ grid, ticks } },
};

const funding = {
  labels:['Q1\'24','Q2\'24','Q3\'24','Q4\'24','Q1\'25','Q2\'25','Q3\'25','Q4\'25','Q1\'26'],
  datasets:[{ label:'AI VC Funding ($B)', data:[18,22,21,29,31,35,33,41,47], borderColor:'#A855F7', backgroundColor:'rgba(168,85,247,0.12)', borderWidth:2.5, pointBackgroundColor:'#A855F7', pointRadius:4, fill:true, tension:0.4 }],
};
const adoption = {
  labels:['Enterprise SaaS','Finance','Healthcare','Retail','Manufacturing','Media'],
  datasets:[{ data:[28,22,16,14,12,8], backgroundColor:['rgba(168,85,247,0.8)','rgba(6,182,212,0.8)','rgba(236,72,153,0.8)','rgba(59,130,246,0.8)','rgba(249,115,22,0.8)','rgba(34,197,94,0.8)'], borderColor:'rgba(0,8,20,0.5)', borderWidth:2, hoverOffset:6 }],
};
const benchmark = {
  labels: LEADERBOARD.map(m=>m.model.split(' ').slice(0,2).join(' ')),
  datasets:[{ label:'Composite Score', data:LEADERBOARD.map(m=>m.score), backgroundColor:['rgba(168,85,247,0.85)','rgba(168,85,247,0.75)','rgba(168,85,247,0.65)','rgba(6,182,212,0.75)','rgba(6,182,212,0.65)','rgba(6,182,212,0.55)','rgba(6,182,212,0.45)'], borderRadius:6 }],
};
const tokens = {
  labels:['Jan','Feb','Mar','Apr','May','Jun'],
  datasets:[
    { label:'GPT-5',      data:[180,210,250,280,320,370], borderColor:'#06B6D4', backgroundColor:'rgba(6,182,212,0.08)', fill:true, tension:0.4 },
    { label:'Claude 4',   data:[120,165,200,240,290,340], borderColor:'#A855F7', backgroundColor:'rgba(168,85,247,0.08)', fill:true, tension:0.4 },
    { label:'Gemini U2',  data:[90,130,160,200,240,280],  borderColor:'#EC4899', backgroundColor:'rgba(236,72,153,0.08)', fill:true, tension:0.4 },
  ],
};

const ExtIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
function ChartSource({ name, url }) {
  return (
    <a className="chart-source" href={url} target="_blank" rel="noopener noreferrer">
      Source: {name} <ExtIcon />
    </a>
  );
}

export default function MetricsPage() {
  return (
    <div className="page-section">
      <div className="container">
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 40 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Live Dashboard</p>
          <h1 className="page-hero-title">AI Industry Metrics</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>
            Funding trends, model benchmarks, adoption curves and token usage — the numbers behind the AI era.
          </p>
        </div>

        {/* KPI strip */}
        <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:32 }}>
          {STATS.slice(0,4).map(s => (
            <div key={s.label} className="metric-stat">
              <div className="metric-stat-value">{s.value}</div>
              <div className="metric-stat-label">{s.label}</div>
              <div className="metric-stat-delta">{s.delta}</div>
            </div>
          ))}
        </div>
        <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:40 }}>
          {STATS.slice(4).map(s => (
            <div key={s.label} className="metric-stat">
              <div className="metric-stat-value">{s.value}</div>
              <div className="metric-stat-label">{s.label}</div>
              <div className="metric-stat-delta">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Row 1 */}
        <div className="charts-grid" style={{ marginBottom:20 }}>
          <div className="chart-card">
            <div className="chart-title">Global AI VC Funding</div>
            <div className="chart-subtitle">Quarterly investment ($B) — 2024–2026</div>
            <div className="chart-wrap"><Line data={funding} options={lineOpts} /></div>
            <ChartSource name="PitchBook–NVCA Venture Monitor" url="https://pitchbook.com/news/reports/q1-2026-pitchbook-nvca-venture-monitor" />
          </div>
          <div className="chart-card">
            <div className="chart-title">AI Adoption by Sector</div>
            <div className="chart-subtitle">% share of enterprise AI deployments</div>
            <div className="chart-wrap"><Doughnut data={adoption} options={doughnutOpts} /></div>
            <ChartSource name="McKinsey State of AI" url="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="charts-grid-bottom" style={{ marginBottom:20 }}>
          <div className="chart-card">
            <div className="chart-title">LLM Benchmark Leaderboard</div>
            <div className="chart-subtitle">Composite score (coding + reasoning + safety)</div>
            <div className="chart-wrap" style={{ height:220 }}><Bar data={benchmark} options={barOpts} /></div>
            <ChartSource name="LMArena Leaderboard" url="https://lmarena.ai/leaderboard" />
          </div>
          <div className="chart-card">
            <div className="chart-title">Model Rankings</div>
            <div className="chart-subtitle">Top 7 frontier models — composite score</div>
            <div className="leaderboard-list">
              {LEADERBOARD.map(m => (
                <div key={m.rank} className="leaderboard-row">
                  <span className={`lb-rank${m.rank<=3?' top3':''}`}>{m.rank}</span>
                  <div className="lb-info">
                    <div className="lb-model-name">{m.model}</div>
                    <div className="lb-model-org">{m.org}</div>
                  </div>
                  <div className="lb-bar-wrap"><div className="lb-bar" style={{ width:`${m.bar}%` }} /></div>
                  <span className="lb-score">{m.score}</span>
                </div>
              ))}
            </div>
            <ChartSource name="Artificial Analysis" url="https://artificialanalysis.ai/" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="chart-card" style={{ marginBottom:60 }}>
          <div className="chart-title">API Token Usage by Model (2026)</div>
          <div className="chart-subtitle">Estimated monthly API tokens (billions) — top 3 frontier models</div>
          <div className="chart-wrap" style={{ height:240 }}><Line data={tokens} options={lineOpts2} /></div>
          <ChartSource name="State of AI Report" url="https://www.stateof.ai/" />
        </div>
      </div>
    </div>
  );
}
