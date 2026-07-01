/*
 * GlossaryDiagram — a small, themed concept map that orients readers before they
 * browse. It shows how the glossary's big domains connect: the three pillars of
 * observability roll up into Observability → AIOps, and the GenAI stack flows
 * from Data → Model → Inference → Agents. Pure SVG, theme-aware via currentColor
 * and CSS variables, responsive through viewBox scaling.
 */
export default function GlossaryDiagram({ termCount, categoryCount }) {
  return (
    <div className="glossary-diagram glass">
      <div className="glossary-diagram-head">
        <p className="section-label" style={{ marginBottom: 4 }}>How it all connects</p>
        <h3 className="glossary-diagram-title">From signals to intelligent operations &amp; the GenAI stack</h3>
      </div>

      <svg className="glossary-diagram-svg" viewBox="0 0 880 408" role="img"
           aria-label="Diagram: Metrics, Logs and Traces feed Observability, which feeds AIOps. Separately, Data flows to Model, Inference and Agents in the generative AI stack.">
        <defs>
          <linearGradient id="gd-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <marker id="gd-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="currentColor" opacity="0.55" />
          </marker>
        </defs>

        {/* ---- Top band: observability pillars → Observability → AIOps ---- */}
        <text x="30" y="34" className="gd-section">Observability → AIOps</text>
        <g className="gd-edges" stroke="currentColor" strokeWidth="1.6" fill="none" markerEnd="url(#gd-arrow)" opacity="0.6">
          <path d="M150 74 L328 110" />
          <path d="M150 124 L328 124" />
          <path d="M150 174 L328 138" />
          <path d="M470 124 L558 124" />
        </g>

        {/* pillars */}
        <g>
          <rect x="30" y="48" width="120" height="52" rx="12" className="gd-node gd-metrics" />
          <text x="90" y="74" className="gd-label">📈 Metrics</text>

          <rect x="30" y="98" width="120" height="52" rx="12" className="gd-node gd-logs" />
          <text x="90" y="124" className="gd-label">📋 Logs</text>

          <rect x="30" y="148" width="120" height="52" rx="12" className="gd-node gd-traces" />
          <text x="90" y="174" className="gd-label">🧵 Traces</text>
        </g>

        {/* observability hub */}
        <rect x="328" y="98" width="140" height="52" rx="12" className="gd-node gd-hub" />
        <text x="398" y="124" className="gd-label gd-label-strong">Observability</text>

        {/* AIOps */}
        <rect x="558" y="98" width="122" height="52" rx="12" className="gd-node gd-aiops" />
        <text x="619" y="124" className="gd-label gd-label-strong">🤖 AIOps</text>

        {/* ---- Bottom band: GenAI stack ---- */}
        <text x="30" y="292" className="gd-section">Generative-AI stack</text>
        <g className="gd-edges" stroke="currentColor" strokeWidth="1.6" fill="none" markerEnd="url(#gd-arrow)" opacity="0.6">
          <path d="M150 334 L208 334" />
          <path d="M330 334 L388 334" />
          <path d="M510 334 L568 334" />
          <path d="M690 334 L746 334" />
        </g>
        <g>
          <rect x="30" y="308" width="120" height="52" rx="12" className="gd-node gd-metrics" />
          <text x="90" y="334" className="gd-label">📊 Data</text>

          <rect x="210" y="308" width="120" height="52" rx="12" className="gd-node gd-logs" />
          <text x="270" y="334" className="gd-label">🧠 Model</text>

          <rect x="390" y="308" width="120" height="52" rx="12" className="gd-node gd-traces" />
          <text x="450" y="334" className="gd-label">⚡ Inference</text>

          <rect x="570" y="308" width="120" height="52" rx="12" className="gd-node gd-hub" />
          <text x="630" y="334" className="gd-label gd-label-strong">🛠️ Agents</text>

          <rect x="748" y="308" width="102" height="52" rx="12" className="gd-node gd-aiops" />
          <text x="799" y="334" className="gd-label gd-label-strong">Value</text>
        </g>
      </svg>

      <p className="glossary-diagram-note">
        {termCount ? (
          <>{termCount.toLocaleString()} terms across {categoryCount || 28} categories — from <em>SLO</em> and <em>eBPF</em> to <em>RAG</em>, <em>PromQL</em> and <em>AI agents</em>. Pick a category below to browse.</>
        ) : (
          <>Tap a category below to dive into the terms behind each box — from <em>SLO</em> and <em>eBPF</em> to <em>RAG</em> and <em>AI agents</em>.</>
        )}
      </p>
    </div>
  );
}
