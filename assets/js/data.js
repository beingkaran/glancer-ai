/*
 * Glancer.ai — AIOps, Observability & APM Glossary Database
 * Each entry: { term, abbr?, category, definition, related?[], vendors?[] }
 * Definitions are written in plain English and reflect terminology used across
 * Datadog, Dynatrace, New Relic, Splunk, AppDynamics and Broadcom (DX) APM.
 */
window.OBSERVA_TERMS = (window.OBSERVA_TERMS || []).concat([
  /* ---------------- Observability Fundamentals ---------------- */
  {
    term: "Observability",
    category: "Fundamentals",
    definition: "The ability to understand the internal state of a system purely by examining the data it produces — primarily metrics, logs and traces (the 'three pillars'). Unlike traditional monitoring, which answers known questions, observability lets you ask new, unanticipated questions about your system's behavior without shipping new code.",
    related: ["Monitoring", "Three Pillars of Observability", "Telemetry", "MELT"],
    vendors: ["Datadog", "Dynatrace", "New Relic", "Splunk"]
  },
  {
    term: "Monitoring",
    category: "Fundamentals",
    definition: "The practice of collecting, aggregating and analyzing predefined metrics and signals to track the health and performance of a system against known conditions. Monitoring tells you whether a system is working; observability helps you understand why it is not.",
    related: ["Observability", "Alerting", "Dashboard"]
  },
  {
    term: "Three Pillars of Observability",
    category: "Fundamentals",
    definition: "The three foundational telemetry data types used to achieve observability: metrics (numeric measurements over time), logs (timestamped event records) and traces (the path of a request through a distributed system). Modern practice often adds events and profiles.",
    related: ["Metrics", "Logs", "Traces", "MELT"]
  },
  {
    term: "MELT",
    abbr: "MELT",
    category: "Fundamentals",
    definition: "An acronym for Metrics, Events, Logs and Traces — the four core telemetry data types that feed an observability platform. New Relic popularized the term as an evolution of the 'three pillars' model.",
    related: ["Three Pillars of Observability", "Telemetry"],
    vendors: ["New Relic"]
  },
  {
    term: "Telemetry",
    category: "Fundamentals",
    definition: "The automated collection and transmission of measurement data from a remote system to a central location for monitoring and analysis. In observability, telemetry encompasses metrics, logs, traces, events and profiles emitted by applications and infrastructure.",
    related: ["Instrumentation", "OpenTelemetry", "MELT"]
  },
  {
    term: "Instrumentation",
    category: "Fundamentals",
    definition: "The act of adding code or agents to an application so it emits telemetry (metrics, logs, traces). Instrumentation can be manual (developer-written), automatic (via an agent or library that hooks common frameworks), or hybrid.",
    related: ["Auto-Instrumentation", "Agent", "OpenTelemetry", "SDK"]
  },
  {
    term: "Auto-Instrumentation",
    category: "Fundamentals",
    definition: "Automatically capturing telemetry from an application without modifying its source code, typically by attaching an agent or byte-code instrumentation library that intercepts known frameworks, HTTP clients and database drivers.",
    related: ["Instrumentation", "Agent", "Bytecode Instrumentation"],
    vendors: ["Dynatrace", "Datadog", "AppDynamics", "New Relic"]
  },
  {
    term: "Cardinality",
    category: "Fundamentals",
    definition: "The number of unique values a dimension or label can take. High-cardinality data (e.g., user IDs, request IDs) enables fine-grained analysis but is expensive to store and index. Managing cardinality is a central challenge in metrics systems.",
    related: ["Dimension", "Tag", "Metrics", "Time Series"]
  },
  {
    term: "Dimension",
    category: "Fundamentals",
    definition: "A key–value attribute attached to telemetry that lets you slice, group and filter data — for example host, region, service or status code. Dimensions (also called tags or labels) turn a single metric into many addressable time series.",
    related: ["Tag", "Label", "Cardinality", "Metrics"]
  },

  /* ---------------- Metrics ---------------- */
  {
    term: "Metric",
    category: "Metrics",
    definition: "A numeric measurement captured at a point in time, usually stored as a time series. Metrics are cheap to store and ideal for dashboards, alerting and trend analysis (e.g., CPU utilization, request rate, error count).",
    related: ["Time Series", "Gauge", "Counter", "Histogram"]
  },
  {
    term: "Time Series",
    category: "Metrics",
    definition: "A sequence of data points indexed in time order, typically a metric value sampled at regular intervals. Time-series databases (TSDBs) are optimized to ingest, compress and query this data efficiently.",
    related: ["Metric", "TSDB", "Data Point"]
  },
  {
    term: "Counter",
    category: "Metrics",
    definition: "A cumulative metric that only increases (or resets to zero on restart), such as total requests served or bytes sent. Rates are derived by computing the difference between counter samples over time.",
    related: ["Gauge", "Rate", "Metric"]
  },
  {
    term: "Gauge",
    category: "Metrics",
    definition: "A metric that represents a value that can go up or down at any moment — for example memory in use, queue depth or temperature. Gauges capture a snapshot of state rather than an accumulating total.",
    related: ["Counter", "Metric"]
  },
  {
    term: "Histogram",
    category: "Metrics",
    definition: "A metric type that samples observations into configurable buckets, allowing calculation of quantiles and distributions (e.g., request latency p50/p95/p99) on the server side. Common in Prometheus and OpenTelemetry.",
    related: ["Percentile", "Summary", "Latency", "Bucket"]
  },
  {
    term: "Summary",
    category: "Metrics",
    definition: "A metric type that calculates configurable quantiles on the client side over a sliding time window. Unlike histograms, summary quantiles cannot be aggregated across instances.",
    related: ["Histogram", "Percentile"]
  },
  {
    term: "Percentile",
    abbr: "p95 / p99",
    category: "Metrics",
    definition: "A statistic indicating the value below which a given percentage of observations fall. p95 latency of 200ms means 95% of requests completed in 200ms or less. Percentiles reveal tail behavior that averages hide.",
    related: ["Latency", "Histogram", "Tail Latency", "Golden Signals"]
  },
  {
    term: "Rate",
    category: "Metrics",
    definition: "The per-unit-time change of a counter, such as requests per second or errors per minute. Rates normalize cumulative counters into a meaningful throughput measurement.",
    related: ["Counter", "Throughput"]
  },
  {
    term: "Aggregation",
    category: "Metrics",
    definition: "Combining many data points or time series into summary values — e.g., sum, average, min, max, count — across time (downsampling) or across dimensions (rolling up by service or region).",
    related: ["Downsampling", "Rollup", "Dimension"]
  },
  {
    term: "Downsampling",
    category: "Metrics",
    definition: "Reducing the resolution of time-series data by aggregating points into larger intervals (e.g., from 10-second to 5-minute granularity) to save storage while preserving long-term trends.",
    related: ["Aggregation", "Retention", "Rollup"]
  },
  {
    term: "Golden Signals",
    category: "Metrics",
    definition: "The four key service-health metrics defined in Google's SRE practice: latency, traffic, errors and saturation. Monitoring these provides broad coverage of user-facing problems with minimal noise.",
    related: ["RED Method", "USE Method", "SLI", "Saturation"]
  },
  {
    term: "RED Method",
    abbr: "RED",
    category: "Metrics",
    definition: "A monitoring methodology for request-driven services focusing on Rate (requests/sec), Errors (failed requests) and Duration (latency distribution). Complements the USE method for resources.",
    related: ["USE Method", "Golden Signals"]
  },
  {
    term: "USE Method",
    abbr: "USE",
    category: "Metrics",
    definition: "A methodology by Brendan Gregg for analyzing resource health via Utilization, Saturation and Errors. Best applied to physical resources like CPU, memory, disks and network interfaces.",
    related: ["RED Method", "Saturation", "Utilization"]
  },
  {
    term: "Saturation",
    category: "Metrics",
    definition: "How 'full' a resource is — the degree to which it is operating at or near its capacity limit, often reflected by queueing. A saturated resource is typically the bottleneck constraining performance.",
    related: ["Utilization", "Bottleneck", "Golden Signals", "USE Method"]
  },
  {
    term: "Custom Metric",
    category: "Metrics",
    definition: "A business- or application-specific metric defined by a user rather than emitted by default — for example checkout conversions, items in cart, or queue backlog. Often billed separately by vendors due to cardinality.",
    related: ["Metric", "Cardinality"],
    vendors: ["Datadog", "New Relic"]
  },

  /* ---------------- Logging ---------------- */
  {
    term: "Log",
    category: "Logging",
    definition: "A timestamped, immutable record of a discrete event that occurred in a system. Logs provide the most detailed, granular context for debugging but are the most voluminous and costly telemetry type.",
    related: ["Structured Logging", "Log Aggregation", "Log Level"]
  },
  {
    term: "Structured Logging",
    category: "Logging",
    definition: "Emitting logs as machine-parseable key–value data (typically JSON) rather than free-form text, enabling reliable searching, filtering and field-based analytics without fragile regex parsing.",
    related: ["Log", "Parsing", "JSON"]
  },
  {
    term: "Log Aggregation",
    category: "Logging",
    definition: "Collecting logs from many sources into a centralized system where they can be indexed, searched and correlated. Forms the basis of log management and SIEM platforms.",
    related: ["Log", "Centralized Logging", "SIEM"],
    vendors: ["Splunk", "Datadog"]
  },
  {
    term: "Log Level",
    category: "Logging",
    definition: "A severity label attached to a log message — commonly TRACE, DEBUG, INFO, WARN, ERROR and FATAL — used to filter verbosity and prioritize attention.",
    related: ["Log", "Severity"]
  },
  {
    term: "Parsing",
    category: "Logging",
    definition: "Extracting structured fields from raw log text using patterns (regex, Grok, or pipelines) so the data becomes queryable. Essential for turning unstructured logs into analyzable telemetry.",
    related: ["Grok", "Structured Logging", "Pipeline"]
  },
  {
    term: "Grok",
    category: "Logging",
    definition: "A pattern-matching syntax (popularized by Logstash) that combines named regular-expression patterns to parse unstructured log lines into structured fields.",
    related: ["Parsing", "Pipeline"]
  },
  {
    term: "Log Retention",
    category: "Logging",
    definition: "The policy controlling how long log data is stored before deletion or archival. Retention balances compliance and investigation needs against storage cost.",
    related: ["Retention", "Cold Storage", "Index"]
  },
  {
    term: "Index (Logs)",
    category: "Logging",
    definition: "A searchable data structure built over log fields to make queries fast. Many platforms separate ingestion from indexing so customers can control which logs are indexed (and billed) versus archived.",
    related: ["Log Aggregation", "Indexing Tier"],
    vendors: ["Datadog", "Splunk"]
  },
  {
    term: "Indexing Tier",
    category: "Logging",
    definition: "A cost-control concept where logs are routed to different storage classes — e.g., high-speed indexed storage for hot data versus cheaper rehydrate-on-demand archives for compliance.",
    related: ["Log Retention", "Cold Storage", "Logging without Limits"],
    vendors: ["Datadog"]
  },
  {
    term: "Logging without Limits",
    category: "Logging",
    definition: "Datadog's approach that decouples log ingestion from indexing, letting teams collect all logs while choosing which to index and pay for, with the rest archived or processed via filters.",
    related: ["Indexing Tier", "Log Retention"],
    vendors: ["Datadog"]
  },

  /* ---------------- Distributed Tracing ---------------- */
  {
    term: "Distributed Tracing",
    category: "Tracing",
    definition: "A technique for tracking a single request as it propagates across multiple services in a distributed system, stitching the work into one end-to-end trace so latency and failures can be localized.",
    related: ["Trace", "Span", "Context Propagation", "Microservices"],
    vendors: ["Datadog", "Dynatrace", "New Relic", "Splunk"]
  },
  {
    term: "Trace",
    category: "Tracing",
    definition: "The complete record of a single request's journey through a system, composed of one or more spans organized in a parent–child tree that reflects the call hierarchy and timing.",
    related: ["Span", "Distributed Tracing", "Trace ID"]
  },
  {
    term: "Span",
    category: "Tracing",
    definition: "The basic unit of work in a trace, representing a single named, timed operation (e.g., an HTTP call or DB query) with attributes, events and a parent reference. Spans nest to form a trace.",
    related: ["Trace", "Span Context", "Root Span", "Child Span"]
  },
  {
    term: "Root Span",
    category: "Tracing",
    definition: "The first, top-level span in a trace that has no parent — typically representing the entry point of a request (such as an inbound API call). All other spans descend from it.",
    related: ["Span", "Trace", "Entry Span"]
  },
  {
    term: "Span Context",
    category: "Tracing",
    definition: "The immutable identifiers carried with a span — trace ID, span ID and trace flags — that are propagated across service boundaries to link spans into a single distributed trace.",
    related: ["Context Propagation", "Trace ID", "Span ID"]
  },
  {
    term: "Context Propagation",
    category: "Tracing",
    definition: "The mechanism for passing trace context (IDs and baggage) between processes and services, usually via HTTP headers, so that downstream spans correctly attach to the originating trace.",
    related: ["Span Context", "W3C Trace Context", "Baggage"]
  },
  {
    term: "W3C Trace Context",
    category: "Tracing",
    definition: "A W3C standard defining HTTP headers (traceparent and tracestate) for propagating trace context across vendor and platform boundaries, enabling interoperable distributed tracing.",
    related: ["Context Propagation", "OpenTelemetry"]
  },
  {
    term: "Trace ID",
    category: "Tracing",
    definition: "A globally unique identifier shared by all spans belonging to the same trace, used to group and reconstruct a request's full path across services.",
    related: ["Span ID", "Trace", "Span Context"]
  },
  {
    term: "Baggage",
    category: "Tracing",
    definition: "Arbitrary user-defined key–value data propagated alongside trace context across service boundaries, allowing contextual information (like a tenant ID) to travel with a request.",
    related: ["Context Propagation", "Span Context"]
  },
  {
    term: "Sampling",
    category: "Tracing",
    definition: "Selecting a subset of traces to record in order to control data volume and cost. Strategies include head-based (decide at trace start) and tail-based (decide after seeing the full trace).",
    related: ["Head-Based Sampling", "Tail-Based Sampling", "Trace"]
  },
  {
    term: "Head-Based Sampling",
    category: "Tracing",
    definition: "A sampling strategy that decides whether to keep a trace at its very start, before the outcome is known. Simple and low-overhead but may discard rare error traces.",
    related: ["Sampling", "Tail-Based Sampling"]
  },
  {
    term: "Tail-Based Sampling",
    category: "Tracing",
    definition: "A sampling strategy that buffers all spans of a trace and decides whether to keep it after completion, allowing retention of slow or errored traces while dropping routine ones.",
    related: ["Sampling", "Head-Based Sampling"],
    vendors: ["Datadog"]
  },
  {
    term: "Service Map",
    category: "Tracing",
    definition: "An automatically generated topology diagram showing services as nodes and their request flows as edges, with health and latency overlaid. Built from trace data to visualize dependencies.",
    related: ["Topology", "Dependency Map", "Distributed Tracing"],
    vendors: ["Datadog", "New Relic", "Dynatrace"]
  },
  {
    term: "Flame Graph",
    category: "Tracing",
    definition: "A visualization that stacks spans (or stack frames) by time and depth so the widest bars indicate where the most time is spent, making bottlenecks in a trace or profile easy to spot.",
    related: ["Span", "Profiling", "Waterfall View"]
  },
  {
    term: "Waterfall View",
    category: "Tracing",
    definition: "A timeline visualization of a trace showing each span as a horizontal bar positioned by start time and duration, revealing sequential versus parallel work and where latency accumulates.",
    related: ["Trace", "Span", "Flame Graph"]
  },
  {
    term: "Span Link",
    category: "Tracing",
    definition: "A reference connecting a span to one or more spans in a different trace, useful for correlating related but causally separate operations such as batch jobs or fan-out/fan-in patterns.",
    related: ["Span", "Trace"]
  },

  /* ---------------- APM ---------------- */
  {
    term: "Application Performance Monitoring",
    abbr: "APM",
    category: "APM",
    definition: "The discipline and tooling for measuring and managing the performance, availability and user experience of software applications — tracking transactions, code-level timing, dependencies and errors to ensure SLAs are met.",
    related: ["Distributed Tracing", "Transaction", "Code-Level Visibility", "RUM"],
    vendors: ["AppDynamics", "Dynatrace", "New Relic", "Datadog", "Broadcom APM"]
  },
  {
    term: "Business Transaction",
    category: "APM",
    definition: "AppDynamics' core concept: a logical user-initiated activity (e.g., 'Checkout' or 'Login') traced end-to-end across tiers. Performance is measured per business transaction to tie technical metrics to business impact.",
    related: ["Transaction", "Tier", "APM"],
    vendors: ["AppDynamics"]
  },
  {
    term: "Transaction",
    category: "APM",
    definition: "A unit of application work triggered by a request, traced across all the components it touches. Transaction tracing measures end-to-end response time and breaks it down by tier and call.",
    related: ["Business Transaction", "Trace", "APM"]
  },
  {
    term: "Apdex",
    abbr: "Apdex",
    category: "APM",
    definition: "Application Performance Index — an open standard that converts response-time measurements into a 0-to-1 satisfaction score by classifying requests as Satisfied, Tolerating or Frustrated against a target threshold (T).",
    related: ["User Experience", "Response Time", "SLI"],
    vendors: ["New Relic", "AppDynamics"]
  },
  {
    term: "Code-Level Visibility",
    category: "APM",
    definition: "The ability to see performance down to individual methods, classes and lines of code, including slow methods and call stacks, so developers can pinpoint the exact source of latency or errors.",
    related: ["Method-Level Tracing", "Profiling", "APM"],
    vendors: ["Dynatrace", "AppDynamics"]
  },
  {
    term: "PurePath",
    category: "APM",
    definition: "Dynatrace's patented distributed-tracing technology that captures every transaction end-to-end at the code level with full method-level timing, no sampling, across all tiers.",
    related: ["Distributed Tracing", "Code-Level Visibility"],
    vendors: ["Dynatrace"]
  },
  {
    term: "Smartscape",
    category: "APM",
    definition: "Dynatrace's automatically generated, real-time topology map showing vertical and horizontal relationships across processes, services, hosts and data centers, continuously updated by the OneAgent.",
    related: ["Topology", "OneAgent", "Service Map"],
    vendors: ["Dynatrace"]
  },
  {
    term: "OneAgent",
    category: "APM",
    definition: "Dynatrace's single deployable agent that auto-discovers and instruments hosts, processes, services and applications, feeding metrics, traces, logs and topology into the platform.",
    related: ["Agent", "Auto-Instrumentation", "Smartscape"],
    vendors: ["Dynatrace"]
  },
  {
    term: "Davis AI",
    category: "APM",
    definition: "Dynatrace's deterministic AI causation engine that uses the topology model to automatically detect anomalies, determine root cause and assess business impact without manual configuration.",
    related: ["Root Cause Analysis", "AIOps", "Causal AI"],
    vendors: ["Dynatrace"]
  },
  {
    term: "Tier",
    category: "APM",
    definition: "A logical layer of an application architecture (e.g., web tier, application tier, database tier). APM tools break transaction time down by tier to localize where latency originates.",
    related: ["Transaction", "Node", "APM"],
    vendors: ["AppDynamics"]
  },
  {
    term: "Health Rule",
    category: "APM",
    definition: "AppDynamics' configurable condition that defines normal performance for a metric (often via baselines) and triggers warnings or critical events when violated, driving alerts and policies.",
    related: ["Baseline", "Alerting", "Policy"],
    vendors: ["AppDynamics"]
  },
  {
    term: "Method-Level Tracing",
    category: "APM",
    definition: "Capturing the execution time of individual methods within a transaction, producing a call graph that shows exactly which functions consume the most time.",
    related: ["Code-Level Visibility", "Call Graph", "Profiling"]
  },
  {
    term: "Continuous Profiling",
    category: "APM",
    definition: "Always-on, low-overhead sampling of code execution (CPU, memory, lock contention) in production to reveal which functions consume resources, complementing tracing with code-level performance insight.",
    related: ["Profiling", "Flame Graph", "Code-Level Visibility"],
    vendors: ["Datadog", "Dynatrace", "New Relic"]
  },
  {
    term: "Profiling",
    category: "APM",
    definition: "Measuring where a program spends its time or allocates resources by sampling stack traces, used to find CPU hot spots, memory leaks and lock contention.",
    related: ["Continuous Profiling", "Flame Graph"]
  },

  /* ---------------- Real User & Synthetic ---------------- */
  {
    term: "Real User Monitoring",
    abbr: "RUM",
    category: "Digital Experience",
    definition: "Capturing performance and behavior data from actual end users' browsers or mobile apps — page load times, Core Web Vitals, errors, sessions — to measure the real experience being delivered.",
    related: ["Synthetic Monitoring", "Core Web Vitals", "Session Replay", "Digital Experience Monitoring"],
    vendors: ["Datadog", "New Relic", "Dynatrace", "AppDynamics"]
  },
  {
    term: "Synthetic Monitoring",
    category: "Digital Experience",
    definition: "Proactively testing applications using scripted, simulated transactions from controlled locations on a schedule, to detect availability and performance problems before real users are affected.",
    related: ["Real User Monitoring", "Uptime Check", "Browser Test", "API Test"],
    vendors: ["Datadog", "New Relic", "Dynatrace", "Broadcom APM"]
  },
  {
    term: "Core Web Vitals",
    category: "Digital Experience",
    definition: "Google's set of user-centric web performance metrics: Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness) and Cumulative Layout Shift (visual stability). Key for UX and SEO.",
    related: ["Real User Monitoring", "LCP", "INP", "CLS"]
  },
  {
    term: "Session Replay",
    category: "Digital Experience",
    definition: "A capability that reconstructs and replays a real user's session as a video-like timeline of interactions, helping teams see exactly what a user experienced when an error or friction occurred.",
    related: ["Real User Monitoring", "Frustration Signals"],
    vendors: ["Datadog", "New Relic", "Dynatrace"]
  },
  {
    term: "Digital Experience Monitoring",
    abbr: "DEM",
    category: "Digital Experience",
    definition: "An umbrella discipline combining RUM, synthetic monitoring and endpoint data to measure and optimize the experience that users — and increasingly applications — have when interacting with digital services.",
    related: ["Real User Monitoring", "Synthetic Monitoring"],
    vendors: ["Dynatrace", "Broadcom APM"]
  },
  {
    term: "Browser Test",
    category: "Digital Experience",
    definition: "A type of synthetic test that drives a real or headless browser through a multi-step user journey (login, search, checkout) to validate functionality and measure front-end performance.",
    related: ["Synthetic Monitoring", "API Test"]
  },
  {
    term: "Uptime Check",
    category: "Digital Experience",
    definition: "A lightweight synthetic test that periodically pings an endpoint to confirm it is reachable and returns the expected status, used to measure and alert on availability.",
    related: ["Synthetic Monitoring", "Availability", "Heartbeat"]
  },

  /* ---------------- AIOps & ML ---------------- */
  {
    term: "AIOps",
    abbr: "AIOps",
    category: "AIOps",
    definition: "Artificial Intelligence for IT Operations — coined by Gartner, it applies machine learning, big-data analytics and automation to operations data (events, metrics, logs, traces) to automate anomaly detection, event correlation, root cause analysis and remediation.",
    related: ["Anomaly Detection", "Event Correlation", "Root Cause Analysis", "Noise Reduction", "Auto-Remediation"],
    vendors: ["Dynatrace", "Splunk", "Broadcom APM", "Datadog", "New Relic"]
  },
  {
    term: "Anomaly Detection",
    category: "AIOps",
    definition: "Using statistical or machine-learning models to automatically identify data points or patterns that deviate from expected behavior, surfacing problems without manually set thresholds.",
    related: ["Baseline", "Seasonality", "Outlier Detection", "Forecasting"],
    vendors: ["Datadog", "Dynatrace", "Splunk", "New Relic"]
  },
  {
    term: "Baseline",
    category: "AIOps",
    definition: "A learned model of a metric's normal behavior — often accounting for seasonality and trend — against which current values are compared to flag anomalies, replacing brittle static thresholds.",
    related: ["Anomaly Detection", "Dynamic Baseline", "Seasonality"],
    vendors: ["AppDynamics", "Dynatrace"]
  },
  {
    term: "Dynamic Baseline",
    category: "AIOps",
    definition: "A baseline that automatically adapts over time as workload patterns change, learning expected ranges per hour-of-day and day-of-week rather than relying on fixed limits.",
    related: ["Baseline", "Seasonality", "Anomaly Detection"],
    vendors: ["AppDynamics"]
  },
  {
    term: "Event Correlation",
    category: "AIOps",
    definition: "Automatically grouping related alerts and events that stem from the same underlying problem — across time, topology and similarity — to collapse an alert storm into a single actionable incident.",
    related: ["Noise Reduction", "Alert Storm", "Incident", "Deduplication"],
    vendors: ["Splunk", "Broadcom APM", "Dynatrace"]
  },
  {
    term: "Root Cause Analysis",
    abbr: "RCA",
    category: "AIOps",
    definition: "The process — increasingly automated by AIOps — of determining the underlying cause of an incident by analyzing dependencies, change events and correlated signals, rather than just treating symptoms.",
    related: ["Causal AI", "Event Correlation", "Topology", "Fault Domain"],
    vendors: ["Dynatrace", "Broadcom APM", "Splunk"]
  },
  {
    term: "Causal AI",
    category: "AIOps",
    definition: "AI that reasons about cause-and-effect relationships using a model of system dependencies, enabling deterministic root-cause identification rather than mere correlation. Dynatrace's Davis is a prominent example.",
    related: ["Root Cause Analysis", "Davis AI", "Topology"],
    vendors: ["Dynatrace"]
  },
  {
    term: "Noise Reduction",
    category: "AIOps",
    definition: "Techniques that cut down the volume of low-value alerts reaching humans — via deduplication, correlation, suppression and prioritization — so teams focus on what matters. Also called alert fatigue reduction.",
    related: ["Alert Fatigue", "Deduplication", "Event Correlation", "Alert Storm"]
  },
  {
    term: "Alert Fatigue",
    category: "AIOps",
    definition: "The desensitization that occurs when responders are overwhelmed by too many alerts — especially false or non-actionable ones — leading to missed or ignored critical signals.",
    related: ["Noise Reduction", "Alert Storm", "Alerting"]
  },
  {
    term: "Alert Storm",
    category: "AIOps",
    definition: "A flood of alerts generated in a short window, typically when a single failure cascades across many dependent components, overwhelming responders. AIOps correlation aims to collapse storms into one incident.",
    related: ["Event Correlation", "Alert Fatigue", "Cascading Failure"]
  },
  {
    term: "Deduplication",
    category: "AIOps",
    definition: "Collapsing multiple identical or near-identical alerts/events into a single record with a count, preventing the same problem from generating repeated notifications.",
    related: ["Noise Reduction", "Event Correlation"]
  },
  {
    term: "Forecasting",
    category: "AIOps",
    definition: "Predicting future values of a metric from historical patterns, used for capacity planning and to alert before a resource is exhausted (e.g., disk-will-be-full-in-3-days).",
    related: ["Anomaly Detection", "Capacity Planning", "Predictive Analytics"],
    vendors: ["Datadog"]
  },
  {
    term: "Predictive Analytics",
    category: "AIOps",
    definition: "Applying statistical models and machine learning to historical operations data to anticipate future incidents, performance degradation or capacity needs before they materialize.",
    related: ["Forecasting", "AIOps", "Capacity Planning"]
  },
  {
    term: "Outlier Detection",
    category: "AIOps",
    definition: "Identifying members of a group (e.g., one host among a fleet) whose behavior diverges significantly from peers, useful for spotting a misbehaving instance without per-host thresholds.",
    related: ["Anomaly Detection", "Clustering"],
    vendors: ["Datadog"]
  },
  {
    term: "Seasonality",
    category: "AIOps",
    definition: "Recurring, predictable patterns in time-series data (daily, weekly, holiday cycles) that anomaly-detection models must account for to avoid false alarms during expected peaks and troughs.",
    related: ["Baseline", "Anomaly Detection", "Trend"]
  },
  {
    term: "Watchdog",
    category: "AIOps",
    definition: "Datadog's AIOps engine that automatically surfaces anomalies, outliers and root causes across metrics, traces and logs without manual configuration, and narrates likely impact.",
    related: ["Anomaly Detection", "Root Cause Analysis", "AIOps"],
    vendors: ["Datadog"]
  },
  {
    term: "Auto-Remediation",
    category: "AIOps",
    definition: "Automatically executing corrective actions in response to detected problems — such as restarting a service, scaling out, or rolling back a deploy — closing the loop from detection to resolution.",
    related: ["Runbook Automation", "Self-Healing", "Closed-Loop Automation"],
    vendors: ["Splunk", "Broadcom APM"]
  },
  {
    term: "Self-Healing",
    category: "AIOps",
    definition: "A system's ability to detect failures and automatically recover — through restarts, failover, rescheduling or scaling — without human intervention, often orchestrated by AIOps and platform automation.",
    related: ["Auto-Remediation", "Resilience", "Closed-Loop Automation"]
  },
  {
    term: "Closed-Loop Automation",
    category: "AIOps",
    definition: "An end-to-end automation pattern where monitoring detects an issue, analytics determine the fix, and automation applies it — then verifies the outcome — without manual handoffs.",
    related: ["Auto-Remediation", "Runbook Automation", "Self-Healing"]
  },

  /* ---------------- SRE & Reliability ---------------- */
  {
    term: "Site Reliability Engineering",
    abbr: "SRE",
    category: "Reliability",
    definition: "A discipline originated at Google that applies software-engineering practices to operations, using SLOs, error budgets and automation to balance reliability with feature velocity.",
    related: ["SLO", "Error Budget", "Toil", "Golden Signals"]
  },
  {
    term: "Service Level Indicator",
    abbr: "SLI",
    category: "Reliability",
    definition: "A quantitative measure of a service's behavior that matters to users — such as availability, latency or error rate — expressed as a ratio of good events to total events.",
    related: ["SLO", "SLA", "Golden Signals", "Error Budget"]
  },
  {
    term: "Service Level Objective",
    abbr: "SLO",
    category: "Reliability",
    definition: "A target value or range for an SLI over a time window (e.g., 99.9% of requests succeed over 30 days). SLOs define the reliability goal teams engineer toward.",
    related: ["SLI", "SLA", "Error Budget", "Burn Rate"]
  },
  {
    term: "Service Level Agreement",
    abbr: "SLA",
    category: "Reliability",
    definition: "A formal contract with customers specifying the level of service to be delivered and the penalties for failing to meet it. SLAs are typically looser than internal SLOs to leave a safety margin.",
    related: ["SLO", "SLI", "Availability"]
  },
  {
    term: "Error Budget",
    category: "Reliability",
    definition: "The allowable amount of unreliability derived from an SLO (e.g., a 99.9% SLO permits 0.1% errors). When the budget is exhausted, teams shift focus from new features to reliability work.",
    related: ["SLO", "Burn Rate", "SRE"]
  },
  {
    term: "Burn Rate",
    category: "Reliability",
    definition: "How fast an error budget is being consumed relative to the SLO window. High burn-rate alerts fire when the budget is depleting quickly enough to threaten the SLO, enabling fast, low-noise alerting.",
    related: ["Error Budget", "SLO", "Multi-Window Alert"]
  },
  {
    term: "Toil",
    category: "Reliability",
    definition: "Manual, repetitive, automatable operational work that scales linearly with service growth and provides no lasting value. Reducing toil through automation is a core SRE goal.",
    related: ["SRE", "Runbook Automation"]
  },
  {
    term: "Availability",
    category: "Reliability",
    definition: "The proportion of time a service is operational and able to serve requests, commonly expressed in 'nines' (e.g., 99.99% = ~52 minutes of downtime per year).",
    related: ["Uptime", "SLA", "Nines", "Reliability"]
  },
  {
    term: "Mean Time To Detect",
    abbr: "MTTD",
    category: "Reliability",
    definition: "The average time between when an incident begins and when it is detected. Lowering MTTD through good observability and alerting shortens overall incident duration.",
    related: ["MTTR", "MTTA", "Incident", "Observability"]
  },
  {
    term: "Mean Time To Acknowledge",
    abbr: "MTTA",
    category: "Reliability",
    definition: "The average time between an alert firing and a responder acknowledging it, measuring the responsiveness of on-call processes.",
    related: ["MTTD", "MTTR", "On-Call"]
  },
  {
    term: "Mean Time To Resolve",
    abbr: "MTTR",
    category: "Reliability",
    definition: "The average time to fully resolve an incident from detection (or onset). A primary measure of operational efficiency; AIOps aims to reduce it via faster RCA and remediation. Also read as Mean Time To Recovery/Repair.",
    related: ["MTTD", "MTTA", "Incident", "Root Cause Analysis"]
  },
  {
    term: "Mean Time Between Failures",
    abbr: "MTBF",
    category: "Reliability",
    definition: "The average elapsed time between successive failures of a system during operation, a measure of reliability — higher is better.",
    related: ["MTTR", "Reliability", "Availability"]
  },
  {
    term: "Blast Radius",
    category: "Reliability",
    definition: "The scope of impact a failure or change can have — how many users, services or regions are affected. Limiting blast radius (via cells, canaries, isolation) reduces incident severity.",
    related: ["Cascading Failure", "Canary Deployment", "Resilience"]
  },
  {
    term: "Cascading Failure",
    category: "Reliability",
    definition: "A failure that propagates through dependent components, where the failure of one part overloads or breaks others, potentially collapsing the whole system. Mitigated with timeouts, circuit breakers and load shedding.",
    related: ["Blast Radius", "Circuit Breaker", "Alert Storm", "Resilience"]
  },
  {
    term: "Chaos Engineering",
    category: "Reliability",
    definition: "The practice of deliberately injecting failures (killing instances, adding latency, partitioning networks) into systems to test and improve their resilience before real outages occur.",
    related: ["Resilience", "Fault Injection", "Blast Radius"]
  },
  {
    term: "Resilience",
    category: "Reliability",
    definition: "A system's capacity to absorb disturbances, continue operating in degraded mode, and recover quickly from failures — achieved through redundancy, isolation, retries and graceful degradation.",
    related: ["Self-Healing", "Chaos Engineering", "Circuit Breaker"]
  },
  {
    term: "Circuit Breaker",
    category: "Reliability",
    definition: "A resilience pattern that stops calls to a failing dependency once errors cross a threshold, 'tripping' to fail fast and allow recovery, then probing before resuming traffic.",
    related: ["Resilience", "Cascading Failure", "Retry Storm"]
  },

  /* ---------------- Alerting & Incident ---------------- */
  {
    term: "Alerting",
    category: "Incident",
    definition: "The process of notifying responders when telemetry crosses a condition that indicates a problem, via channels like email, chat, SMS or paging. Effective alerting is actionable, timely and low-noise.",
    related: ["Monitor", "Threshold", "Notification", "Alert Fatigue"]
  },
  {
    term: "Monitor",
    category: "Incident",
    definition: "A configured rule that continuously evaluates telemetry against a condition (threshold, anomaly, composite) and changes state (OK/Warn/Alert) to trigger notifications. Datadog's term for an alert definition.",
    related: ["Alerting", "Threshold", "Composite Monitor"],
    vendors: ["Datadog"]
  },
  {
    term: "Threshold",
    category: "Incident",
    definition: "A fixed boundary value that, when crossed by a metric, triggers an alert (e.g., CPU > 90%). Static thresholds are simple but brittle; dynamic/anomaly approaches adapt to changing baselines.",
    related: ["Alerting", "Baseline", "Anomaly Detection"]
  },
  {
    term: "Composite Monitor",
    category: "Incident",
    definition: "An alert defined by combining the states of multiple monitors with boolean logic, used to reduce noise by alerting only when several conditions hold together.",
    related: ["Monitor", "Noise Reduction"],
    vendors: ["Datadog"]
  },
  {
    term: "Incident",
    category: "Incident",
    definition: "An unplanned disruption or degradation of a service that requires a response to restore normal operation. Incident management coordinates detection, triage, mitigation, resolution and review.",
    related: ["Incident Management", "Severity", "Postmortem", "On-Call"]
  },
  {
    term: "Incident Management",
    category: "Incident",
    definition: "The structured process of responding to incidents — detecting, classifying, mobilizing responders, communicating, resolving and learning — to minimize impact and recurrence.",
    related: ["Incident", "On-Call", "Escalation", "Postmortem"],
    vendors: ["Splunk", "Datadog"]
  },
  {
    term: "Severity",
    abbr: "SEV",
    category: "Incident",
    definition: "A classification of an incident's impact and urgency (e.g., SEV1 = critical/widespread, SEV3 = minor) that determines response priority, escalation and communication requirements.",
    related: ["Incident", "Priority", "Escalation"]
  },
  {
    term: "On-Call",
    category: "Incident",
    definition: "A rotation in which engineers are responsible for responding to alerts during a defined period. Good on-call practice balances coverage with humane load and clear escalation.",
    related: ["Escalation", "Paging", "Runbook"]
  },
  {
    term: "Escalation",
    category: "Incident",
    definition: "Routing an unacknowledged or unresolved alert to the next responder or higher tier after a timeout, ensuring incidents are not dropped. Escalation policies define the sequence and timing.",
    related: ["On-Call", "Paging", "Incident Management"]
  },
  {
    term: "Runbook",
    category: "Incident",
    definition: "A documented set of procedures for diagnosing and resolving a specific operational scenario, giving responders step-by-step guidance. Runbooks can be automated to reduce toil and MTTR.",
    related: ["Runbook Automation", "On-Call", "Toil"]
  },
  {
    term: "Runbook Automation",
    category: "Incident",
    definition: "Encoding runbook steps as executable automation that can be triggered manually or automatically in response to alerts, accelerating remediation and reducing human error.",
    related: ["Runbook", "Auto-Remediation", "Closed-Loop Automation"],
    vendors: ["Splunk"]
  },
  {
    term: "Postmortem",
    category: "Incident",
    definition: "A blameless retrospective written after an incident documenting what happened, the timeline, root cause, impact and action items, so the organization learns and prevents recurrence.",
    related: ["Incident", "Root Cause Analysis", "Blameless Culture"]
  },
  {
    term: "Maintenance Window",
    category: "Incident",
    definition: "A scheduled period during which alerts are suppressed (downtime/muting) because planned work is expected to cause anomalies, preventing false alarms during deployments or maintenance.",
    related: ["Alert Suppression", "Downtime", "Alerting"]
  },

  /* ---------------- Standards, Tools & Collection ---------------- */
  {
    term: "OpenTelemetry",
    abbr: "OTel",
    category: "Standards & Tools",
    definition: "A vendor-neutral CNCF open-source framework — APIs, SDKs and the Collector — for generating, collecting and exporting metrics, logs and traces, designed to standardize instrumentation and avoid vendor lock-in.",
    related: ["OTLP", "Collector", "Instrumentation", "Telemetry"],
    vendors: ["Datadog", "New Relic", "Dynatrace", "Splunk"]
  },
  {
    term: "OTLP",
    abbr: "OTLP",
    category: "Standards & Tools",
    definition: "The OpenTelemetry Protocol — the native wire format and transport (over gRPC or HTTP) for exporting telemetry from instrumented apps and the Collector to backends.",
    related: ["OpenTelemetry", "Collector", "Exporter"]
  },
  {
    term: "Collector",
    category: "Standards & Tools",
    definition: "The OpenTelemetry Collector — a vendor-agnostic agent/service that receives, processes (batching, filtering, enrichment) and exports telemetry, decoupling instrumentation from backends.",
    related: ["OpenTelemetry", "OTLP", "Exporter", "Pipeline"]
  },
  {
    term: "Exporter",
    category: "Standards & Tools",
    definition: "A component that sends collected telemetry from the SDK or Collector to a specific destination/backend (e.g., an OTLP exporter or a vendor exporter).",
    related: ["Collector", "OTLP", "Backend"]
  },
  {
    term: "Prometheus",
    category: "Standards & Tools",
    definition: "A widely used open-source, pull-based metrics monitoring system and time-series database with its own query language (PromQL), the de facto standard for Kubernetes metrics.",
    related: ["PromQL", "Time Series", "Scrape", "Exporter"]
  },
  {
    term: "PromQL",
    category: "Standards & Tools",
    definition: "Prometheus Query Language — a functional query language for selecting and aggregating time-series data, used to build alerts and dashboard panels.",
    related: ["Prometheus", "Query", "Aggregation"]
  },
  {
    term: "Scrape",
    category: "Standards & Tools",
    definition: "Prometheus's pull-based collection in which the server periodically fetches metrics from instrumented targets' HTTP endpoints at a configured scrape interval.",
    related: ["Prometheus", "Pull vs Push", "Exporter"]
  },
  {
    term: "Grafana",
    category: "Standards & Tools",
    definition: "A popular open-source visualization and dashboarding tool that connects to many data sources (Prometheus, Loki, etc.) to build dashboards, alerts and exploration views.",
    related: ["Dashboard", "Visualization", "Prometheus"]
  },
  {
    term: "Agent",
    category: "Standards & Tools",
    definition: "A lightweight process installed on hosts or containers that collects telemetry (metrics, logs, traces) and forwards it to a monitoring backend. Examples include the Datadog Agent and Dynatrace OneAgent.",
    related: ["Auto-Instrumentation", "Collector", "OneAgent"],
    vendors: ["Datadog", "Dynatrace", "AppDynamics"]
  },
  {
    term: "SDK",
    abbr: "SDK",
    category: "Standards & Tools",
    definition: "A software development kit providing libraries and APIs to instrument an application in a given language, enabling manual or programmatic emission of telemetry.",
    related: ["Instrumentation", "OpenTelemetry", "API"]
  },
  {
    term: "Pipeline",
    category: "Standards & Tools",
    definition: "A configurable processing flow that ingests telemetry and applies transformations — parsing, enrichment, filtering, redaction, routing — before storage. Common for logs and the OTel Collector.",
    related: ["Parsing", "Collector", "Enrichment", "Observability Pipeline"]
  },
  {
    term: "Observability Pipeline",
    category: "Standards & Tools",
    definition: "A dedicated layer (e.g., Cribl, Vector, Datadog Observability Pipelines) that collects, shapes, reduces and routes telemetry to multiple destinations, giving control over cost and data residency.",
    related: ["Pipeline", "Telemetry", "Data Reduction"],
    vendors: ["Datadog"]
  },
  {
    term: "eBPF",
    abbr: "eBPF",
    category: "Standards & Tools",
    definition: "Extended Berkeley Packet Filter — a Linux kernel technology that runs sandboxed programs in kernel space, enabling low-overhead, code-free collection of network, security and performance telemetry.",
    related: ["Auto-Instrumentation", "Network Performance Monitoring", "Profiling"]
  },

  /* ---------------- Infrastructure & Cloud ---------------- */
  {
    term: "Infrastructure Monitoring",
    category: "Infrastructure",
    definition: "Tracking the health, capacity and performance of compute, storage, network and platform resources — hosts, VMs, containers, databases — that applications run on.",
    related: ["Host", "Container", "Kubernetes", "USE Method"],
    vendors: ["Datadog", "Dynatrace"]
  },
  {
    term: "Host",
    category: "Infrastructure",
    definition: "A physical or virtual machine that runs workloads and emits resource telemetry (CPU, memory, disk, network). Many vendors price infrastructure monitoring per host.",
    related: ["Infrastructure Monitoring", "Node", "Agent"]
  },
  {
    term: "Container",
    category: "Infrastructure",
    definition: "A lightweight, isolated, portable unit packaging an application with its dependencies, sharing the host OS kernel. Containers are ephemeral, making high-cardinality, tag-based monitoring essential.",
    related: ["Kubernetes", "Pod", "Orchestration", "Cardinality"]
  },
  {
    term: "Orchestration",
    category: "Infrastructure",
    definition: "Automated coordination of containers/services — scheduling, scaling, networking, self-healing — across a cluster, typically by Kubernetes, that creates a constantly shifting topology to observe.",
    related: ["Kubernetes", "Container", "Auto-Scaling"]
  },
  {
    term: "Auto-Scaling",
    category: "Infrastructure",
    definition: "Automatically adjusting the number of running instances or resources based on demand signals (CPU, queue depth, custom metrics) to maintain performance while controlling cost.",
    related: ["Orchestration", "Saturation", "Elasticity"]
  },
  {
    term: "Network Performance Monitoring",
    abbr: "NPM",
    category: "Infrastructure",
    definition: "Monitoring traffic flows, latency, packet loss and dependencies between services, hosts and external endpoints to diagnose connectivity and network-layer performance issues.",
    related: ["eBPF", "Latency", "Service Map"],
    vendors: ["Datadog", "Broadcom APM"]
  },
  {
    term: "Database Monitoring",
    abbr: "DBM",
    category: "Infrastructure",
    definition: "Deep visibility into database performance — query execution plans, slow queries, locks, wait events and resource use — correlated with application traces to find data-layer bottlenecks.",
    related: ["Query", "Latency", "Infrastructure Monitoring"],
    vendors: ["Datadog", "AppDynamics"]
  },
  {
    term: "Cloud Monitoring",
    category: "Infrastructure",
    definition: "Observing managed cloud services (AWS, Azure, GCP) by ingesting their native metrics, logs and events alongside your own telemetry to monitor serverless, PaaS and managed resources.",
    related: ["Serverless", "Infrastructure Monitoring", "Integration"]
  },
  {
    term: "Serverless",
    category: "Infrastructure",
    definition: "A cloud execution model (e.g., AWS Lambda) where code runs in ephemeral, event-triggered functions with no managed servers. Its short-lived, high-volume invocations require specialized cold-start and trace monitoring.",
    related: ["Cold Start", "Cloud Monitoring", "Distributed Tracing"]
  },
  {
    term: "Cold Start",
    category: "Infrastructure",
    definition: "The latency incurred when a serverless function or container must be initialized from scratch (no warm instance available) before handling a request, a key serverless performance concern.",
    related: ["Serverless", "Latency"]
  },

  /* ---------------- Data, Visualization & Analysis ---------------- */
  {
    term: "Dashboard",
    category: "Visualization",
    definition: "A configurable view that arranges visualizations (graphs, tables, heatmaps) of telemetry to give an at-a-glance picture of system health and KPIs for a service, team or environment.",
    related: ["Visualization", "Widget", "Grafana", "Single Pane of Glass"]
  },
  {
    term: "Single Pane of Glass",
    category: "Visualization",
    definition: "The goal of unifying metrics, logs, traces and other signals into one consolidated interface so teams can investigate without switching between disconnected tools.",
    related: ["Dashboard", "Unified Observability", "Correlation"],
    vendors: ["Dynatrace", "Datadog", "Splunk"]
  },
  {
    term: "Correlation",
    category: "Visualization",
    definition: "Linking related telemetry across signal types — e.g., jumping from a spiking metric to the traces and logs from the same time and service — to accelerate investigation. Enabled by shared tags and IDs.",
    related: ["Single Pane of Glass", "Trace ID", "Tag", "Context"]
  },
  {
    term: "Heatmap",
    category: "Visualization",
    definition: "A visualization that uses color intensity across two axes (often time vs. value buckets) to show the distribution and density of data points, useful for spotting latency patterns across many series.",
    related: ["Histogram", "Visualization", "Dashboard"]
  },
  {
    term: "Service Catalog",
    category: "Visualization",
    definition: "A centralized inventory of all services with metadata — ownership, dependencies, SLOs, on-call, docs and health — giving teams a single source of truth for the software estate.",
    related: ["Ownership", "Dependency Map", "SLO"],
    vendors: ["Datadog", "New Relic"]
  },
  {
    term: "Topology",
    category: "Visualization",
    definition: "A model and visualization of the entities in a system (services, hosts, processes) and the relationships between them, used for impact analysis and root-cause reasoning.",
    related: ["Service Map", "Smartscape", "Dependency Map", "Root Cause Analysis"],
    vendors: ["Dynatrace", "Broadcom APM"]
  },
  {
    term: "Tag",
    category: "Visualization",
    definition: "A key–value (or simple keyword) label attached to telemetry and resources for filtering, grouping and correlation across signals. Consistent tagging is foundational to effective observability.",
    related: ["Dimension", "Label", "Cardinality", "Correlation"],
    vendors: ["Datadog"]
  },
  {
    term: "Enrichment",
    category: "Visualization",
    definition: "Adding contextual metadata to raw telemetry as it is processed — such as geo-IP, service ownership, environment or business attributes — to make it more searchable and meaningful.",
    related: ["Pipeline", "Tag", "Context"]
  },
  {
    term: "Retention",
    category: "Visualization",
    definition: "How long telemetry is kept before deletion or archival, configured per data type and often per tier. Retention drives both investigative depth and storage cost.",
    related: ["Downsampling", "Cold Storage", "Log Retention"]
  },
  {
    term: "Latency",
    category: "Visualization",
    definition: "The time taken to service a request, typically reported as a distribution (p50/p95/p99) rather than an average. A core golden signal and the most user-visible performance metric.",
    related: ["Percentile", "Tail Latency", "Golden Signals", "Response Time"]
  },
  {
    term: "Tail Latency",
    category: "Visualization",
    definition: "The high-percentile (p99+) response times representing the slowest requests. Tail latency disproportionately affects user experience and is hidden by averages.",
    related: ["Latency", "Percentile"]
  },
  {
    term: "Throughput",
    category: "Visualization",
    definition: "The volume of work a system processes per unit time — requests per second, transactions per minute or messages consumed — a key indicator of load and capacity.",
    related: ["Rate", "Saturation", "Capacity Planning"]
  },
  {
    term: "Capacity Planning",
    category: "Visualization",
    definition: "Forecasting future resource needs from historical usage and growth trends to ensure adequate capacity while avoiding over-provisioning and unnecessary cost.",
    related: ["Forecasting", "Saturation", "Throughput"]
  },
  {
    term: "Error Rate",
    category: "Visualization",
    definition: "The proportion of requests that fail (e.g., HTTP 5xx or exceptions) over total requests, a golden signal and common SLI for service health.",
    related: ["Golden Signals", "SLI", "Error Budget"]
  },
  {
    term: "Heartbeat",
    category: "Visualization",
    definition: "A periodic signal a component sends to indicate it is alive; missing heartbeats trigger 'absence' alerts that catch silent failures a threshold alert would miss.",
    related: ["Uptime Check", "Alerting", "Availability"]
  }
]);
