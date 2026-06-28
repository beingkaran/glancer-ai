import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getPageAnalytics } from '../lib/analytics';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler,
);

/*
 * AnalyticsPanel — admin-only traffic dashboard.
 *
 * Rendered inside the Admin page (so it's already gated behind a real admin
 * session). Shows total / today / week / year visit counters with unique
 * visitor counts, plus daily, weekly and yearly trend charts. All numbers come
 * from the server-side page_analytics() RPC, which itself refuses non-admins.
 */

const PURPLE = '#A855F7';
const CYAN = '#06B6D4';

const baseScales = {
  x: {
    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
    ticks: { color: 'rgba(148,163,184,0.7)', font: { size: 11 } },
  },
  y: {
    beginAtZero: true,
    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
    ticks: { color: 'rgba(148,163,184,0.7)', font: { size: 11 }, precision: 0 },
  },
};

const tooltipStyle = {
  backgroundColor: 'rgba(10,10,27,0.9)',
  borderColor: 'rgba(168,85,247,0.3)',
  borderWidth: 1,
  titleColor: '#F1F5F9',
  bodyColor: '#94A3B8',
  padding: 10,
  cornerRadius: 8,
};

const commonOpts = {
  responsive: true,
  maintainAspectRatio: false,
  scales: baseScales,
  plugins: {
    legend: { display: true, labels: { color: 'rgba(148,163,184,0.85)', boxWidth: 12, font: { size: 11 } } },
    tooltip: tooltipStyle,
  },
};

function StatCard({ label, value, sub }) {
  return (
    <div className="chart-card" style={{ padding: 18 }}>
      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
        {Number(value || 0).toLocaleString()}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function trendData(rows, hitColor, uniqColor) {
  const safe = Array.isArray(rows) ? rows : [];
  return {
    labels: safe.map((r) => r.label),
    datasets: [
      {
        label: 'Page hits',
        data: safe.map((r) => Number(r.hits) || 0),
        borderColor: hitColor,
        backgroundColor: `${hitColor}22`,
        borderWidth: 2.5,
        pointBackgroundColor: hitColor,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.35,
        borderRadius: 6,
      },
      {
        label: 'Unique visitors',
        data: safe.map((r) => Number(r.uniques) || 0),
        borderColor: uniqColor,
        backgroundColor: `${uniqColor}33`,
        borderWidth: 2.5,
        pointBackgroundColor: uniqColor,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.35,
        borderRadius: 6,
      },
    ],
  };
}

export default function AnalyticsPanel() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPageAnalytics();
      setStats(data);
    } catch (err) {
      setError(err?.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics…</div>;
  }

  if (error) {
    return (
      <div className="chart-card" style={{ padding: 24, maxWidth: 620 }}>
        <h3 className="chart-title" style={{ marginBottom: 8 }}>Analytics unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 16 }}>
          {error} Make sure the latest <code>supabase/schema.sql</code> has been run
          (it creates the <code>page_hits</code> table and <code>page_analytics()</code> function).
        </p>
        <button onClick={load} className="filter-chip" style={{ cursor: 'pointer', padding: '8px 16px' }}>Retry</button>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="section-title-lg">Analytics</h2>
        <button onClick={load} className="filter-chip" style={{ cursor: 'pointer', padding: '7px 14px', fontSize: '0.8rem' }}>↻ Refresh</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20, lineHeight: 1.6 }}>
        Anonymous page-visit counters and unique-visitor trends across the site.
      </p>

      {/* Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Visits" value={s.total} sub={`${Number(s.unique_total || 0).toLocaleString()} unique visitors`} />
        <StatCard label="Today" value={s.today} sub={`${Number(s.unique_today || 0).toLocaleString()} unique today`} />
        <StatCard label="Last 7 Days" value={s.week} sub={`${Number(s.unique_week || 0).toLocaleString()} unique this week`} />
        <StatCard label="Last 12 Months" value={s.year} sub={`${Number(s.unique_year || 0).toLocaleString()} unique this year`} />
      </div>

      {/* Trends */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="chart-card" style={{ padding: 20 }}>
          <h3 className="chart-title" style={{ marginBottom: 14 }}>Daily trend — last 30 days</h3>
          <div style={{ height: 260 }}>
            <Line data={trendData(s.daily, PURPLE, CYAN)} options={commonOpts} />
          </div>
        </div>

        <div className="chart-card" style={{ padding: 20 }}>
          <h3 className="chart-title" style={{ marginBottom: 14 }}>Weekly trend — last 12 weeks</h3>
          <div style={{ height: 260 }}>
            <Bar data={trendData(s.weekly, PURPLE, CYAN)} options={commonOpts} />
          </div>
        </div>

        <div className="chart-card" style={{ padding: 20 }}>
          <h3 className="chart-title" style={{ marginBottom: 14 }}>Yearly trend</h3>
          <div style={{ height: 260 }}>
            <Bar data={trendData(s.yearly, PURPLE, CYAN)} options={commonOpts} />
          </div>
        </div>
      </div>
    </div>
  );
}
