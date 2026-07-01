/*
 * glossaryMeta — shared category groups, icons, descriptions and sample terms
 * used by GlossaryPage and GlossaryInfographic.
 */

export const CAT_ICONS = {
  'AI/ML': '🧠', 'AIOps': '🤖', 'APM': '📊', 'Architecture': '🏛️',
  'Cloud Native': '☁️', 'Cloud Providers': '⛅', 'Compute & Runtime': '⚙️',
  'Containers': '📦', 'Data & Streaming': '🌊', 'Data Formats': '📄',
  'Databases': '🗃️', 'DevOps & CI/CD': '🔧', 'Digital Experience': '🖥️',
  'Distributed Systems': '🕸️', 'Fundamentals': '📚', 'IT Operations': '🛠️',
  'Incident': '🚨', 'Infrastructure': '🏗️', 'Kubernetes': '☸️', 'Logging': '📋',
  'Metrics': '📈', 'Networking': '🌐', 'Reliability': '🛡️', 'Security & SIEM': '🔒',
  'Service Mesh': '🔗', 'Standards & Tools': '🧰', 'Tracing': '🧵', 'Visualization': '📉',
};

export const CAT_TINTS = [
  'rgba(168,85,247,0.13)', 'rgba(6,182,212,0.12)', 'rgba(59,130,246,0.12)',
  'rgba(236,72,153,0.12)', 'rgba(249,115,22,0.12)', 'rgba(34,197,94,0.12)',
];
export const TINT_BORDERS = [
  'rgba(168,85,247,0.3)', 'rgba(6,182,212,0.3)', 'rgba(59,130,246,0.3)',
  'rgba(236,72,153,0.3)', 'rgba(249,115,22,0.3)', 'rgba(34,197,94,0.3)',
];

export const FEATURED_TERMS = [
  'SLO', 'OpenTelemetry', 'Prometheus', 'Kubernetes', 'RAG', 'eBPF',
  'Distributed Tracing', 'Chaos Engineering', 'Service Mesh', 'LLM',
  'PromQL', 'LogQL', 'mTLS', 'Istio', 'FinOps',
];

export const CAT_GROUPS = [
  {
    label: 'Observability Core',
    short: 'Observability',
    color: '#06b6d4',
    desc: 'Metrics, logs, traces, dashboards and the platforms that power them.',
    cats: ['Fundamentals', 'Metrics', 'Logging', 'Tracing', 'Visualization', 'Standards & Tools'],
  },
  {
    label: 'Operations & Reliability',
    short: 'Operations',
    color: '#a855f7',
    desc: 'Incident response, APM, SRE practices and day-to-day IT operations.',
    cats: ['AIOps', 'APM', 'Incident', 'Reliability', 'IT Operations'],
  },
  {
    label: 'Infrastructure & Platform',
    short: 'Infrastructure',
    color: '#3b82f6',
    desc: 'Kubernetes, containers, cloud providers, networking and service mesh.',
    cats: ['Kubernetes', 'Containers', 'Cloud Native', 'Cloud Providers', 'Infrastructure', 'Compute & Runtime', 'Networking', 'Service Mesh'],
  },
  {
    label: 'Engineering & Data',
    short: 'Engineering',
    color: '#f97316',
    desc: 'Architecture patterns, DevOps pipelines, databases, streaming and security.',
    cats: ['DevOps & CI/CD', 'Architecture', 'Distributed Systems', 'Databases', 'Data & Streaming', 'Data Formats', 'Security & SIEM'],
  },
  {
    label: 'AI & Experience',
    short: 'AI & DX',
    color: '#22c55e',
    desc: 'Machine learning, LLMs, agents and digital experience monitoring.',
    cats: ['AI/ML', 'Digital Experience'],
  },
];

export const CAT_DESCRIPTIONS = {
  'AI/ML': 'Models, training, inference, RAG, agents and the modern GenAI stack.',
  'AIOps': 'ML-driven alerting, correlation, remediation and intelligent operations.',
  'APM': 'Application performance, profiling, transactions and user-facing latency.',
  'Architecture': 'Distributed design patterns, microservices and integration styles.',
  'Cloud Native': 'Containers, orchestration, GitOps and cloud-native principles.',
  'Cloud Providers': 'AWS, Azure, GCP managed observability and platform services.',
  'Compute & Runtime': 'Runtimes, kernels, Wasm, JVM/GC and low-level execution.',
  'Containers': 'Images, registries, runtimes, security and supply chain.',
  'Data & Streaming': 'Kafka, stream processing, CDC and event-driven pipelines.',
  'Data Formats': 'JSON, Protobuf, Parquet, compression and serialization.',
  'Databases': 'OLTP, OLAP, indexing, replication and query performance.',
  'DevOps & CI/CD': 'Pipelines, GitOps, releases, testing and platform engineering.',
  'Digital Experience': 'Core Web Vitals, RUM, session quality and front-end performance.',
  'Distributed Systems': 'Consensus, replication, caching, locking and scalability.',
  'Fundamentals': 'SLOs, SLIs, on-call, runbooks and observability foundations.',
  'IT Operations': 'ITSM, service desk, change management and operational reporting.',
  'Incident': 'Severity, response roles, postmortems and communication.',
  'Infrastructure': 'CPU, memory, disk, network hardware and capacity.',
  'Kubernetes': 'Pods, controllers, RBAC, autoscaling and cluster operations.',
  'Logging': 'Collection, parsing, retention and log query languages.',
  'Metrics': 'Prometheus types, PromQL, cardinality and time-series storage.',
  'Networking': 'TCP/IP, TLS, load balancing, DNS and data-center fabrics.',
  'Reliability': 'HA, failover, chaos engineering, DR and error budgets.',
  'Security & SIEM': 'Threat detection, SIEM, compliance and cloud security posture.',
  'Service Mesh': 'Istio, Envoy, mTLS, traffic management and mesh observability.',
  'Standards & Tools': 'Prometheus, Grafana, OpenTelemetry, Nagios and the observability toolchain.',
  'Tracing': 'Spans, context propagation, sampling and trace backends.',
  'Visualization': 'Dashboards, panels, charts and Grafana exploration.',
};

/** Two–three iconic terms shown on each category cell in the infographic. */
export const CAT_SAMPLE_TERMS = {
  'AI/ML': ['RAG', 'LLM', 'Fine-Tuning'],
  'AIOps': ['Anomaly Detection', 'Alert Correlation', 'RCA'],
  'APM': ['Latency', 'Profiling', 'Transactions'],
  'Architecture': ['Microservices', 'Event-Driven', 'CQRS'],
  'Cloud Native': ['GitOps', 'Helm', 'CNCF'],
  'Cloud Providers': ['AWS', 'Azure', 'GCP'],
  'Compute & Runtime': ['eBPF', 'Wasm', 'JVM'],
  'Containers': ['Docker', 'OCI', 'Image'],
  'Data & Streaming': ['Kafka', 'Flink', 'CDC'],
  'Data Formats': ['JSON', 'Protobuf', 'Parquet'],
  'Databases': ['PostgreSQL', 'OLAP', 'Indexing'],
  'DevOps & CI/CD': ['CI/CD', 'GitOps', 'Canary'],
  'Digital Experience': ['Core Web Vitals', 'RUM', 'LCP'],
  'Distributed Systems': ['Consensus', 'CAP', 'Sharding'],
  'Fundamentals': ['SLO', 'SLI', 'On-Call'],
  'IT Operations': ['ITSM', 'Change Mgmt', 'CMDB'],
  'Incident': ['Severity', 'Postmortem', 'War Room'],
  'Infrastructure': ['CPU', 'Capacity', 'IOPS'],
  'Kubernetes': ['Pod', 'Deployment', 'RBAC'],
  'Logging': ['LogQL', 'ELK', 'Retention'],
  'Metrics': ['PromQL', 'Cardinality', 'Histogram'],
  'Networking': ['TLS', 'DNS', 'Load Balancer'],
  'Reliability': ['Error Budget', 'Chaos', 'HA'],
  'Security & SIEM': ['SIEM', 'Zero Trust', 'CVE'],
  'Service Mesh': ['Istio', 'Envoy', 'mTLS'],
  'Standards & Tools': ['OpenTelemetry', 'Prometheus', 'Grafana'],
  'Tracing': ['Span', 'Jaeger', 'Sampling'],
  'Visualization': ['Dashboard', 'Grafana', 'Panel'],
};

export const INFOGRAPHIC_OG_IMAGE = 'https://glancerai.com/glossary-infographic.jpg';