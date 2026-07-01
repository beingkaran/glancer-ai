/*
 * GlossaryInfographic — Google Discover–friendly visual map of all glossary
 * categories. Shows every domain, term counts, sample terms and the two core
 * flows (Observability → AIOps and Data → Agents). Interactive cells jump into
 * category browse; the raster JPG is used for og:image / Discover cards.
 */
import { CAT_GROUPS, CAT_ICONS, CAT_SAMPLE_TERMS, INFOGRAPHIC_OG_IMAGE } from '../data/glossaryMeta';

const GROUP_COLORS = ['#06b6d4', '#a855f7', '#3b82f6', '#f97316', '#22c55e'];

function CategoryCell({ cat, x, y, w, h, onCategoryClick, onTermClick }) {
  const samples = (CAT_SAMPLE_TERMS[cat.name] || []).slice(0, 2);
  return (
    <g className="gi-cell" transform={`translate(${x},${y})`} role="button" tabIndex={0}
       onClick={() => onCategoryClick?.(cat.name)}
       onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCategoryClick?.(cat.name); } }}>
      <rect className="gi-cell-bg" width={w} height={h} rx="10" />
      <text className="gi-cell-icon" x={w / 2} y="22" textAnchor="middle">{cat.icon}</text>
      <text className="gi-cell-name" x={w / 2} y="40" textAnchor="middle">{cat.name}</text>
      <text className="gi-cell-count" x={w / 2} y="54" textAnchor="middle">{cat.count} terms</text>
      {samples.map((term, i) => (
        <text key={term} className="gi-cell-term" x={w / 2} y={68 + i * 13} textAnchor="middle"
              onClick={(e) => { e.stopPropagation(); onTermClick?.(term); }}
              style={{ cursor: onTermClick ? 'pointer' : undefined }}>
          {term}
        </text>
      ))}
    </g>
  );
}

export default function GlossaryInfographic({
  categories = [],
  termCount = 0,
  categoryCount = 28,
  onCategoryClick,
  onTermClick,
}) {
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  // Layout: 1200 × 1680 viewBox — tall enough for all groups + flows.
  const W = 1200;
  const pad = 28;
  let y = 100;

  const groupBlocks = CAT_GROUPS.map((group, gi) => {
    const groupCats = group.cats.map((n) => catByName[n]).filter(Boolean);
    const cols = groupCats.length <= 5 ? groupCats.length : groupCats.length <= 6 ? 3 : 4;
    const cellW = groupCats.length <= 2 ? 200 : groupCats.length <= 5 ? 168 : 148;
    const cellH = 88;
    const gap = 10;
    const rows = Math.ceil(groupCats.length / cols);
    const blockH = 36 + rows * (cellH + gap);
    const startY = y;
    y += blockH + 18;
    return { group, groupCats, cols, cellW, cellH, gap, rows, startY, color: GROUP_COLORS[gi] };
  });

  return (
    <section className="glossary-infographic glass" aria-labelledby="glossary-infographic-title">
      <div className="glossary-infographic-head">
        <div>
          <p className="section-label" style={{ marginBottom: 6 }}>Visual reference</p>
          <h2 id="glossary-infographic-title" className="glossary-infographic-title">
            Complete glossary map — all {categoryCount} categories
          </h2>
          <p className="glossary-infographic-sub">
            Every domain in one view: observability pillars, platform engineering, data systems and the GenAI stack.
            Tap a category to browse its terms.
          </p>
        </div>
        <div className="glossary-infographic-actions">
          <a
            className="glossary-infographic-dl"
            href="/glossary-infographic.jpg"
            download="glancer-ai-glossary-map.jpg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download JPG
          </a>
          <span className="glossary-infographic-badge">Discover-ready · 1200×675</span>
        </div>
      </div>

      <figure className="glossary-infographic-figure">
        <svg
          className="glossary-infographic-svg"
          viewBox={`0 0 ${W} ${y + 200}`}
          role="img"
          aria-label={`Glossary infographic: ${termCount.toLocaleString()} terms across ${categoryCount} categories in observability, operations, infrastructure, engineering and AI domains.`}
        >
          <defs>
            <linearGradient id="gi-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="gi-header" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(168,85,247,0.25)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.2)" />
            </linearGradient>
            <marker id="gi-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="currentColor" opacity="0.55" />
            </marker>
          </defs>

          {/* Header band */}
          <rect x={pad} y="16" width={W - pad * 2} height="72" rx="14" className="gi-header-bg" />
          <text className="gi-title" x={W / 2} y="44" textAnchor="middle">
            AI, AIOps &amp; Observability Glossary
          </text>
          <text className="gi-stats" x={W / 2} y="68" textAnchor="middle">
            {termCount.toLocaleString()} terms · {categoryCount} categories · glancerai.com/glossary
          </text>

          {/* Category groups */}
          {groupBlocks.map(({ group, groupCats, cols, cellW, cellH, gap, startY, color }) => {
            const gridW = cols * cellW + (cols - 1) * gap;
            const startX = (W - gridW) / 2;
            return (
              <g key={group.label}>
                <rect x={pad} y={startY - 4} width={W - pad * 2} height="28" rx="8" fill={color} fillOpacity="0.12" />
                <text className="gi-group-label" x={pad + 14} y={startY + 14}>{group.label}</text>
                <text className="gi-group-count" x={W - pad - 14} y={startY + 14} textAnchor="end">
                  {groupCats.reduce((s, c) => s + c.count, 0).toLocaleString()} terms
                </text>
                {groupCats.map((cat, i) => {
                  const col = i % cols;
                  const row = Math.floor(i / cols);
                  const cx = startX + col * (cellW + gap);
                  const cy = startY + 32 + row * (cellH + gap);
                  return (
                    <CategoryCell
                      key={cat.name}
                      cat={cat}
                      x={cx}
                      y={cy}
                      w={cellW}
                      h={cellH}
                      onCategoryClick={onCategoryClick}
                      onTermClick={onTermClick}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Flow: Observability → AIOps */}
          <g transform={`translate(0, ${y})`}>
            <text className="gi-flow-label" x={pad} y="18">Signal flow</text>
            <g className="gi-flow-edges" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#gi-arrow)" opacity="0.55">
              <path d="M130 52 L250 52" /><path d="M330 52 L450 52" /><path d="M530 52 L650 52" /><path d="M730 52 L850 52" />
            </g>
            {[
              ['📈 Metrics', 60], ['📋 Logs', 260], ['🧵 Traces', 460], ['Observability', 660], ['🤖 AIOps', 860],
            ].map(([label, x], i) => (
              <g key={label} transform={`translate(${x}, 28)`}>
                <rect width="120" height="44" rx="10" className={i === 3 ? 'gi-flow-hub' : i === 4 ? 'gi-flow-aiops' : 'gi-flow-node'} />
                <text className={`gi-flow-text${i >= 3 ? ' gi-flow-text-strong' : ''}`} x="60" y="24" textAnchor="middle">{label}</text>
              </g>
            ))}

            {/* GenAI stack */}
            <text className="gi-flow-label" x={pad} y="108">GenAI stack</text>
            <g className="gi-flow-edges" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#gi-arrow)" opacity="0.55">
              <path d="M130 142 L250 142" /><path d="M330 142 L450 142" /><path d="M530 142 L650 142" /><path d="M730 142 L850 142" />
            </g>
            {[
              ['📊 Data', 60], ['🧠 Model', 260], ['⚡ Inference', 460], ['🛠️ Agents', 660], ['Value', 860],
            ].map(([label, x], i) => (
              <g key={label} transform={`translate(${x}, 118)`}>
                <rect width="120" height="44" rx="10" className={i >= 3 ? 'gi-flow-hub' : 'gi-flow-node'} />
                <text className={`gi-flow-text${i >= 3 ? ' gi-flow-text-strong' : ''}`} x="60" y="24" textAnchor="middle">{label}</text>
              </g>
            ))}

            <text className="gi-footer" x={W / 2} y="188" textAnchor="middle">
              Free reference · Search {termCount.toLocaleString()} definitions at glancerai.com/glossary
            </text>
          </g>
        </svg>

        {/* Discover raster — prominent <img> helps Google pick the card image */}
        <img
          className="glossary-infographic-og"
          src="/glossary-infographic.jpg"
          alt={`Glancer AI glossary map: ${termCount.toLocaleString()} AI, AIOps and observability terms across ${categoryCount} categories`}
          width={1200}
          height={675}
          loading="lazy"
        />
      </figure>

      <p className="glossary-infographic-caption">
        <strong>How to read this map:</strong> each cell is a glossary category with sample terms.
        The top flow shows how metrics, logs and traces roll up into observability and AIOps;
        the bottom flow traces the generative-AI stack from data to deployed agents.
        The downloadable JPG is optimised for Google Discover (1200×675,{' '}
        <code>max-image-preview:large</code>).
      </p>
    </section>
  );
}

export { INFOGRAPHIC_OG_IMAGE };