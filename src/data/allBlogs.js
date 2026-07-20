/* Glancer AI  -  Curated Blog Posts */
export const BLOG_POSTS = [
  {
    id: 'opentelemetry-table-stakes-what-comes-after',
    bannerImage: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'OpenTelemetry Is Now Table Stakes. Here Is What Comes After',
    subtitle: "OTel adoption hit critical mass, so shipping clean spans is not a differentiator anymore, it is the entry fee. The real race in 2026 is one layer up, in the query engines, AI correlators, and cost attribution tools that decide what your telemetry is actually worth.",
    category: 'OpenTelemetry',
    icon: '🧱',
    bgGradient: 'linear-gradient(135deg, #06121a 0%, #0e4b52 55%, #22c3d6 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-11',
    readTime: 9,
    tags: ['OpenTelemetry', 'observability', 'query engines', 'AIOps', 'cost', 'telemetry', 'SRE'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>OpenTelemetry is table stakes in 2026. Every serious vendor ingests it natively, so emitting clean OTel spans is not a differentiator anymore, it is just the price of getting in the door.</li>
    <li>The value moved up a layer. Once everyone reads the same telemetry, the pipe that carries it is a commodity. The fight is now about <strong>what you do with the data</strong> after it lands.</li>
    <li>Three parts of that new layer are worth watching: query engines that let you ask hard questions without going broke, AI correlators that turn a flood of signals into a short list, and cost attribution that finally says who is spending the budget.</li>
    <li>Pick your next tool for the layer above the pipe, not the pipe. Collection is a solved problem. "What does this data mean, and what is it costing me" is wide open, and that is where your money should go.</li>
  </ul>
</div>

<h2>The standard stopped being the story</h2>
<p>Two years ago the interesting question in observability was still which format to bet on. Today that question is boring, and boring is good. OpenTelemetry won. Datadog, Grafana, New Relic, Dynatrace, the whole field reads OTel spans as first class data, and most of them emit it too. You instrument once and you are portable. That is a real win and it took the industry a decade to get here.</p>
<p>But a standard everyone supports is by definition not a thing anyone can sell you. When every vendor can ingest the same spans, the collection pipe becomes plumbing. Nobody brags about their plumbing. So the money, and the marketing, quietly moved somewhere else, and if your buying decisions are still framed around "does it support OTel" you are shopping for last years problem.</p>

<h2>The value moved up the stack</h2>
<p>Here is the shift in one line. For years the hard part was getting the data out of your systems and into one place. That part is mostly done now. The hard part today is making sense of the mountain you collected, and paying for it without your finance team staging an intervention. The data is the same everywhere now, the difference is what you ask of it.</p>
<p>Read the 2026 trend pieces from IBM, LogicMonitor and APMdigest and you see the same three shapes over and over, even when they use different words for them. A query and analytics layer that treats telemetry like a real database. An AI layer that correlates and reasons over it. And a cost layer, because observability bills got genuinely scary. These are the three lands the vendors are racing to own, and it is worth knowing what each one actually does.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1280&q=80" alt="Rows of labeled wooden card catalog drawers" loading="lazy" /><figcaption>A query engine is the index over your telemetry. OTel got everything into the drawers, the engine is what lets you find one card fast without opening every drawer.</figcaption></figure>

<h2>Query engines, or asking hard questions without going broke</h2>
<p>The first land is the query engine. Collecting telemetry is easy now, so teams collect enormous amounts of it, and then discover that asking a real question across a week of data either times out or costs a fortune. The new generation of tools attacks that directly. They decouple storage from compute, keep the raw data in cheap object storage, and put a columnar query engine on top so an arbitrary question runs fast and the storage bill stays flat.</p>
<p>Why this matters is simple. Old style tooling forced you to decide in advance what to index, which meant the one dimension you needed during an incident was always the one you did not pay to keep. A proper query layer lets you keep everything cheap and ask the weird question later, when the outage is happening and you finally know what to look for. That freedom to ask an unplanned question is the thing your paying for, not the storage.</p>

<h2>AI correlators, from a signal flood to a short list</h2>
<p>The second land is the one getting the loudest marketing, and for once the loud part is roughly deserved. If OTel made it trivial to emit a hundred thousand spans a minute, it also made your alert stream unreadable by a human. AI correlators sit above the data and do the grouping a tired on call engineer used to do in their head. They cluster related alerts, tie them to a probable root cause, and hand you three incidents instead of four hundred alerts.</p>
<p>The good implementations are not just clustering by timestamp. They use the topology, the trace graph, and increasingly a language model that can read the telemetry and write a plain summary of what likely broke. That is a genuine change in the day to day. The catch is that a correlator is only as good as the data feeding it, so a team with messy, half labeled telemetry gets confident nonsense, which is its own kind of expensive. Garbage in still wins.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1280&q=80" alt="A laptop on a couch showing charts and a dashboard" loading="lazy" /><figcaption>Cost attribution is the least glamorous part of the new layer and often the one that pays for itself first. You cannot cut a bill you cannot break down by team.</figcaption></figure>

<h2>Cost attribution, the bill nobody reads</h2>
<p>The third land is the least exciting and the one I would actually buy first. Observability spend has quietly become one of the larger line items in a lot of engineering budgets, sometimes rivaling the compute it is meant to watch. And almost nobody can tell you which team, service, or noisy debug log is driving it. The data volume that OTel made easy to produce is exactly the thing making the invoice climb.</p>
<p>Cost attribution tools break the bill down by team and by signal, flag the high cardinality metric that quietly doubled your ingest, and let you set budgets before the surprise instead of after. It is unglamorous work and it is the fastest payback in this whole list. A tool that shows one team they are paying for a log line nobody reads tends to pay for it's own license inside a quarter.</p>

<table class="ctable">
  <thead><tr><th>Layer</th><th>What it does</th><th>The problem it kills</th><th>Buy it when</th></tr></thead>
  <tbody>
    <tr><th>OTel collection</th><td>Emits and ships telemetry</td><td>Vendor lock in, re-instrumenting</td><td>Already table stakes</td></tr>
    <tr><th>Query engine</th><td>Fast, cheap questions over raw data</td><td>Timeouts and pre-indexing regret</td><td>Queries are slow or you drop data to save money</td></tr>
    <tr><th>AI correlator</th><td>Groups signals into incidents</td><td>Alert fatigue, slow root cause</td><td>Humans cannot read the alert stream</td></tr>
    <tr><th>Cost attribution</th><td>Splits the bill by team and signal</td><td>An invoice nobody can explain</td><td>The observability bill scares finance</td></tr>
  </tbody>
</table>

<h2>What to do about it</h2>
<p>The practical move is to stop scoring tools on collection and start scoring them on the layer above it. When a vendor demos, skip past the part where they show you OTel ingest, because everyone has that. Ask how a year old arbitrary query performs and what it costs. Ask how the correlator behaves when you feed it your real, messy data instead of the clean demo set. Ask if you can see the bill broken down by team on day one.</p>
<p>None of this means ripping anything out. You already run OTel, that was the right call and it keeps you portable. It just means recognising that the interesting decisions have moved. The teams that win the next couple of years are not the ones with better instrumentation, everyone has that now. They are the ones who can ask a hard question fast, cut the noise down to something a person can act on, and actually explain thier own bill.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>OpenTelemetry becoming table stakes is the best thing to happen to observability in years, and it also quietly ended the era where instrumentation was the differentiator. The pipe is a commodity now. <strong>The value is in the layer above it</strong>: a query engine that makes hard questions cheap, a correlator that turns a flood into a short list, and cost attribution that tells you who is spending the budget. Buy for that layer, make vendors prove it on your messy data, and stop paying extra for the part that is already free.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://www.ibm.com/think/insights" target="_blank" rel="noopener">IBM, observability trends 2026</a></li>
  <li><a href="https://www.logicmonitor.com/blog" target="_blank" rel="noopener">LogicMonitor, 2026 observability trends</a></li>
  <li><a href="https://www.apmdigest.com/" target="_blank" rel="noopener">APMdigest, 2026 predictions</a></li>
</ul>
    `,
  },
  {
    id: 'autonomous-incident-remediation-which-aiops-close-the-loop',
    bannerImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'Autonomous Incident Remediation: Which AIOps Platforms Actually Close the Loop?',
    subtitle: "Every AIOps vendor has autonomous remediation on the slide deck. Far fewer let software touch production on it's own. Here is a practitioner read on Dynatrace, BigPanda, OpenObserve and Selector, what each one really automates, and where a human is still holding the button.",
    category: 'AIOps',
    icon: '🔁',
    bgGradient: 'linear-gradient(135deg, #12061a 0%, #4a1a6b 55%, #a855f7 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-11',
    readTime: 10,
    tags: ['AIOps', 'remediation', 'automation', 'Dynatrace', 'BigPanda', 'OpenObserve', 'Selector'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>"Autonomous remediation" is the most oversold phrase in AIOps right now. Almost every platform detects and correlates well. Very few will actually execute a fix in production without a human clicking approve.</li>
    <li>Closing the loop is four steps: detect, decide, act, verify. Most tools nail the first two, hedge on the third, and quietly skip the fourth. The <strong>act</strong> and <strong>verify</strong> steps are where the real differences live.</li>
    <li>On a practitioner read, Dynatrace goes furthest toward genuine automated action, BigPanda is strong at the decide step but leans on your runbooks to act, OpenObserve is excellent at detection with lighter native remediation, and Selector shines in the network and correlation lane.</li>
    <li>Do not buy the demo. Ask any vendor to show the fix running end to end on a messy system, then ask what happens when the fix is wrong. That one question sorts the real closed loops from the dashboards.</li>
  </ul>
</div>

<h2>What "close the loop" actually means</h2>
<p>The phrase gets thrown around like it has one meaning, so let us pin it down. A closed loop has four steps. Detect that something is wrong. Decide what is wrong and what should be done. Act, meaning execute the fix. Verify that the fix worked and the incident is really over. A platform that does all four without waking a person up is autonomous. A platform that does the first two and then pages you is a very good assistant, which is fine, but it is not the same thing.</p>
<p>Most of the market lives in that gap. Detection is basically a solved feature now, everyone does anomaly detection and correlation. The moment a tool wants to run a script against production is the moment the honest capabilities separate from the marketing ones. So when you read the comparisons from OpenObserve, the AIOps community, and the vendors themselves, keep asking one thing: does it act, or does it just recommend.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1280&q=80" alt="A stylized sign showing a code logo next to a flowchart diagram" loading="lazy" /><figcaption>Detect, decide, act, verify. The loop only counts as closed when the act and verify steps run without a human in the middle, and that is the part most platforms hedge on.</figcaption></figure>

<h2>Dynatrace: the closest to a real closed loop</h2>
<p>Of the four, Dynatrace is the one that most comfortably talks about acting, not just advising. Its Davis engine does the detect and decide steps with a causal model rather than pure statistics, which matters, because it gives you a root cause you can actually automate against instead of a pile of correlated alerts. On top of that the workflow tooling can trigger remediation, scaling a service, restarting a component, running a defined action, when Davis is confident enough.</p>
<p>The honest caveat is that "autonomous" here still means autonomous within the guardrails you set. You define the actions, you define the confidence bar, you decide which remediations are allowed to fire without a human. That is exactly how it should be, and it is also why the real answer to "is it autonomous" is "yes, for the narrow set of things you explicitly trusted it with." Which, to be clear, is the mature version of this, not a weakness.</p>

<h2>BigPanda: brilliant at decide, borrows your hands to act</h2>
<p>BigPanda made its name on the decide step and it is very good at it. It eats alerts from everything you already run and collapses them into a small number of real incidents, which is the single biggest time saver during a noisy outage. The correlation is the product, and if your problem is four hundred alerts and no clarity, this is a strong answer.</p>
<p>Where it is more of an orchestrator than an actor is the act step. BigPanda closes the loop mostly by triggering your existing automation, a runbook, an Ansible job, a script, rather than being the thing that reaches into production itself. That is a reasonable design, it keeps the actual fixes in tools your team already trusts. But it means the loop is only as closed as the automation you plug into the far end. BigPanda decides, your runbooks do the deed.</p>

<h2>OpenObserve: strong eyes, lighter hands</h2>
<p>OpenObserve is the interesting open source entry, and its own comparison of the top AIOps platforms is a genuinely useful read even setting aside that they wrote it. As a platform it is excellent at the collection and detection end, a fast, cost efficient place to store and query telemetry and spot the anomaly. If your priority is seeing everything cheaply, it competes well above it's price.</p>
<p>On native autonomous remediation it is lighter than the commercial incumbents, and the team is fairly upfront about that. You get the detect and a lot of the decide, and then you wire the act step through alerting and external automation. For a lot of teams that is the right trade, you own the stack, you avoid the lock in, and you accept that closing the loop is a bit more do it yourself. Great eyes, you bring the hands.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1280&q=80" alt="A person working at a laptop while holding a phone" loading="lazy" /><figcaption>Even on the most automated platforms, someone still owns the pager. The question is not whether a human is involved, it is how narrow and reversible the machine's actions are.</figcaption></figure>

<h2>Selector: the network and correlation specialist</h2>
<p>Selector comes at this from the network and infrastructure side, and that heritage shows in what it is good at. Its strength is correlating signals across a large, noisy, heterogeneous environment and turning them into a clear picture, plus a natural language layer so you can ask what is going on and get a straight answer. For network heavy and telco style operations it is a sharp fit.</p>
<p>On remediation, Selector leans toward recommended and semi automated actions, suggesting the fix and letting it run through approved workflows, more than it claims to be a hands off actor for arbitrary production changes. In its lane that is the right posture, network changes are exactly where you want a human tripwire. Read its capabilities as strong detect and decide, with act kept deliberately on a leash.</p>

<table class="ctable">
  <thead><tr><th>Platform</th><th>Detect and decide</th><th>Act (execute the fix)</th><th>How closed is the loop</th></tr></thead>
  <tbody>
    <tr><th>Dynatrace</th><td>Causal root cause via Davis</td><td>Native, within your guardrails</td><td>Closest to fully closed, for scoped actions</td></tr>
    <tr><th>BigPanda</th><td>Best in class correlation</td><td>Triggers your existing runbooks</td><td>Closed only as far as your automation reaches</td></tr>
    <tr><th>OpenObserve</th><td>Strong, cost efficient detection</td><td>External, you wire it up</td><td>Half closed by design, DIY the act step</td></tr>
    <tr><th>Selector</th><td>Deep network correlation, NL queries</td><td>Recommended and semi automated</td><td>Human kept on the button on purpose</td></tr>
  </tbody>
</table>

<h2>What closing the loop really takes</h2>
<p>Step back from the logos and the pattern is clear. The detect and decide steps are commodity now, all four do them somewhere between good and excellent. The separation is entirely in the act and verify steps, and the mature platforms treat those two with a lot of respect. Nobody serious is selling you a bot that will run any command against production because it feels confident. The good ones give you a narrow, reversible, guardrailed set of actions and a way to confirm the fix actually held.</p>
<p>That is the real buyers question, and it is not "is it autonomous." It is "how small and reversible is the set of things it will do on it's own, and what happens the moment it is wrong." A platform that can restart a stateless pod by itself and roll back the instant the signal does not recover is worth ten that promise full autonomy in a keynote. Verify is the step everyone forgets, and it is the one that decides whether you can sleep.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>Autonomous remediation is real, it is just narrower than the slides suggest, and that narrowness is a feature. <strong>Detect and decide are solved, act and verify are where the truth is.</strong> On a practitioner read, Dynatrace goes furthest toward genuine automated action inside guardrails, BigPanda owns the decide step and hands off the doing to your runbooks, OpenObserve gives you superb detection and expects you to wire the act step yourself, and Selector is the correlation specialist that keeps a human on the button by design. Ignore the word autonomous. Ask each one to fix a real thing end to end, then ask what happens when it gets it wrong.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://openobserve.ai/blog/" target="_blank" rel="noopener">OpenObserve, top 10 AIOps platforms</a></li>
  <li><a href="https://www.aiops.community/" target="_blank" rel="noopener">AIOps Community, platform comparison</a></li>
  <li><a href="https://www.selector.ai/" target="_blank" rel="noopener">Selector, AIOps capabilities</a></li>
</ul>
    `,
  },
  {
    id: 'opentelemetry-default-half-your-stack-still-dark',
    bannerImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'OpenTelemetry Is Now the Default. So Why Is Half Your Stack Still Dark?',
    subtitle: "By 2026 OTel won the instrumentation war, and every major vendor reads it. The awkward part is that most teams put it on their web services and stopped. Your AI agents, internal tools, and async jobs are still running with the lights off, and that is exactly where the new incidents live.",
    category: 'OpenTelemetry',
    icon: '🔦',
    bgGradient: 'linear-gradient(135deg, #0a1020 0%, #243b7a 55%, #4f8bff 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-10',
    readTime: 9,
    tags: ['OpenTelemetry', 'observability', 'instrumentation', 'AI agents', 'tracing', 'AIOps', 'SRE'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>OpenTelemetry is the default instrumentation layer in 2026. Every major observability vendor reads OTel spans natively, so the fight over which standard to use is basically <strong>over</strong>.</li>
    <li>Winning the standard did not hand you coverage. Most teams bolted the OTel SDK onto their HTTP services, saw pretty traces, and called it done. That is the easy half.</li>
    <li>The dark half is where the interesting failures now hide: an <strong>AI agent stuck in a loop</strong>, a queue quietly backing up, a nightly job that has been failing for a week and nobody noticed.</li>
    <li>Instrument in order of blast radius, not in order of what is easy. Async pipelines and agents first, internal tools next, batch jobs last. Getting rough coverage everywhere beats getting perfect traces in one place.</li>
  </ul>
</div>

<h2>The standard war is over, and OTel won</h2>
<p>For years the honest answer to "which tracing standard should we pick" was a shrug. You had OpenTracing, OpenCensus, a pile of proprietary agents, and a real fear of betting on the wrong horse. That is done now. By 2026 OpenTelemetry is the thing everyone agreed to speak. Datadog, New Relic, Grafana, Dynatrace, the whole crowd reads OTel spans as first-class data, and a lot of them emit it too. You can instrument once and swap backends without re-wiring your code, which is the promise the space had been making for a decade and finally kept.</p>
<p>That is a genuinely good place to be. It also created a trap that is easy to walk into. When the standard stops being the hard question, teams assume the hard part is finished. It is not. Picking OTel was step one. Actually pointing it at the parts of your system that can hurt you is the work, and that work is where most stacks quietly stall.</p>

<h2>Winning the standard is not the same as coverage</h2>
<p>Here is how it usually goes. A platform team adds the OTel SDK to the main web services, turns on auto-instrumentation, and within a day there are clean traces for every inbound request. HTTP in, database call, cache lookup, HTTP out. It looks great on the dashboard, and honestly for classic request-and-response traffic it is great. So the ticket gets closed and everyone moves on.</p>
<p>The problem is that the request path was always the easy 50%. Auto-instrumentation hooks the web framework, and if a chunk of your system does not start with an inbound HTTP request, the hooks never fire. That describes a lot of what actually runs your business now. The nice traces you are looking at are real, they are just covering the half of the system that was never the scary half.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1280&q=80" alt="A laptop on a desk showing a code editor" loading="lazy" /><figcaption>Auto-instrumentation is often a single config line, which is why teams stop there. The web service lights up and the harder surfaces get forgotten.</figcaption></figure>

<h2>The half you left dark</h2>
<p>So what is sitting in the dark. Three things, and they are not edge cases anymore, they are the middle of most modern architectures.</p>
<p>The first is AI agents. An agent does not answer one request and return. It loops, it calls tools, it retries, it makes decisions inside a window your trace treats as a single opaque span. When an agent misbehaves in prod, the exact place you need visibility is the exact place auto-instrumentation shrugs. If you have read the piece on GenAI semantic conventions you already know the shape of this gap, and it is the most expensive one to leave open.</p>
<p>The second is internal tools and admin scripts. The little Slack bot that restarts a service, the migration script someone runs by hand, the internal dashboard that writes straight to the database. These often have the widest blast radius in the whole company and the least instrumentation, because nobody thinks of them as "services." When one of them does something dumb, there is no trace to explain it, just a confused channel and a person swearing they only clicked once.</p>
<p>The third is async work. Queues, background workers, cron jobs, event consumers. There is no inbound HTTP request to hook, so the default instrumentation misses them completely. This is where backpressure builds with no alarm, and where a job can fail silently for days. A dead queue does not throw a 500 that your APM catches, it just gets slower and quieter until something downstream falls over.</p>

<h2>What to instrument next, in order</h2>
<p>You do not fix this by trying to instrument everything at once. You go in order of what can hurt you most while being blind. This is the sequence that has worked for the teams I have watched do it well.</p>
<p>Start with async pipelines and queues. This is where silent failure lives, and adding span context to your producers and consumers is the single change that surfaces the most hidden risk. You have to propagate context manually across the queue boundary, because the trace id does not ride along for free, but the payoff is immediate.</p>
<p>Go to AI agents next. Wrap each model call and each tool invocation in it's own span, and stamp a workflow id on the whole run so you can follow the loop. This is the surface that is growing fastest and breaking in the newest ways, so coverage here ages well.</p>
<p>Then internal tools and admin actions. Even a thin span around "who ran this and what did it touch" turns your scariest untracked operations into something you can audit. Batch and cron jobs come last, not because they do not matter, but because they usually fail loudly enough that you find out eventually.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1280&q=80" alt="A circuit board with many colored wires connected to it beside a keyboard" loading="lazy" /><figcaption>The dark surfaces need manual wiring. Auto-instrumentation cannot reach an async worker, so you propagate context across the boundary by hand.</figcaption></figure>

<table class="ctable">
  <thead><tr><th>Layer</th><th>Typical coverage</th><th>What breaks while it is dark</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><th>HTTP services</th><td>Full, auto-instrumented</td><td>Little, this is the well-lit part</td><td>Already done</td></tr>
    <tr><th>Async queues and workers</th><td>Almost none</td><td>Silent backpressure, jobs failing for days</td><td>First</td></tr>
    <tr><th>AI agents</th><td>Opaque single span</td><td>Loops, bad tool calls, runaway cost</td><td>Second</td></tr>
    <tr><th>Internal tools and admin</th><td>None</td><td>Wide blast radius with no audit trail</td><td>Third</td></tr>
  </tbody>
</table>

<h2>You can do this without a big project</h2>
<p>None of this needs a re-platforming effort. Because you already run OTel, the pieces you are missing are mostly manual spans in the places the auto hooks cannot see. Add a span at the top of each background worker, propagate the trace context across your queue so a job links back to the request that created it, and point everything at the one collector you already have. That is a week of focused work, not a quarter.</p>
<p>The mindset shift is the real thing. Stop treating instrumentation as a box you checked when the web service lit up. Treat it as a map of your system, and go color in the parts that are still white. The incidents of the next two years are going to start in the async and agent layers, and the teams who can see them will spend a lot less of thier weekends guessing.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>OpenTelemetry winning is a real gift, it just is not the finish line teams treat it as. The standard is settled, so the only question left is coverage, and right now coverage is the thing almost everyone is short on. <strong>Instrument in order of blast radius</strong>: async pipelines and queues first, AI agents next, internal tools after that, batch jobs last. Lean on manual spans where the auto hooks go quiet, propagate context across every async boundary, and keep one collector. Do that and the dark half of your stack stops being the place your next outage gets to hide.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://www.techtarget.com/searchitoperations/" target="_blank" rel="noopener">TechTarget, observability trends 2026</a></li>
  <li><a href="https://www.logicmonitor.com/blog" target="_blank" rel="noopener">LogicMonitor 2026 observability outlook</a></li>
  <li><a href="https://openobserve.ai/blog/" target="_blank" rel="noopener">OpenObserve, AIOps platforms</a></li>
</ul>
    `,
  },
  {
    id: 'aiops-4-percent-pilots-production-survivors-playbook',
    bannerImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'The 4% Problem: Why Most AIOps Pilots Never Ship to Production, and What the Survivors Did Differently',
    subtitle: "New survey data puts only 4% of organizations at fully operationalized AIOps, with 49% still stuck in pilots. The wall is not the model. It is organizational friction, telemetry debt, and a trust problem nobody likes to say out loud.",
    category: 'AIOps',
    icon: '🧗',
    bgGradient: 'linear-gradient(135deg, #1a1004 0%, #7a4b12 55%, #f0a63a 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-09',
    readTime: 10,
    tags: ['AIOps', 'adoption', 'SRE', 'remediation', 'telemetry', 'observability', 'automation'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Only <strong>4% of organizations</strong> have AIOps actually running in production, and 49% are still piloting, per recent survey data. The pilot-to-prod cliff is the real story, not the tech.</li>
    <li>The blocker is almost never the algorithm. It is three human-shaped problems: organizational friction, telemetry debt, and fear of letting software act on it's own.</li>
    <li><strong>Telemetry debt</strong> is the quiet killer. Feed a model noisy, half-labeled, gap-ridden data and it hands you confident nonsense, which burns the exact trust you needed to get to prod.</li>
    <li>The teams that made it treated autonomous remediation as a ladder, not a switch. They earned each rung with suggest-only mode, a scoped blast radius, and a rollback that always works.</li>
  </ul>
</div>

<h2>The cliff nobody budgets for</h2>
<p>Here is a number worth sitting with. Across recent surveys, only about 4% of organizations say they have operationalized AIOps, meaning it runs in production and people actually trust it. Nearly half, 49%, are still in pilots. So the median company has been "doing AIOps" for a while and has almost nothing in prod to show for it. That is not a technology gap. A pilot that looks great in a demo and then dies on the way to production is telling you the demo was never the hard part.</p>
<p>The cliff is predictable once you have watched it a few times. The pilot runs in a sandbox, on a clean slice of data, with a champion babysitting it. It correlates some alerts, catches an anomaly, everyone nods. Then the plan is to roll it wider, and that is where it falls. The reasons are boringly human, and they repeat.</p>

<h2>Organizational friction: the org chart is the real architecture</h2>
<p>AIOps does not fit inside one team. It touches SRE, the platform group, security, and every app team whose alerts it wants to touch. So the first wall is ownership. A pilot usually rides on one motivated person, and when that person changes teams or just gets busy, the whole thing loses it's heartbeat. Nobody inherits it because it was never anybody's actual job.</p>
<p>The second layer is approvals. The moment a system wants to take an action in production, it runs into change management, and change management was not built for software that decides on it's own. Who signs off when the tool wants to restart a service at 3am. What the review process is. Whether security is okay with it holding those permissions. These questions are slow, and a pilot with no owner does not have the political weight to push them through.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1280&q=80" alt="A small team taking notes around a table in a meeting" loading="lazy" /><figcaption>Most stalled pilots die in a meeting, not in the code. If no single team owns the rollout and its approvals, it quietly loses momentum.</figcaption></figure>

<h2>Telemetry debt: garbage in, confident garbage out</h2>
<p>The second big reason is the one vendors hate to bring up, because their demo data is always clean. Real telemetry is not. Most companies are sitting on years of inconsistent tags, metrics with no labels, logs that are just unstructured text, and cardinality that quietly explodes. That mess has a name worth using: telemetry debt. And an AIOps model trained on it does not fail gracefully, it fails confidently. It finds correlations that are noise and presents them like insight.</p>
<p>That is how the trust dies. The team turns the model on, it fires a few alerts that are obviously wrong, and now every engineer has a reason to ignore it. You do not get a second first impression. The teams that stall usually spend the whole pilot discovering that half their data is unusable, then run out of runway before they ever prove value. The data cleanup was the project, they just did not budget for it.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1280&q=80" alt="A screen showing streaming terminal output and system process metrics" loading="lazy" /><figcaption>Telemetry debt is invisible until a model has to learn from it. Inconsistent tags and unstructured logs turn into confident, wrong correlations.</figcaption></figure>

<h2>The autonomous remediation trust problem</h2>
<p>Even when the org lines up and the data is decent, there is one more wall, and it is the tallest. It is the fear of letting software act on production by itself. Nobody wants to be the engineer who approved the bot that deleted a database. So the pilot gets stuck in read-only forever, showing what it would have done, never allowed to actually do it. And a remediation system that can only suggest is a very expensive dashboard.</p>
<p>This is where the survivors think differently. They do not treat autonomy as a switch you flip from off to on. They treat it as a ladder. The tool starts by only observing. Then it is allowed to suggest, and humans grade the suggestions. Then it is allowed to act, but only on a small, low-risk, reversible set of things, like restarting a stateless pod, with a blast radius you could survive being wrong about. Each rung is earned by the rung below it working. That is how trust actually gets built, in small reversible steps and not a leap of faith.</p>

<table class="ctable">
  <thead><tr><th>Dimension</th><th>The stalled pilot</th><th>The one that shipped</th></tr></thead>
  <tbody>
    <tr><th>Ownership</th><td>One champion, no real mandate</td><td>A named owner with authority to change process</td></tr>
    <tr><th>Data</th><td>Trained on whatever was there</td><td>Paid down telemetry debt before trusting output</td></tr>
    <tr><th>Autonomy</th><td>All-or-nothing, stuck read-only</td><td>A ladder, low-risk reversible actions first</td></tr>
    <tr><th>Safety net</th><td>Hope</td><td>Rollback that always works, human tripwire</td></tr>
  </tbody>
</table>

<h2>What the survivors did differently</h2>
<p>Pull it together and the 4% look pretty consistent. They named an owner who could actually move the org, not just run a script. They treated data quality as the real project and paid down enough telemetry debt that the model had a fair chance. They shipped remediation as a trust ladder, earning each level of autonomy on a scoped, reversible blast radius. And they kept a human tripwire and a rollback that works, so the cost of the model being wrong stayed small enough that people were willing to let it try.</p>
<p>None of that is glamorous, and none of it is about a better algorithm. The predictive observability part, the correlation, the anomaly detection, that stuff mostly works now. The gap between 4% and everyone else is organizational and it is about trust. Which is good news, honestly, because those are things you can fix without waiting for a smarter model.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>The 4% number is not an indictment of AIOps tech, it is a mirror held up to how organizations adopt it. Pilots do not die because the model is dumb, they die because nobody owns them, the data underneath is a mess, and no one is willing to let the thing act. <strong>Fix the human parts first.</strong> Give it an owner with real authority, pay down telemetry debt before you trust a single alert, and roll out autonomy as a ladder with a rollback under every rung. Do that and you are building the thing the other 96% keep piloting and never ship.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://www.motadata.com/blog" target="_blank" rel="noopener">Motadata, AIOps trends</a></li>
  <li><a href="https://rootly.com/blog" target="_blank" rel="noopener">Rootly, predictive observability</a></li>
  <li><a href="https://www.idc.com/" target="_blank" rel="noopener">IDC, 2026 observability research</a></li>
</ul>
    `,
  },
  {
    id: 'aiops-finance-market-6-36b-what-sres-can-steal',
    bannerImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'Why the AIOps Market for Finance Hit $6.36B, and What Engineers Can Steal From It',
    subtitle: "Financial services AIOps grew 26.4% in a year to $6.36B (GlobeNewswire, July 2026). Banks are not buying faster because they love new tools. They buy faster because uptime is written into law, and every outage has to be explained on paper. That pressure built a playbook the rest of us can copy for free.",
    category: 'AIOps',
    icon: '🏦',
    bgGradient: 'linear-gradient(135deg, #04140d 0%, #0c5a3a 55%, #21c17a 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-08',
    readTime: 9,
    tags: ['AIOps', 'financial services', 'SRE', 'incident correlation', 'SLA', 'observability', 'compliance'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Financial services AIOps reached <strong>$6.36B in 2026</strong>, up 26.4% from the year before, per a GlobeNewswire report. That is faster then almost any other vertical is adopting.</li>
    <li>The driver is not hype. It is regulation. In banking, uptime is written into contracts and law, so an outage costs money and also has to be reconstructed for an auditor line by line.</li>
    <li><strong>Autonomous incident correlation</strong> is doing the heavy lifting. It folds a storm of alerts into one incident, which lets a small on-call team defend a very large SLA.</li>
    <li>You can copy the finance playbook without the compliance bill. Put a dollar figure on downtime, make every alert carry it's own trail, and correlate before you page anyone.</li>
  </ul>
</div>

<h2>The number that made people look twice</h2>
<p>A GlobeNewswire report this month put the financial services AIOps market at $6.36B, a 26.4% jump over the prior year. Sit with that growth rate for a second. Most enterprise software categories would be thrilled with low double digits right now. Banks and insurers and payment firms are throwing money at automated operations at a pace that looks almost impatient.</p>
<p>The easy read is "finance has deep pockets, of course they spend." That misses the point. Plenty of industries have money and still drag their feet on ops tooling for years. What makes finance different is that the cost of an outage is not fuzzy. It is a number, it shows up fast, and someone in a suit is going to ask about it on Monday.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1280&q=80" alt="A person entering a PIN on an ATM keypad" loading="lazy" /><figcaption>When the transaction has to clear right now, "we are investigating" is not an acceptable status. That constraint is what pulls banks toward AIOps early.</figcaption></figure>

<h2>Why finance moves first, and it is not because they love new tools</h2>
<p>Talk to an SRE at a bank and you will not hear a lot of excitement about the latest platform. You will hear about obligations. Three of them keep coming up.</p>
<p>The first is regulatory uptime. Payment rails, trading windows, and settlement systems have availability targets that are not aspirational, they are contractual and in some cases legal. Miss them and you are not writing a blameless postmortem for your own comfort, you are writing an explanation for a regulator who can fine you. When five nines is a compliance line and not a bragging right, you find the budget.</p>
<p>The second is the audit trail. In most companies an incident ends when the graph goes green again. In finance it ends when you can show, in order, what broke, when you knew, who was told, and what you did. That reconstruction has to hold up months later. A tool that quietly records the whole timeline of an incident is not a nice-to-have there, it is table stakes, and AIOps platforms happen to be good at exactly that recording.</p>
<p>The third is that money is bolted directly onto seconds. A retailer that goes down for ten minutes loses some carts. A trading desk that goes down for ten minutes during market hours can lose more then the annual cost of the whole observability stack. When the math is that blunt, the case for automation writes itself.</p>

<h2>What autonomous incident correlation actually buys them</h2>
<p>Here is the part general SREs should pay attention too. The feature carrying most of this spend is not a chatbot or a fancy dashboard. It is autonomous incident correlation, the boring plumbing that takes four hundred alerts firing at 2am and says "these are all one thing, and it started in the payments database."</p>
<p>Think about what an alert storm does to a human. A dependency wobbles, and every service downstream lights up at once. The on-call engineer now has to figure out which alert is the cause and which forty are just echoes. That triage is where the minutes bleed away, and in finance minutes have a price tag. Correlation collapses that pile into a single incident with a probable root, so the engineer starts at the answer instead of digging for it. Vendors like Ennetix have built their whole autonomous IT ops pitch around this, closing the loop from detect to correlate to act with less human in the middle.</p>
<p>The quiet win is headcount math. You cannot hire your way to defending a nine-figure SLA with eyeballs on dashboards. Correlation is what lets a team of six hold a service that would otherwise need thirty. That is the real reason the money is flowing, it is cheaper then the alternative.</p>

<table class="ctable">
  <thead><tr><th>Pressure</th><th>Typical SaaS shop</th><th>Financial services</th><th>Why it changes the buy</th></tr></thead>
  <tbody>
    <tr><th>Uptime target</th><td>Internal goal, aspirational</td><td>Contractual and regulated</td><td>A miss becomes a fine, not a retro</td></tr>
    <tr><th>Incident record</th><td>Ends when it is fixed</td><td>Must survive an audit months later</td><td>Automated timelines become mandatory</td></tr>
    <tr><th>Cost of downtime</th><td>Lost signups, soft number</td><td>Lost trades and settlements, hard number</td><td>ROI on automation is obvious</td></tr>
    <tr><th>On-call scale</th><td>Grows with the team</td><td>Must stay flat under load</td><td>Correlation replaces raw headcount</td></tr>
  </tbody>
</table>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1280&q=80" alt="A customer paying at a counter with a contactless card terminal" loading="lazy" /><figcaption>Every second of downtime in a payment path is a failed transaction with a name attached. Finance instruments for that reality, most other teams do not until it is too late.</figcaption></figure>

<h2>The playbook you can steal without the compliance bill</h2>
<p>You do not need a banking charter to use any of this. The mindset is portable, and the tools are the same ones on your shortlist already. Four things worth copying.</p>
<p>Put a dollar figure on downtime, even when nobody forces you to. Finance has the number handed to them. You have to make it yourself, and it is worth the afternoon. Once "an hour down costs roughly X" exists on a slide, every argument about ops budget gets shorter, because now the spend is compared against a loss and not against zero.</p>
<p>Make alerts carry their own context by default. The reason a bank can reconstruct an incident is that the trail was captured while it happened, not stitched together after. Bake the who, what, and when into the alert payload now, so your postmortems stop being archaeology. This costs almost nothing to set up and it pays back the first time an outage crosses a shift change.</p>
<p>Correlate before you page. Most teams page a human on every threshold breach and let them sort out the mess. Flip it. Let the platform group related alerts first, and only wake someone for the deduplicated incident. Your on-call keeps their sanity, and your MTTR drops without hiring anyone. This one change is where the finance data says the value actually lives.</p>
<p>Treat the SLA like a budget you can spend. Error budgets are old news in SRE circles, but finance lives them because the numbers is enforced from outside. Borrow the discipline. When you are under budget, ship faster. When you are burning it, freeze and fix. The point is to make reliability a shared number the whole team steers by, not a vibe the on-call carries alone.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>The $6.36B figure is not a story about finance being rich, it is a story about finance having no place to hide from its own outages. Regulated uptime and audit obligations turned reliability into a hard number with money attached, and once that happened, <strong>autonomous incident correlation stopped being optional</strong>. The rest of us get to skip the regulatory beating and keep the lesson. Price your downtime, capture the trail up front, correlate before you page, and run your SLA like a budget. None of that needs a bank behind it, it just needs you to decide that an outage is worth measuring before the next one shows up.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://www.globenewswire.com/" target="_blank" rel="noopener">GlobeNewswire, AIOps in Financial Services market report (July 2026)</a></li>
  <li><a href="https://www.globenewswire.com/" target="_blank" rel="noopener">Top 10 AIOps Platforms 2026</a></li>
  <li><a href="https://www.ennetix.com/" target="_blank" rel="noopener">Ennetix, Autonomous IT Operations</a></li>
</ul>
    `,
  },
  {
    id: 'monitoring-stack-cant-see-ai-agents-otel-genai-conventions',
    bannerImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&h=675&q=80',
    title: "Your Monitoring Stack Can't See Your AI Agents. Here's How to Fix That",
    subtitle: "OpenTelemetry's GenAI semantic conventions went production-stable and give you real span structures for LLM calls, tool invocations and token counts. Most teams still haven't wired them up, so their agents run in a blind spot the dashboards were never built to see.",
    category: 'OpenTelemetry',
    icon: '🛰️',
    bgGradient: 'linear-gradient(135deg, #071a24 0%, #0e5563 55%, #34d0e0 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-07',
    readTime: 10,
    tags: ['OpenTelemetry', 'GenAI', 'AI agents', 'observability', 'tracing', 'LangSmith', 'Arize', 'AIOps'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>OpenTelemetry's GenAI semantic conventions moved from experimental to production-stable, and by 2026 they give every team a <strong>shared vocabulary</strong> for LLM calls, tool invocations and token counts. The catch is that most stacks still have not turned them on.</li>
    <li>What gets captured cleanly today: model name, prompt and completion token counts, request latency, the tool an agent called, and the finish reason. For a single model call, that is genuinely good coverage.</li>
    <li>What stays invisible: <strong>multi-agent coordination</strong>, cost attribution per business workflow, and the "why did the agent take this path" question. The spec does not answer those yet, so you have to bolt that context on yourself.</li>
    <li>Proprietary SDKs like <strong>LangSmith</strong> and <strong>Arize</strong> give you prettier agent traces out of the box, however they park your telemetry inside one vendor. OTel is more work up front but your data stays portable.</li>
  </ul>
</div>

<h2>Your traces stop at the API call</h2>
<p>Here is the thing almost nobody notices until an agent misbehaves in production. Your APM already traces the HTTP request that reaches your service, and it traces the outbound call to the model provider. So on the dashboard it looks like you have coverage. But the span just says "POST /v1/messages, 4.2 seconds, 200 OK" and then it goes dark. What the agent actually did inside that window, which tools it reached for, how many tokens it burned, whether it retried a failed call three times before giving up, none of that shows up. The trace stops exactly where the interesting behaviour starts.</p>
<p>That gap is not because your tooling is bad. It is because traditional traces were designed around request and response, and a agent is neither of those things. A agent is a loop. It reasons, calls a tool, reads the result, reasons again, and it can run that loop a dozen times before it produces an answer. Each turn is a decision point where things can go wrong quietly. If your telemetry treats the whole loop as one opaque span, you have no way to see which turn broke.</p>

<h2>What the GenAI conventions actually capture</h2>
<p>This is the problem the OpenTelemetry GenAI semantic conventions set out to fix. Instead of every framework inventing it's own attribute names, the spec defines a standard shape. A model call becomes a span with attributes like <code>gen_ai.request.model</code>, <code>gen_ai.usage.input_tokens</code>, <code>gen_ai.usage.output_tokens</code>, and <code>gen_ai.response.finish_reasons</code>. A tool call becomes it's own child span with the tool name and arguments. Because the names are standardised, a trace emitted by one library reads the same in any backend that understands the convention.</p>
<p>In practice that means a few things become easy that used to be painful. You can graph token spend per model across every service without writing custom parsers. You can see the latency of the model call separated from the latency of the tool it triggered, so when a run is slow you know whether to blame the LLM or the database query it kicked off. And you can count how often a given tool gets called, which is the first real signal into what your agents spend their time doing. For a single call, honestly, this covers most of what you would want.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80" alt="Developer working across multiple screens showing code and telemetry" loading="lazy" /><figcaption>The GenAI conventions turn each model call and each tool call into a named span, so you can finally see inside the loop instead of around it.</figcaption></figure>

<h2>The blind spots nobody instrumented yet</h2>
<p>So the conventions solve the single-call problem well. However, the moment you move to real agentic systems, three gaps open up, and it is worth naming them because vendors tend to gloss over it.</p>
<p>First, multi-agent coordination. When one orchestrator agent hands work to three sub-agents that each call their own tools, the spec gives you spans for every individual call but not a clean way to express "these two agents were arguing about the same task." The parent-child span tree gets you part of the way there, still, the semantics of coordination, delegation, and hand-off are not standardised. You can see the pieces but the relationships between agents are something you have to model yourself.</p>
<p>Second, cost attribution per workflow. Token counts land on individual spans just fine. But your finance team does not ask "how many tokens did span 4f2a burn," they ask "what did the invoice-processing workflow cost us last month." Rolling per-span token counts up into a per-business-process number is not something the convention does for you. You need to add your own workflow identifiers as attributes and aggregate on them, otherwise the cost data is technically present but practically unusable.</p>
<p>Third, the reasoning path. A span can tell you the agent called the "refund" tool. It cannot tell you why the agent decided a refund was the right move, because that reasoning lives in the model output, which most teams do not capture in full for privacy and cost reasons. When an agent does something dumb, this is the exact context you wish you had, and it is the hardest to get.</p>

<h2>OTel versus the proprietary SDKs</h2>
<p>This is where the LangSmith and Arize question comes in, because those tools do give you agent-shaped traces today, with less setup. So which do you reach for. The honest answer depends on how much you value portability against time-to-first-dashboard.</p>

<table class="ctable">
  <thead><tr><th>Approach</th><th>Agent trace quality</th><th>Setup effort</th><th>Vendor lock-in</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><th>OTel GenAI conventions</th><td>Good, improving</td><td>Higher</td><td>None, fully portable</td><td>Teams that already run OTel and want one pipeline</td></tr>
    <tr><th>LangSmith</th><td>Excellent for LangChain</td><td>Low</td><td>High</td><td>Fast iteration on LangChain / LangGraph apps</td></tr>
    <tr><th>Arize Phoenix</th><td>Excellent, OTel-based</td><td>Low to medium</td><td>Medium</td><td>Eval-heavy teams who want tracing plus scoring</td></tr>
  </tbody>
</table>

<p>Worth noting that the line is blurring. Arize built Phoenix on top of OpenTelemetry, so it emits and reads OTel-compatible spans, which means you get the nicer agent views without fully leaving the open standard. New Relic went the same direction, they launched native support for the GenAI conventions so an agent instrumented with plain OTel shows up as a first-class trace in their platform, no proprietary agent required. That is the direction the whole market is heading. Start with the open convention and let the backends compete on how well they render it.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80" alt="Engineer reviewing dashboards and metrics on a large monitor" loading="lazy" /><figcaption>Phoenix and New Relic both read OTel GenAI spans natively, so you can adopt the open convention first and choose your backend later.</figcaption></figure>

<h2>How to wire it up without boiling the ocean</h2>
<p>You do not need a six-month project to close this gap. Because the conventions are stable, the fastest path is to add the OTel GenAI instrumentation package for whatever agent framework you run, point it at your existing collector, and confirm the spans land with the right attributes. Most frameworks now ship an auto-instrumentation hook, so this is often a config change rather than a code rewrite.</p>
<p>After the basics work, do two things the spec will not do for you. Add a stable workflow identifier as a span attribute at the top of every agent run, so cost and latency roll up to a business process and not just a trace id. Then decide, deliberately, how much of the model's reasoning you are willing to log, and redact the rest. That single decision is the difference between a useful post-incident review and a shrug when an agent does something you cannot explain.</p>

<div class="verdict">
  <h3>The production decision</h3>
  <p>Adopt the OpenTelemetry GenAI conventions now, even though they are incomplete, because they are the only agent telemetry that stays portable as the vendor landscape churns. <strong>Instrument the single-call basics first</strong>, that is where the spec is strongest and the payoff is immediate. Then layer your own workflow ids and a considered reasoning-capture policy on top to cover the multi-agent and cost-attribution gaps the standard has not reached yet. If you already live in LangChain and need dashboards this week, LangSmith is a reasonable shortcut, just know you are trading portability for speed and plan the migration path before the lock-in gets expensive.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://opentelemetry.io/blog/" target="_blank" rel="noopener">OpenTelemetry GenAI Blog</a></li>
  <li><a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/" target="_blank" rel="noopener">OTel AI Agent semantic conventions</a></li>
  <li><a href="https://newrelic.com/blog" target="_blank" rel="noopener">New Relic OpenTelemetry launch</a></li>
</ul>
    `,
  },
  {
    id: 'agentic-ai-top-attack-vector-2026-observability-budget',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=675&q=80',
    title: "Agentic AI Is 2026's Top Attack Vector. What That Means for Your Observability Budget",
    subtitle: "A 2026 Dark Reading poll put agentic AI as the number-one attack vector, named by 48% of security pros. Agents hold elevated permissions, spawn subprocesses and call outside tools, and almost none of that shows up in a traditional APM trace.",
    category: 'Security',
    icon: '🛡️',
    bgGradient: 'linear-gradient(135deg, #1a0812 0%, #6d1533 55%, #f0518a 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-07',
    readTime: 9,
    tags: ['security', 'agentic AI', 'attack vector', 'observability', 'AIOps', 'prompt injection', 'threat detection'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>A 2026 Dark Reading poll named <strong>agentic AI the top attack vector</strong>, picked by 48% of security professionals. That is not a hypothetical, it is where practitioners say the risk actually is right now.</li>
    <li>The reason is structural. Agents hold <strong>elevated API permissions</strong>, they spawn subprocesses, and they call external tools. A compromised agent can do real damage while looking, to your APM, like a normal service doing normal work.</li>
    <li>To catch a hijacked agent mid-run you need telemetry your current stack probably does not emit: per-tool-call audit spans, subprocess and outbound-network visibility, and a record of the prompt that triggered each action.</li>
    <li>A handful of AIOps platforms can ingest this today if you feed them OTel GenAI spans, still, most teams have the budget line for "APM" and no line for "agent behaviour," and that is the gap that needs closing.</li>
  </ul>
</div>

<h2>Why practitioners moved agents to the top of the list</h2>
<p>When 48% of security pros in the Dark Reading poll put agentic AI at number one, they were not reacting to a single flashy breach. They were reacting to a shape of risk that their existing tools do not see. Think about what an agent actually is from a security standpoint. It is a piece of software that takes natural-language instructions, some of which come from untrusted users, and turns them into actions with real privileges. That combination, untrusted input plus real power, is the classic recipe for trouble, and agents put it right at the centre of the system.</p>
<p>Traditional attack vectors are noisy. A SQL injection leaves a weird query, a port scan lights up your network monitor, a brute-force login floods the auth logs. A prompt injection that convinces an agent to exfiltrate data does none of that. The agent has permission to read the data. It has permission to call the tool. Every individual step looks legitimate because it is legitimate, the agent was just talked into doing it. So the attack hides inside authorised behaviour, which is exactly the kind of thing signature-based defences was never built to catch.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1280&q=80" alt="Dark security operations room with data displayed on monitors" loading="lazy" /><figcaption>A prompt-injected agent does not trip signature-based defences, because every step it takes is an action it was already authorised to perform.</figcaption></figure>

<h2>The three privileges that make agents dangerous</h2>
<p>It helps to be concrete about why agents are risky, because the answer points straight at what you need to monitor.</p>
<p>The first is elevated permissions. To be useful, an agent usually gets broad access. It can read the customer database, call the payments API, query internal wikis, hit third-party services. A human with that much access would be carefully audited. The agent often is not, because it was deployed as "just another service." So when it is compromised, the blast radius is whatever the sum of it's permissions allows, which is frequently enormous.</p>
<p>The second is subprocess spawning. Many agent frameworks let the model execute code, run shell commands, or launch helper processes. That is powerful and it is also a direct path from "language model output" to "arbitrary execution on your infrastructure." If your APM is watching the parent service but not the children it spawns, an attacker who steers the agent into running a subprocess has effectively escaped your visibility.</p>
<p>The third is external tool calls. Agents reach out. They fetch web pages, call APIs, read documents. Each of those is both a capability and an ingestion point for malicious instructions, the infamous indirect prompt injection where a poisoned document tells the agent what to do next. On top of that, an outbound call is how data leaves, so the tool-call boundary is exactly where exfiltration happens, and exactly where most traces say nothing useful.</p>

<h2>What telemetry actually catches a compromised agent</h2>
<p>So what would you need to see the attack while it is happening, not in the post-mortem. The list is shorter than you might fear, however it is different from what a standard APM emits.</p>
<p>You need a span for every tool call with the tool name, the arguments, and the identity of the agent that made it. That is your audit trail, and it is the single most valuable signal, because anomalous tool usage is the clearest sign of a hijack. You need subprocess and outbound-network visibility tied to the agent run, so a shell command or a call to an unfamiliar domain raises a flag. And you need at least a redacted record of the input that triggered each action, because when you are investigating, "what did the agent read right before it did that" is the first question you will ask.</p>

<table class="ctable">
  <thead><tr><th>Agent behaviour</th><th>What normal APM shows</th><th>What you actually need</th></tr></thead>
  <tbody>
    <tr><th>Tool invocation</th><td>One outbound HTTP span</td><td>Named tool span with args and agent identity</td></tr>
    <tr><th>Subprocess run</th><td>Nothing</td><td>Process span linked to the agent run</td></tr>
    <tr><th>Data exfiltration</th><td>A normal 200 response</td><td>Outbound destination flagged against an allow-list</td></tr>
    <tr><th>Prompt injection</th><td>Invisible</td><td>Redacted record of the triggering input</td></tr>
  </tbody>
</table>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1280&q=80" alt="Network cabling and server hardware in a data center" loading="lazy" /><figcaption>The tool-call boundary is where data leaves the building. If your traces go quiet there, so does your ability to catch exfiltration.</figcaption></figure>

<h2>Which platforms support this today</h2>
<p>Here is the encouraging part. Because the OpenTelemetry GenAI conventions standardised how tool calls and model calls get expressed, several AIOps and security platforms can already ingest agent telemetry, if you emit it. Platforms that lean into OTel, like New Relic and the Arize Phoenix ecosystem, will show agent tool calls as first-class spans you can alert on. LogicMonitor and other AIOps vendors have been signalling this direction in their 2026 trend guidance too, flagging agent oversight as a priority rather than a nice-to-have.</p>
<p>The gap is rarely the tool, it is the instrumentation and the budget. Most teams pay for APM and consider agent monitoring a research project. That framing is backwards for 2026. If practitioners rank agents as the top attack vector, then agent behaviour telemetry is not an experiment, it is table stakes, and the budget conversation should reflect it. Meanwhile the cost of getting this wrong is not theoretical, a single compromised agent with broad permissions is a breach waiting for a trigger.</p>

<div class="verdict">
  <h3>The production decision</h3>
  <p>Treat agent behaviour telemetry as a security control, not an observability nicety, and fund it that way. <strong>Instrument every tool call, subprocess, and outbound destination</strong> tied to the agent that made it, using the OTel GenAI conventions so the data lands in whatever AIOps platform you already run. Set alerts on the anomalies that matter, an unfamiliar outbound domain, a tool called far more than baseline, a subprocess you did not expect. And scope agent permissions like you would a privileged human, least-access by default, because the cheapest way to shrink the blast radius is to hand the agent less power in the first place.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://www.darkreading.com" target="_blank" rel="noopener">Dark Reading 2026 attack-vector poll</a></li>
  <li><a href="https://www.logicmonitor.com/blog" target="_blank" rel="noopener">LogicMonitor 2026 Trends</a></li>
  <li><a href="https://www.fiddler.ai/blog" target="_blank" rel="noopener">Fiddler AI OpenTelemetry guide for AI agents</a></li>
</ul>
    `,
  },
  {
    id: 'un-ai-governance-summit-cios-aiops-observability',
    bannerImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'What the UN AI Governance Summit Means for CIOs Who Run AIOps Stacks',
    subtitle: "The UN Global Dialogue on AI Governance just wrapped in Geneva. Skip the policy rehash. The real question for CIOs is operational, because IBM data shows organisations without AI governance policies paid $670K more per breach.",
    category: 'Governance',
    icon: '⚖️',
    bgGradient: 'linear-gradient(135deg, #0a1420 0%, #1c3d5a 55%, #4a90d9 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-07',
    readTime: 9,
    tags: ['AI governance', 'CIO', 'AIOps', 'observability', 'audit trails', 'compliance', 'UN', 'model logging'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>The UN Global Dialogue on AI Governance wrapped in Geneva on July 6 to 7. The headlines are about policy, however the part that lands on a CIO's desk is operational, not diplomatic.</li>
    <li>IBM's breach research puts a number on it: organisations <strong>without AI governance policies paid roughly $670K more per breach</strong>. Governance is not a compliance tax, it is a measurable risk reduction.</li>
    <li>From an observability angle, "governance" translates into three concrete requirements: <strong>audit trails, model decision logging, and agent action replay</strong>. Those are telemetry problems before they are legal ones.</li>
    <li>Some of this your AIOps stack can satisfy today. The rest is aspirational, so the useful exercise for a CIO is knowing which is which before you promise a regulator anything.</li>
  </ul>
</div>

<h2>The summit is a deadline, not a debate</h2>
<p>It is easy to read a story about a UN governance dialogue and file it under "interesting, not urgent." That would be a mistake for anyone who runs infrastructure. Whatever the exact wording that came out of Geneva, the direction has been clear for a while, regulators and boards are going to expect organisations to explain what their AI systems did and why. And "explain" is not a policy word, it is an engineering word. You cannot explain a decision you did not record.</p>
<p>So the honest way for a CIO to read the summit is as a deadline with a fuzzy date. At some point, and probably sooner than the roadmap slides suggest, someone with authority is going to ask you to produce a record of what a model or an agent did in a specific situation. If your systems can produce that record, governance is a reporting task. If they cannot, it is a crisis. The difference between those two outcomes is decided long before the request arrives, in how you instrumented the system.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1280&q=80" alt="Empty conference hall with rows of seats and formal lighting" loading="lazy" /><figcaption>Governance frameworks set the expectation. Whether you can meet it is decided in your telemetry pipeline, not in the boardroom.</figcaption></figure>

<h2>The $670K is a telemetry number in disguise</h2>
<p>The IBM figure is the one to keep in your back pocket for budget conversations. Organisations without AI governance policies paid about $670K more per breach than those with them. It is tempting to read that as a story about paperwork and committees, still, look closer and it is really a story about visibility. The organisations that governed their AI well were also the ones who could see what their AI was doing, which meant they detected problems faster and scoped incidents tighter.</p>
<p>That reframing matters because it tells a CIO where to spend. The $670K gap does not close by writing a policy document, it closes by being able to answer questions with data. When a model makes a bad call, can you show the input it received, the decision it produced, and the action it took as a result. If yes, your incident response is fast and your regulatory exposure is bounded. If no, every incident becomes an expensive archaeology project, and that archaeology is exactly what the extra $670K pays for.</p>

<h2>What governance requires from observability</h2>
<p>Strip away the policy language and AI governance asks for three things your telemetry stack either provides or does not.</p>
<p>The first is audit trails. Every consequential action an AI system takes should leave a durable, tamper-evident record, who or what triggered it, when, and with what inputs. This is the most achievable of the three, because it is essentially structured logging with retention and access control, something mature ops teams already know how to do.</p>
<p>The second is model decision logging. Beyond "the model was called," you want "the model was asked X and returned Y with this confidence and these alternatives considered." This is harder, because it means capturing model inputs and outputs at a fidelity that raises real cost and privacy questions. Most teams log a fraction of this and tell themselves it is enough, right up until it is not.</p>
<p>The third, and the most aspirational, is agent action replay. The ability to take a past agent run and reconstruct it step by step, every tool call, every intermediate decision, every branch it considered. This is where the honesty is needed, because very few stacks can do it today. It needs the full trace of the agent loop preserved and re-playable, and that is a level of instrumentation the OTel GenAI conventions are only starting to make practical.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1280&q=80" alt="Modern office meeting space with a table and screens" loading="lazy" /><figcaption>Audit trails are achievable today. Full agent action replay is where the gap between what governance asks and what stacks deliver is widest.</figcaption></figure>

<h2>Today versus aspirational, tool by tool</h2>
<p>Here is the map a CIO actually needs, sorted by how real each capability is right now.</p>

<table class="ctable">
  <thead><tr><th>Governance requirement</th><th>Feasible today?</th><th>What it takes</th></tr></thead>
  <tbody>
    <tr><th>Audit trails</th><td>Yes</td><td>Structured logs, retention, tamper-evidence, access control</td></tr>
    <tr><th>Model decision logging</th><td>Partly</td><td>Input and output capture with a deliberate redaction policy</td></tr>
    <tr><th>Agent action replay</th><td>Aspirational</td><td>Full OTel GenAI trace of the agent loop, preserved and re-playable</td></tr>
    <tr><th>Cost and access attribution</th><td>Partly</td><td>Workflow identifiers rolled up per business process</td></tr>
  </tbody>
</table>

<p>Most mainstream AIOps platforms handle the top row well and the middle rows with effort. The bottom row is where every vendor's roadmap outruns it's shipping product, so if a sales deck promises full replay, ask to see it on your own workload before you believe it. In the meantime, the pragmatic move is to nail the audit trail, get model logging to a defensible standard, and be transparent with your board about where replay is still a work in progress rather than pretending it is solved.</p>

<div class="verdict">
  <h3>The production decision</h3>
  <p>Read the Geneva summit as a countdown, and spend the runway building the telemetry that turns governance from a scramble into a report. <strong>Lock down audit trails first</strong>, because they are achievable now and they carry most of the $670K risk reduction. Bring model decision logging up to a fidelity you can defend to a regulator, with a clear redaction policy so cost and privacy do not blow up. Treat agent action replay as a stated goal, not a claimed capability, and hold your vendors to proof rather than roadmap. The organisations that come out ahead will not be the ones with the thickest policy binder, they will be the ones who can answer "what did your AI do, and why" with a trace instead of a shrug.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://www.un.org" target="_blank" rel="noopener">UN Global Dialogue on AI Governance</a></li>
  <li><a href="https://www.informationweek.com" target="_blank" rel="noopener">InformationWeek CIO analysis</a></li>
  <li><a href="https://www.ibm.com/reports/data-breach" target="_blank" rel="noopener">IBM Cost of a Data Breach report</a></li>
</ul>
    `,
  },
  {
    id: 'claude-sonnet-5-sre-triage-agent-oncall-rotation',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'Claude Sonnet 5 on the On-Call Rotation: What a 63% Agentic Coding Score Actually Means for SREs',
    subtitle: "Sonnet 5 scores 63.2% on agentic coding at $2 per million input tokens. Opus 4.8 scores 69.2% at $5. The 6-point gap is real. Whether it's a dealbreaker for your triage agent depends on what you're actually asking it to do at 2am.",
    category: 'SRE',
    icon: '🚨',
    bgGradient: 'linear-gradient(135deg, #0d1b2a 0%, #1e5f74 55%, #48cae4 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-06',
    readTime: 11,
    tags: ['Claude Sonnet 5', 'SRE', 'AIOps', 'triage agent', 'on-call', 'agentic AI', 'computer use', 'incident response', 'Anthropic'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Sonnet 5 scores <strong>63.2% on agentic coding</strong> benchmarks. Opus 4.8 scores 69.2%. The gap is 6 points, not 60 — and Sonnet 5 costs <strong>$2/M input tokens</strong> versus Opus 4.8's <strong>$5/M</strong>. For a triage agent running 50 incident investigations a day, that math matters.</li>
    <li>The real upgrade over Sonnet 4.6 isn't raw intelligence — it's <strong>follow-through</strong>. Sonnet 5 checks its own output without being asked, retries failed tool calls with corrected arguments, and sustains focus across long agentic chains. Those are the properties that determine whether an autonomous incident workflow actually finishes.</li>
    <li>Prompt injection resistance went from <strong>~50% attack success on Sonnet 4.6 to under 1% on Sonnet 5</strong> with safeguards on. If you're pointing a triage agent at runbooks, log queries, and external documentation, this is the safety number that should be on your threat model.</li>
    <li>Computer use in Sonnet 5 can navigate browser-based dashboards, fill forms, and execute runbook steps on a real screen. It's not a toy. Early access partners are running full insurance intake and procurement workflows on it. On-call automation is a shorter path than it was six months ago.</li>
  </ul>
</div>

<h2>The number everyone quoted wrong</h2>
<p>When Anthropic published the Sonnet 5 system card on June 30, every tech recap grabbed the 63.2% agentic coding score and put it next to Opus 4.8's 69.2% to make a point about the gap. A few of them called Sonnet 5 "almost as good." A few others said the 6-point difference makes Opus the only real choice for production agentic work. Neither framing is right, and for SREs trying to decide whether to wire this model into a triage workflow, both miss what actually matters.</p>
<p>The benchmark in question is SWE-bench Verified, which gives a model a real GitHub issue, access to the actual codebase, and a test suite, and asks it to write the fix that makes the tests pass. It's a hard test of exactly the skills that matter in autonomous operations: reading unfamiliar code, forming a hypothesis, calling the right tools, and iterating when the first attempt fails. A 63% pass rate means the model resolves six out of ten issues without human help. That's not a toy number — it was roughly where frontier models sat two years ago when the best researchers in the world were using them. The question for your on-call workflow isn't whether 63% is philosophically satisfying. It's whether it's good enough for the specific scope of what you want the agent to handle, and whether 6 additional points is worth paying 2.5x more per token to get.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80" alt="Rows of servers in a data center with blue LED lighting" loading="lazy" /><figcaption>The benchmark is a proxy. What matters is whether the model finishes the task in front of it — and Sonnet 5's gains are mostly in follow-through, not raw knowledge.</figcaption></figure>

<h2>What Sonnet 4.6 would do that Sonnet 5 actually finishes</h2>
<p>The most useful thing Anthropic published wasn't the benchmark table — it was the partner quotes, because they describe failure modes, not just scores. One early tester from Augment Code put it directly: Sonnet 5 traces a failure to its actual root cause and ships a durable fix instead of patching the symptom. Another from Kiro said it conducts thorough explorations and sustains focus noticeably longer on complex tasks. A Neel Chotai at a Rust shop described asking Sonnet 5 to investigate a bug: unprompted, it wrote a reproducing test, implemented the fix, then stashed it to confirm the bug came back without the change. All in a single pass.</p>
<p>That last one is the thing to pay attention to. The model didn't just write a fix — it ran the scientific method on itself without being asked. For an SRE context, that's the difference between an agent that tells you "I think the issue is in the connection pool" and one that tells you "I confirmed the issue is in the connection pool — I artificially reproduced the saturation condition and here's the proof." The former is a suggestion. The latter is actionable at 2am with a still-groggy on-call engineer in the loop.</p>
<p>Sonnet 4.6 would frequently stop short. The task gets hard enough, the model hits an ambiguous decision point, and it surfaces a question or produces a partial answer. Sonnet 5 pushes through more of those forks — retrying with a corrected tool argument when the first call fails, re-reading context it already processed when a later step contradicts an earlier assumption, and flagging when it's reached a point where it genuinely needs human input rather than just going quiet. For autonomous workflows, "stops short" is often worse than "gives a wrong answer," because a wrong answer at least tells you where the model's reasoning broke down.</p>

<h2>The cost math for a real triage fleet</h2>
<p>Here's where the 63% versus 69% conversation gets concrete. Agentic workflows are input-heavy in a way that casual API users underestimate. Every step in an agent loop re-sends the accumulated context: the system prompt, the tool schema, every prior tool output, the full conversation. A triage agent investigating a P1 might run 15 to 20 steps by the time it's finished checking logs, querying the metrics API, reading the relevant runbook section, and drafting a summary. That's 15 to 20 full-context sends, not 15 to 20 small tokens.</p>
<p>In practice, a substantive incident investigation consumes somewhere between 80,000 and 150,000 input tokens depending on how much log context you're feeding in. At $2/M, that's $0.16 to $0.30 per incident investigation. At $5/M (Opus 4.8), it's $0.40 to $0.75. The ratio compounds: a team running 200 incident investigations a day — a busy-but-not-unusual number for a mid-size SaaS platform during business hours — spends $32–60/day on Sonnet 5 versus $80–150/day on Opus 4.8. Monthly, that's a $1,400–2,700 difference on just this one workflow. For a triage agent that's running all the time, including nights and weekends, the gap widens further.</p>

<table class="ctable">
  <thead><tr><th>Model</th><th>Agentic coding score</th><th>Input cost (now)</th><th>Input cost (Sep 1+)</th><th>Output cost</th></tr></thead>
  <tbody>
    <tr><th>Sonnet 5</th><td>63.2%</td><td>$2/M tokens</td><td>$3/M tokens</td><td>$10/M tokens</td></tr>
    <tr><th>Opus 4.8</th><td>69.2%</td><td>$5/M tokens</td><td>$5/M tokens</td><td>$25/M tokens</td></tr>
    <tr><th>Sonnet 4.6</th><td>58.1%</td><td>$3/M tokens</td><td>$3/M tokens</td><td>$15/M tokens</td></tr>
  </tbody>
</table>

<p>The calculus that makes sense for most teams: use Sonnet 5 for volume workflows where the stakes per incident are moderate — alert triage, runbook lookup, preliminary root cause narrowing, log summarization. Reserve Opus 4.8 for the genuinely complex cases: a cascading failure across three services, a novel incident type without a matching runbook, anything where you want the model's ceiling rather than its throughput. That's not a compromise — it's the same model tiering strategy every SRE team applies to human responders.</p>

<h2>Scenario: the first-responder triage agent</h2>
<p>The most immediately deployable use case is a first-responder agent that activates on PagerDuty alert, does the first ten minutes of work a human on-call would do, and either resolves it or produces a warm handoff with a hypothesis and evidence. This is the scenario Sonnet 5 is best suited for right now, and the one where the cost-to-capability ratio makes the strongest argument.</p>
<p>In practice, a first-responder triage agent on Sonnet 5 would work roughly like this: alert fires, agent picks up the context (service name, alert text, recent deployment history), calls your metrics API to pull the relevant signals from the last 30 minutes, runs a structured log query for errors in that service, checks whether the service is behind a rollout or config change, and then either closes the alert with a "false positive, here's why" annotation or escalates with a draft hypothesis. That's four to six tool calls, a couple of read operations, and a synthesis step — squarely within what Sonnet 5 handles confidently.</p>
<p>What it won't do reliably is handle an incident that requires correlating across six services, reasoning about a subtle interaction between two deployment changes, or making a judgment call about blast radius when the evidence is ambiguous. Those are Opus 4.8 cases, and the honest answer is that they should also involve a human. The goal of a first-responder agent isn't to replace the on-call engineer — it's to get them to the right context faster so their expertise is focused on the judgment call rather than the log grep.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1280&q=80" alt="A developer's screen showing terminal output and code during a debugging session" loading="lazy" /><figcaption>A triage agent's job is to do the log grep and metrics pull so the human on-call can focus on the actual decision.</figcaption></figure>

<h2>Scenario: browser-based runbook automation via computer use</h2>
<p>The more surprising capability in Sonnet 5 is computer use, and for SREs who haven't tracked it closely, it's worth taking seriously now. Computer use lets the model control a real browser — it sees the screen, clicks, types, navigates, and reads content the way a human would. Anthropic says Sonnet 5 is substantially better at this than Sonnet 4.6, and the partner quotes back it up: Pace runs full insurance intake workflows on it, including submission intake and FNOL, using the same browser-based tools their operations teams use.</p>
<p>For on-call specifically, this matters because a lot of runbooks aren't automatable via API. They assume you can see the Grafana dashboard, click into the right panel, export a specific query result, navigate to the deployment console, and confirm a config value. That whole chain is what computer use handles. Instead of rebuilding a custom API integration for every internal tool, you point Sonnet 5 at a headless browser and a well-written runbook step, and it executes the same sequence a human would.</p>
<p>This isn't production-ready for every runbook — you'd want to start with read-only operations and verify outputs before giving it write access to anything with blast radius. But for the "gather evidence" phase of an incident, where the agent is navigating dashboards, pulling config values, and checking deployment states without changing anything, it's genuinely useful today. The injection resistance improvement (from ~50% attack success to under 1%) is what makes browser use feel less like a liability: the agent reading external documentation or a runbook wiki is much less likely to be hijacked mid-task than it was six months ago.</p>

<h2>Scenario: error correction in long-running autonomous workflows</h2>
<p>The third scenario is more subtle but probably the most important for teams thinking about putting agents into overnight or weekend autonomous windows. Error correction — the model's ability to detect that a previous step produced a wrong result and re-approach it — is what separates an agent that runs unattended for six hours from one that needs babysitting.</p>
<p>Sonnet 5's improvement here is documented but not loudly marketed. The system card notes lower rates of sycophantic behavior, which in practice means it's less likely to tell you everything looks fine when it doesn't. It's better at refusing malicious requests and resisting prompt injection, which means it's less likely to be steered off-task by a bad tool result. And the partner feedback repeatedly describes it finishing tasks where Sonnet 4.6 would stop — which means it's making better decisions about when to retry versus when to escalate.</p>
<p>For an overnight workflow — say, an agent that runs your weekly capacity planning analysis while your team sleeps, or one that runs nightly regression checks against your production API endpoints — these properties matter more than the agentic coding score. You're not asking the model to write perfect code, you're asking it to execute a workflow reliably and surface exceptions cleanly. That's a different threshold, and Sonnet 5 hits it for a lot of these use cases where Sonnet 4.6 was marginal.</p>

<h2>What the 37% failure rate actually means</h2>
<p>It's worth being direct about the gap. A 63% pass rate means 37 out of 100 issues weren't fully resolved by the agent alone. In a triage context, those 37 aren't disasters — they're escalations. The agent investigated, didn't close the incident autonomously, and handed off to a human. That's a reasonable outcome. What matters is the quality of the handoff: does the agent give the on-call engineer useful context about what it found and where it got stuck, or does it just silently time out?</p>
<p>Sonnet 5 is better at the former than its predecessors, and that's the right frame for thinking about the 37%. You're not deploying a perfect incident resolver. You're deploying a first responder that handles a majority of incidents autonomously and makes the rest faster for the human who takes over. If your triage agent resolves 60% of alerts without a page, cuts time-to-hypothesis by 8 minutes on the remaining 40%, and costs $2/M input tokens to run, that's probably one of the highest ROI infrastructure investments your team makes this quarter.</p>

<div class="verdict">
  <h3>The production decision</h3>
  <p>Run Sonnet 5 for your triage and first-responder workflows. The cost-to-capability ratio beats both Opus 4.8 (too expensive for volume) and Sonnet 4.6 (not reliable enough for autonomous follow-through). <strong>Budget at the September rate ($3/M)</strong> — the intro pricing runs out August 31 and you don't want to reprice a production agent in the middle of Q3. Set computer use to read-only initially and verify outputs before expanding scope. Log every tool call and intermediate output so when the model hits that 37% and escalates, your on-call engineer has context to work from, not a blank page. And keep Opus 4.8 in your tool belt — it still has the ceiling you want for the genuinely hard calls, the cascading failures, and the incidents nobody wrote a runbook for.</p>
</div>

<h2>One last thing about the system card</h2>
<p>The previous post on this site looked at what the Sonnet 5 system card reveals about monitoring gaps — agents failing quietly, tool calls that return plausible-but-wrong results, loops that burn tokens without triggering an alert. If you haven't read it, that's the companion piece to this one. This post is about whether Sonnet 5 is capable enough to be the agent doing the work. The other post is about how to watch it. You need both answers before you put one on a PagerDuty hook.</p>
<p>The short version: yes, Sonnet 5 is capable enough for well-scoped triage work at this price point. The infrastructure gaps in observing it are still real, and they're yours to close. The model is ready before the runbook is, which is usually how this goes.</p>
    `,
  },
  {
    id: 'ai-agents-breaking-traditional-monitoring-observability',
    bannerImage: 'https://images.unsplash.com/photo-1698668975271-2ba9a323be6b?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'Observing the Observer: How AI Agents Are Breaking Traditional Monitoring',
    subtitle: 'Anthropic spent 145 pages on how agents fail, not on how fast they code. That tells you where the next infrastructure crisis is. Your dashboards were built for services that crash loudly. Agents fail quietly, and most AIOps runbooks have not caught up.',
    category: 'Observability',
    icon: '🛰️',
    bgGradient: 'linear-gradient(135deg, #05131f 0%, #0e4d64 55%, #22d3ee 100%)',
    author: 'Ken Evans',
    authorRole: 'AI/OPS Data Analyst',
    authorBio: 'Ken Evans is an AI/OPS data analyst who writes about observability, AI agents, and the operational realities of running models in production.',
    authorImage: '',
    authorLinkedIn: '',
    avatar: 'KE',
    date: '2026-07-05',
    readTime: 10,
    tags: ['observability', 'AI agents', 'OpenTelemetry', 'AIOps', 'prompt injection', 'Claude Sonnet 5', 'Observra', 'SRE'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>The Claude Sonnet 5 system card runs to <strong>145 pages</strong> and spends most of them on how agents browse, use tools, and recover from failures. The benchmarks are almost a footnote. That framing is the story.</li>
    <li>Traditional monitoring assumes failures are <strong>loud</strong>: a crash, a 500, a saturated CPU. Agent failures are <strong>quiet</strong>. A tool call that returns wrong data, a prompt injection that succeeds, a loop that burns tokens. Your dashboards were not built to see any of it.</li>
    <li>OpenTelemetry now has a <strong>vocabulary for agents</strong>. As of v1.41 the GenAI conventions define agent, workflow, tool, and model spans. Exabeam open sourced <strong>Observra</strong> to emit that telemetry without per-agent code.</li>
    <li>The tooling moved. The <strong>runbooks did not</strong>. Most on-call teams still have no page-worthy signal for an agent that goes off the rails.</li>
  </ul>
</div>

<h2>The system card is a warning label</h2>
<p>Anthropic shipped the Claude Sonnet 5 system card on June 30, and the thing worth noticing is what got the ink. At 145 pages, it barely lingers on benchmark wins. The bulk of the document is about how agents behave when you turn them loose: how they browse the web, chain tool calls, plan across long running tasks, resist prompt injection, and recover when a step fails. There are whole evaluations, SHADE-Arena and LinuxArena, built to check whether an agent is quietly pursuing a goal you didnt give it.</p>
<p>Read that as a message to infrastructure people, because it is one. The frontier labs are telling you that reliability, not raw capability, is the hard part now. The prompt injection numbers make the point concrete: attack success on browser use dropped from roughly 50% on Sonnet 4.6 to under 1% on Sonnet 5, and effectively zero with safeguards on. That is real progress. It is also an admission that half the browser sessions on the last model could be hijacked. If the model makers are spending their best pages on failure modes, the teams running these agents in production should be spending their best dashboards on the same thing.</p>

<h2>Your dashboards were built for the wrong failure</h2>
<p>Classic monitoring rests on an assumption that has held for twenty years: when something breaks, it breaks loudly. A process dies, a request returns a 500, latency spikes, a disk fills. The four golden signals catch it, an alert fires, someone gets paged. The whole discipline is tuned to detect the moment a system stops doing its job.</p>
<p>Agents dont fail that way. An LLM based agent almost never crashes. It returns a confident, well formatted answer that happens to be wrong. It calls a tool with a subtly bad argument and keeps going. It reads a poisoned web page and follows the instruction hidden inside it. From your APM view, everything is green: 200s all the way down, latency normal, no errors thrown. The service is healthy. The behavior is broken. Thats the gap, and its not a gap you close by adding another CPU chart.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1682559736721-c2e77ff4c650?auto=format&fit=crop&w=1280&q=80" alt="Network cables running into a server rack in a data center" loading="lazy" /><figcaption>An agent run is a tree of tool calls, not a single request. Traditional traces see the HTTP layer and miss the decisions.</figcaption></figure>

<h2>Three things your stack cant see yet</h2>
<p>Walk it down to specifics. Here is what an LLM agent generates that a service does not, and what your current observability layer does with each signal today.</p>

<table class="ctable">
  <thead><tr><th>Agent signal</th><th>What it looks like</th><th>What most stacks do with it today</th></tr></thead>
  <tbody>
    <tr><th>Prompt injection</th><td>A tool result or web page carries hidden instructions the agent obeys</td><td class="best">Nothing. No span, no alert, invisible.</td></tr>
    <tr><th>Tool-call chains</th><td>A branching tree of model turns and tool calls, ten deep, per task</td><td class="best">Flattened into one HTTP trace, the reasoning is lost.</td></tr>
    <tr><th>Cost signals</th><td>Token spend per run, per user, per loop, wildly variable</td><td class="best">Shows up on the monthly invoice, not on a graph.</td></tr>
  </tbody>
</table>

<p>Take the tool-call chain, because its the one people underestimate. A single agent task is not one request, its a recursive tree. The model thinks, calls a search tool, reads the result, thinks again, calls a database, hits an error, retries, calls a third tool, and finally answers. Your distributed tracing was designed for service to service hops, so it sees the outbound HTTP calls and nothing about why the agent made them. When the task produces garbage, the trace tells you every call returned 200. Useless. You need the decision layer, the prompt, the tool inputs, the intermediate outputs, or you are debugging blind.</p>
<p>Cost is the other one that bites teams late. An agent loop that gets stuck can re-send its whole context on every step and quietly burn thousands of dollars of tokens in an afternoon, and there wont be a single error in your logs. Cost is a reliability signal now, not just a finance line. If you cant see token spend per run in near real time, you are one bad loop away from a surprise.</p>

<h2>OpenTelemetry grew a vocabulary for agents</h2>
<p>The encouraging part is that the standards body already moved. The OpenTelemetry GenAI special interest group has been at this since April 2024, and as of the v1.41 conventions there are defined span types for the things that matter: agent, workflow, tool, and model, plus required metrics for latency and token usage. The point of the standard is that a span from a LangGraph agent should look identical to a span from a raw model call, so your backend can reason about all of it the same way. Datadog was among the first commercial platforms to natively support the newer GenAI conventions.</p>
<p>The honest caveat: as of mid 2026 most of these conventions are still marked experimental, or in development status. They are not frozen. But experimental in OTel land is not the same as unusable, its the same place distributed tracing sat a few years before everyone depended on it.</p>
<p>On the emit side, the interesting recent drop is Observra, which Exabeam open sourced in the same news cycle as the Sonnet 5 card. It is a framework agnostic telemetry layer that captures token usage, tool calls, cost, and errors with zero per-agent instrumentation. It has adapters for Claude, OpenAI Agents, LangGraph, Pydantic AI and Google ADK that intercept the framework callbacks and normalize them, then fan the events out to OTel spans and logs, webhooks, local JSONL, or a SIEM. It also does PII redaction and per-session cost math before anything leaves the box. You dont have to adopt it, but it is a clean signal of where the plumbing is heading: agent telemetry as a first class stream, not an afterthought.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1280&q=80" alt="A monitor on a desk displaying a live metrics interface" loading="lazy" /><figcaption>The instrumentation exists. What most teams are missing is the panel that turns agent spans into something on-call can act on.</figcaption></figure>

<h2>The runbook problem nobody updated</h2>
<p>Heres the uncomfortable part. Even the shops that have wired up GenAI spans mostly stopped there. The telemetry lands in a backend, and then what. Theres no SLO for tool-call accuracy. No alert that fires when injection defenses trip. No page-worthy signal for an agent that has started looping. The runbook still says restart the pod and check the error rate, which is exactly the wrong instinct for a system that fails while reporting perfect health.</p>
<p>Adapting the runbook is not glamorous work but its the work. What is the blast radius when an agent with write access to a database makes a wrong call. Who gets paged, and on what signal. What does rollback even mean for an autonomous process that already took the action. These are the questions the Sonnet 5 card is implicitly asking, and most on-call rotations havent written the answers down.</p>

<div class="verdict">
  <h3>Where to start this quarter</h3>
  <p><strong>(1) Instrument the decision layer, not just the HTTP layer.</strong> Adopt the OTel GenAI spans, or emit them through a layer like Observra, so tool inputs and intermediate outputs are captured, not just outbound calls. <strong>(2) Make cost a monitored signal.</strong> Token spend per run, alerted, so a stuck loop pages someone in minutes instead of surfacing on the invoice. <strong>(3) Add an injection tripwire.</strong> If the model has safeguards that detect and refuse injected instructions, log those events and alert on the rate. <strong>(4) Rewrite one runbook.</strong> Pick your highest-privilege agent and write down the blast radius, the page trigger, and what rollback means. Just one, this quarter.</p>
</div>

<h2>Bottom line</h2>
<p>The Sonnet 5 system card is not really a model announcement, its a preview of the next infrastructure headache. Agents are getting reliable enough to trust with real access, and the failures that remain are the quiet kind your current stack was never built to catch. The instrumentation caught up faster than most people noticed. OpenTelemetry has the vocabulary, Observra has the plumbing, the vendors are lighting up support. What hasnt caught up is the operational muscle: the SLOs, the alerts, the runbooks that assume an agent can be confidently, silently wrong. That is a people and process gap, and its the one worth closing before you put your next agent in front of production.</p>
    `
  },
  {
    id: 'claude-sonnet-5-2-dollar-pricing-enterprise-budget-math',
    bannerImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    title: "The $2-Per-Million Model That's Eating Enterprise AI Budgets: Claude Sonnet 5 Explained",
    subtitle: 'Sonnet 5 costs $2 per million input tokens through August 31, then the rate moves to $3. That is a 50% jump with a date attached, and if your team runs agentic workflows at scale the difference is real money. This piece does the math instead of repeating the announcement.',
    category: 'Enterprise AI',
    icon: '🧮',
    bgGradient: 'linear-gradient(135deg, #0a1f1a 0%, #92225F 55%, #EF7BAE 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-04',
    readTime: 9,
    tags: ['Claude Sonnet 5', 'Anthropic', 'LLM pricing', 'agentic AI', 'AI budgets', 'procurement', 'Gemini 3.5 Flash'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Sonnet 5 input tokens cost <strong>$2 per million through August 31</strong>, then the published rate moves to <strong>$3 per million</strong>. That is a 50% increase with a hard date on it.</li>
    <li>Agentic workflows are <strong>input heavy</strong>. Every step re-sends context, so the input rate is the number that decides your bill, not the output rate.</li>
    <li>Worked out over a year, the jump is roughly <strong>$3,600 for a heavy solo dev</strong>, <strong>$36,000 for a ten person platform team</strong>, and <strong>$240,000 for a production agent fleet</strong>.</li>
    <li>Budget at $3 and treat the intro rate as upside. Teams that plan around the promo number are going to have an awkward September.</li>
  </ul>
</div>

<h2>The deadline is the story</h2>
<p>Most of the Sonnet 5 coverage reads like a press release with the logo swapped. Model got better, price is low, everyone claps. The detail that actually matters for anyone running this at scale is sitting in the pricing trackers at llm-stats.com and pricepertoken.com: the $2 per million input rate is introductory, and it runs through August 31. After that the listed rate is $3.</p>
<p>A 50% price move on your dominant cost line, with eight weeks of notice, is not a footnote. It is a procurement event. TechCrunch covered the launch, the Rentier Digital write up on Medium flagged the window, and almost nobody has walked through what the numbers mean for a real team. So lets do that.</p>

<h2>Why agent workflows eat input tokens for breakfast</h2>
<p>If your mental model of LLM cost comes from chat, you will get this wrong. A chat exchange sends a question and gets an answer, input and output stay roughly balanced. Agents don't work like that. An agent loop re-sends the accumulated context on every step: the system prompt, the repo excerpts, the tool outputs, the conversation so far. Ten steps in, the model has read your context ten times and written its answers once.</p>
<p>In practice we see input to output ratios of 15:1 or 20:1 on coding agents. A single task that runs ten steps can pull 40,000 to 60,000 input tokens without doing anything exotic. That is why the input rate is the whole ballgame, and why a 50% move on it lands so hard. The output rate could double tomorrow and alot of agent-heavy teams would barely notice.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1280&q=80" alt="A laptop, notes and a pen on a desk during planning work" loading="lazy" /><figcaption>Agent loops re-read the same context on every step. The input line on the invoice is where the money actually goes.</figcaption></figure>

<h2>The actual math</h2>
<p>Here are three honest scenarios. Assumptions first so you can argue with them: an average agent run consumes about 50,000 input tokens, a heavy individual user fires 250 to 300 runs a day, a platform team of ten runs shared pipelines on top of individual use, and a production fleet processes about a million runs a month at a leaner 20,000 tokens per run because the prompts are tuned.</p>

<table class="ctable">
  <thead><tr><th>Scenario</th><th>Input tokens / month</th><th>At $2 / M</th><th>At $3 / M</th><th>Extra per year</th></tr></thead>
  <tbody>
    <tr><th>Heavy solo dev</th><td>~300M</td><td>$600</td><td>$900</td><td class="best">+$3,600</td></tr>
    <tr><th>10 person platform team</th><td>~3B</td><td>$6,000</td><td>$9,000</td><td class="best">+$36,000</td></tr>
    <tr><th>Production agent fleet</th><td>~20B</td><td>$40,000</td><td>$60,000</td><td class="best">+$240,000</td></tr>
  </tbody>
</table>

<p>None of these numbers include output tokens, retries, or eval runs, so treat them as floors. The point isn't the exact figures, its the shape. At solo scale the jump is an annoyance. At team scale it is a line item someone has to defend. At fleet scale it is a quarter million dollars appearing in the budget because of a calendar date.</p>
<blockquote><strong>Worth reframing:</strong> stop thinking in price per token and start thinking in price per completed task. A task that takes 50k input tokens costs about a dime today and fifteen cents in September. Multiply by how many tasks your org actually runs and the abstraction gets very concrete.</blockquote>

<h2>Sonnet 5 against Gemini 3.5 Flash</h2>
<p>The obvious counter is Google. Gemini 3.5 Flash pushes roughly 4x the token throughput of the frontier tier, and for some workloads speed is the currency that matters. The honest comparison is not one model versus the other, it is workload versus workload.</p>
<p>Interactive loops, the kind where a human is watching the agent work, favor Flash. Nobody enjoys watching a spinner, and 4x throughput turns a two minute agent task into thirty seconds. Batch work flips it. If a pipeline runs overnight, nobody cares whether a step took four seconds or one, and Sonnet 5's 63.2% on agentic coding benchmarks means fewer failed runs to re-pay for. A failed run costs you its full token bill and gives you nothing, so per-step reliability is a cost lever too, and people keep leaving it out of the spreadsheet.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80" alt="Analytics dashboards with charts on a screen" loading="lazy" /><figcaption>Speed wins when a human is waiting. Reliability wins when the pipeline runs at 3am. Price them separately.</figcaption></figure>

<h2>What to tell procurement</h2>
<p>Engineers read the benchmark table, finance reads the rate card, and the deal gets signed somewhere in between. This is one of the rare cases where both sides need the same brief.</p>

<div class="callout">
  <div class="callout-title">Five moves before August 31</div>
  <strong>(1) Budget at $3.</strong> Model the fleet at the post-intro rate. If the economics only work at $2, they dont work. <strong>(2) Measure your real ratio.</strong> Pull one week of usage and compute your actual input to output split, not the industry guess. <strong>(3) Trim the loop.</strong> Prompt caching and tighter context windows cut the input bill at any rate, and the work pays back forever. <strong>(4) Don't sign annuals on a promo.</strong> Any committed spend deal priced off the intro rate should have the September number written in. <strong>(5) Re-run the Flash comparison on your workload.</strong> Not on the leaderboard. Your tasks, your latency budget, your failure rates.</div>

<h2>Bottom line</h2>
<p>Sonnet 5 at $2 per million is a genuinely good deal, and it is a deal with an expiry date printed on it. The teams that will feel fine in September are the ones doing the arithmetic in July: measure the real input ratio, budget at three dollars, cache what you can, and decide per workload where Flash's speed beats Sonnet's reliability. The model is not eating anyone's budget. Unexamined token flow is. The math takes an afternoon, and this particular afternoon has a deadline.</p>
    `
  },
  {
    id: 'openai-jalapeno-inference-chip-developers',
    bannerImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1600&q=80',
    title: "OpenAI Is Building Its Own Chips: What the 'Jalapeño' Inference ASIC Means for Developers",
    subtitle: 'The GPT-5.6 preview landed the same week as news of Jalapeño, an inference ASIC OpenAI is building in house. Most coverage filed it under cost cutting. The bigger story is control: whoever owns the silicon owns the speed and price curve, and third party latency comparisons quietly stop meaning much.',
    category: 'AI Infrastructure',
    icon: '🌶️',
    bgGradient: 'linear-gradient(135deg, #1a0a05 0%, #9a3412 55%, #fb923c 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-04',
    readTime: 8,
    tags: ['OpenAI', 'Jalapeño', 'inference ASIC', 'GPT-5.6', 'AI infrastructure', 'custom silicon', 'latency'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>OpenAI confirmed <strong>Jalapeño</strong>, a custom inference ASIC, alongside the <strong>GPT-5.6 preview</strong>. The two announcements are really one announcement.</li>
    <li>This is not mainly about saving money on GPUs. It is about <strong>owning the speed and price curve</strong> the way Apple owns its silicon roadmap.</li>
    <li>Once model and metal are co-designed, <strong>third party latency comparisons lose their meaning</strong>. A tokens-per-second number only describes one vendor's stack on one day.</li>
    <li>For teams choosing providers, the practical shift is that speed becomes a product feature that can be repriced, wich changes how you should write your evals and your contracts.</li>
  </ul>
</div>

<h2>Two announcements that are really one</h2>
<p>The GPT-5.6 preview got the headlines, the chip got a paragraph. Flip that. The MarketingProfs AI update on July 3 mentioned Jalapeño almost in passing, and OpenAI's own post is careful to frame it as an efficiency project. Read the two together and the picture is different: the next model generation and the hardware it runs on are being designed by the same company, on the same schedule, for each other.</p>
<p>We already saw what happens when OpenAI rents speed. GPT-5.6 Sol previewing on Cerebras hardware at up to 750 tokens a second was the demo, and it proved latency is a product people will pay for. Renting that speed from someone else's fab is a bridge. Jalapeño is the destination, the same speed without the landlord.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80" alt="Macro shot of a circuit board" loading="lazy" /><figcaption>Inference is a physics problem before it is a software problem. Owning the silicon means owning the physics.</figcaption></figure>

<h2>The Apple playbook, applied to inference</h2>
<p>Apple did not build the M series chips to save money on Intel invoices. They built them so that performance, battery life and release timing stopped being someone else's decision. Ask any Mac user what changed after 2020, the answer is everything got faster and nobody outside Apple can explain exactly why or copy it directly. That is the position OpenAI is playing for.</p>
<p>A model vendor that owns its inference silicon can do things a GPU tenant cannot. It can ship a model that only hits its advertised latency on its own metal. It can price aggressive speed tiers because the margin lives in-house. It can tune the hardware for one architecture instead of every architecture, its a completely different efficiency game. And it can time model releases to silicon availability, the way Apple times software to hardware every autumn.</p>
<blockquote><strong>Worth reframing:</strong> the API was never the product. The product is a speed and price curve, and custom silicon is how you bend that curve without asking Nvidia or a cloud landlord for permission.</blockquote>

<h2>Why third party latency comparisons stop meaning much</h2>
<p>Sites like llm-stats.com do useful work, and their tokens-per-second tables are about to get a lot less comparable. Today a latency number roughly describes how a model behaves on broadly similar accelerators. Once vendors co-design model and chip, that number describes one vertically integrated stack at one moment, on hardware you cannot rent, benchmark independently, or reason about from the outside.</p>
<p>The comparison problem gets worse, not better, as each vendor goes vertical. Google already runs Gemini on TPUs. OpenAI is building Jalapeño. The number that used to feel like a property of the model becomes a property of the company, and companies change their serving stack whenever they want, without a changelog entry.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80" alt="Rows of servers in a dark data center" loading="lazy" /><figcaption>When the serving stack is proprietary end to end, a public latency table is a snapshot of a black box.</figcaption></figure>

<h2>What this means when you pick a provider</h2>
<p>The practical consequences are less abstract than the strategy talk. Speed is becoming a priced feature, so expect latency tiers the same way you get storage tiers, and expect the fast tier to cost real money once it runs on scarce custom silicon. Lock-in is moving below the API too. Prompts port between vendors with some pain. A workflow built around one vendor's latency profile ports much worse, because the competitor physically cannot match the response curve.</p>
<p>Your evals need to change with this. A leaderboard latency number tells you almost nothing about what your workload will experience next quarter. Measure your own p95 on your own tasks, from your own region, and re-measure on a schedule, because the stack under you is now allowed to change silently.</p>

<div class="callout">
  <div class="callout-title">Four practical moves</div>
  <strong>(1) Benchmark your workload, not the leaderboard.</strong> Your prompts, your context sizes, your region, monthly. <strong>(2) Put latency in the contract.</strong> If response time matters to your product, get a p95 commitment in writing, not a marketing page. <strong>(3) Price the fast tier separately.</strong> Model your costs assuming speed becomes a paid add-on, because it will. <strong>(4) Keep one workload portable.</strong> Maintain a second provider path for your most latency-tolerant pipeline, it keeps the negotiation honest.</div>

<h2>Bottom line</h2>
<p>Jalapeño is not a procurement story about GPU bills. It is OpenAI deciding that the speed of its models should be a thing it controls all the way down, the same bet Apple made and won. For developers the takeaway is simple and slightly uncomfortable: latency numbers are becoming vendor property, comparisons are becoming snapshots, and the only benchmark that will keep telling you the truth is the one you run yourself.</p>
    `
  },
  {
    id: 'google-1-billion-ai-mode-users-gemini-flash-distribution',
    bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
    title: "1 Billion AI Mode Users: What Google's Gemini 3.5 Flash Tells Us About the Real AI Race",
    subtitle: 'Google says AI Mode in Search crossed a billion monthly users, about 100 million ahead of the weekly number ChatGPT reports. The model behind it is Gemini 3.5 Flash, and the lesson is not about benchmarks. It is about what happens when good enough ships inside the default.',
    category: 'AI Industry',
    icon: '📡',
    bgGradient: 'linear-gradient(135deg, #050a1f 0%, #052962 55%, #378ADD 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-04',
    readTime: 8,
    tags: ['Google', 'Gemini 3.5 Flash', 'AI Mode', 'ChatGPT', 'distribution', 'AI adoption', 'Search'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Google reports <strong>1 billion monthly AI Mode users</strong>, roughly 100 million more than the weekly active figure ChatGPT publishes. The metrics dont line up cleanly, and the gap is still the story.</li>
    <li>The engine behind it is <strong>Gemini 3.5 Flash</strong>, running about 4x faster than 3.1 Pro. Not the smartest model Google has. The one fast and cheap enough to put in front of everyone.</li>
    <li>The real moat is <strong>distribution</strong>: Search, Android, Chrome, Workspace. Google does not acquire AI users, it flips defaults.</li>
    <li>For builders the lesson is uncomfortable but useful: the winner of the AI era gets decided by defaults and distribution, not by teh top of the benchmark table.</li>
  </ul>
</div>

<h2>A billion users, with an asterisk</h2>
<p>Let me do the honest thing the press releases skipped and point at the asterisk first. Google's number is monthly users of AI Mode. The ChatGPT figure everyone compares it against is weekly actives. Monthly versus weekly is not a fair fight, a monthly count will always flatter, and anyone who has ever owned a metrics dashboard know exactly why the comparison got framed that way.</p>
<p>Here is the thing though. Discount the number however you like. Halve it. The corrected picture is still hundreds of millions of people touching a Gemini model every month without ever downloading an app, creating an account, or making a single deliberate choice to use AI. The coverage on USAII and StartupHub.ai focused on the race framing. The mechanism underneath is more interesting than the horse race.</p>

<h2>Good enough, everywhere, beats best, somewhere</h2>
<p>Gemini 3.5 Flash is not the strongest model Google can build. It is the strongest model Google can afford to run for a billion people, and that distinction is the whole strategy. Flash runs roughly 4x faster than 3.1 Pro, cheap enough to serve inside a free product, fast enough that the answer appears before the user's patience runs out. On a leaderboard it sits below the frontier tier. Inside a Search results page, against the alternative of nothing, it is magic.</p>
<blockquote><strong>Worth reframing:</strong> the question that decides adoption is never "wich model is best." It is "which model is already there when a normal person has a question." Those are different competitions with different winners.</blockquote>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1280&q=80" alt="A desk with multiple screens showing work in progress" loading="lazy" /><figcaption>Nobody at this desk chose a model off a leaderboard. The model that wins is the one already sitting in the tools they open anyway.</figcaption></figure>

<h2>The moat is the funnel</h2>
<p>OpenAI spends real money and effort getting people to open ChatGPT. Google skips the entire acquisition problem. The Search box is already the default question-asking surface for most of the planet. Android is in a few billion pockets. Workspace sits in front of office workers all day. Turning AI Mode on inside those surfaces converts existing habits into AI usage at a marginal acquisition cost of about zero.</p>
<p>This is the part benchmark-first analysis keeps missing. Model quality gaps shrink every quarter, distribution gaps dont. A two point benchmark lead evaporates with the next release cycle. A default placement inside the world's search engine has to be pried away, by regulators or by a habit shift, and both of those move on decade timescales.</p>

<h2>What this means for builders</h2>
<p>If you are building on these models, the race framing matters less than three practical consequences. Price pressure flows downhill: a vendor serving a billion free users needs cheap inference, and that scale keeps pushing API prices down for everyone, Flash-class models are the proof. Meeting users in defaults beats dragging them to destinations: the product pattern that wins is the one that shows up inside an existing workflow, not the one that asks for a new habit. And leaderboard deltas are a bad roadmap input: build against the capability tier that is cheap and everywhere, upgrade opportunistically when the frontier gets commoditized, wich it reliably does.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1280&q=80" alt="A person working with information on a laptop" loading="lazy" /><figcaption>The AI your users meet first will be whatever their existing tools ship by default. Plan for that, not for the leaderboard.</figcaption></figure>

<div class="callout">
  <div class="callout-title">Three things to take away</div>
  <strong>(1) Read past the metric.</strong> Monthly versus weekly is spin, the distribution story survives the correction anyway. <strong>(2) Watch defaults, not demos.</strong> The adoption curve lives in Search, Android and Workspace settings screens, not in launch keynotes. <strong>(3) Build for the Flash tier.</strong> Fast, cheap and everywhere is the tier your users will actually meet, design your product around it.</div>

<h2>Bottom line</h2>
<p>A billion monthly users is a squishy number wearing a precise costume, and it still tells you who is winning what. Google is not trying to win the benchmark race, it is converting the largest distribution machine ever built into an AI delivery system, one default toggle at a time. Gemini 3.5 Flash is the ammunition, not the story. The story is that in this market, the shortest path to a user beats the highest score, and Google owns most of the short paths.</p>
    `
  },
  {
    id: 'claude-fable-5-19-day-blackout-enterprise-risk-playbook',
    bannerImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    title: 'The 19-Day AI Blackout That Rewrote the Enterprise Risk Playbook',
    subtitle: 'Claude Fable 5 and Mythos 5 went dark worldwide on June 12 after a jailbreak, and came back on July 1 with a new cybersecurity classifier. The story worth reading is not that the model returned. It is what those 19 days exposed about how fragile enterprise AI really is.',
    category: 'Enterprise AI',
    icon: '🔒',
    bgGradient: 'linear-gradient(135deg, #1a0505 0%, #7f1d1d 55%, #f87171 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-03',
    readTime: 9,
    tags: ['Claude Fable 5', 'Mythos 5', 'enterprise AI', 'CISO', 'SLA', 'vendor lock-in', 'AI risk'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Claude <strong>Fable 5</strong> and <strong>Mythos 5</strong> were pulled offline globally on <strong>June 12</strong> after a jailbreak, and didn't return until <strong>July 1</strong>. That is a 19 day gap, and plenty of teams felt every day of it.</li>
    <li>The models came back with a <strong>new cybersecurity classifier</strong> sitting in front of them, wich tells you the shutdown was a safety response and not a billing hiccup.</li>
    <li>The real lesson isn't "the model is back." Its what the blackout revealed about how fragile enterprise AI dependencies actually are.</li>
    <li>CISOs should treat this like a live fire drill and rewrite the vendor SLA before the next outage, not after.</li>
  </ul>
</div>

<h2>Nineteen days is a very long time to be down</h2>
<p>Most cloud incidents you read about are measured in minutes. A region blips, a load balancer misbehaves, the status page turns yellow for an hour and then everyone moves on. This was not that. A frontier model family going dark for nearly three weeks is the kind of event that reprices how a whole industry thinks about dependency.</p>
<p>The reporting from VentureBeat and the follow-ups on MarkTechPost line up on the basic timeline. On June 12 a jailbreak against Fable 5 and Mythos 5 pushed the vendor to pull both models globally. Not throttle them, not degrade them. Pull them. They stayed unavailable until July 1, when they returned with a cybersecurity classifier layered in front to catch the class of prompt that caused the trouble in the first place.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80" alt="Lines of code glowing on a dark screen" loading="lazy" /><figcaption>A single jailbreak class was enough to take two frontier models offline worldwide. The blast radius of one prompt is bigger than most risk registers assume.</figcaption></figure>

<h2>What actually happened, minus the drama</h2>
<p>Strip out the hot takes and the shape of the incident is simple. Someone found a reliable way to make the model do something it was not supposed to do. The vendor decided the safest move was full withdrawal while they built a mitigation. MarketScale framed the return as a maturity signal, and I think that read holds up. A company that ships a classifier and a public timeline is behaving more like a regulated utility than a startup crossing its fingers.</p>
<p>Here is the uncomfortable part for anyone who built on top of those models. The decision to pull them was not yours to make. You didn't get a vote, a heads up window, or a migration path. One morning the capability was there, and the next it was gone, and it stayed gone for 19 days.</p>
<blockquote><strong>Worth reframing:</strong> availability of a frontier model isn't a property of your architecture. It is a property of someone else's safety posture, and that posture can change overnight for reasons that have nothing to do with your uptime.</blockquote>

<h2>The dependency nobody drew on the architecture diagram</h2>
<p>Walk into most engineering orgs and ask for the system diagram. You will see load balancers, databases, queues, a cache, maybe a nice little icon for the model API off to the side. That little icon is doing alot of quiet work. For a growing number of products it isn't a feature, it's the product, and it's single sourced from one vendor.</p>
<p>Databases get replicas. Payment providers get a fallback. Even DNS gets a secondary. The model, in most stacks, gets nothing. There is no warm standby, no second provider wired up behind a feature flag, no graceful degradation path that keeps the lights on when the primary disappears. The blackout made that gap visible in a way a slide deck never could.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80" alt="Close-up of circuitry on a server board" loading="lazy" /><figcaption>The new classifier that shipped with the return is a good fix. It also proves the point: the safety layer between you and the model is fully in the vendor's hands.</figcaption></figure>

<h2>Vendor lock-in wears a friendly face</h2>
<p>Lock-in rarely shows up as a contract clause. It shows up as a thousand small decisions that were reasonable at the time. You tuned your prompts to one model's quirks. Your eval suite is calibrated to its output. Your latency budgets assume its response curve. Each choice was fine on its own. Stacked together they mean that swapping providers under pressure is a multi week project, not a config change, and 19 days isn't enough runway to do it cleanly.</p>
<p>Teams that had a second model already wired up rode this out. They flipped a flag, ate a small quality hit, and kept serving customers. Teams that were single sourced spent the outage explaining to their own leadership why a core feature was dark and there was nothing to do but wait. Those are two very different Mondays.</p>

<h2>What CISOs should demand in the next SLA</h2>
<p>At this point it stops being news and turns into a checklist. If you own risk for an org that leans on a frontier model, the blackout handed you a free lesson. Spend it. The old SLA language about uptime percentages doesn't cover the failure mode you just watched, because this was not an outage in the traditional sense. It was a deliberate, safety motivated withdrawal, and your paper needs to speak to that.</p>

<div class="callout">
  <div class="callout-title">Five things to put in the contract before the next incident</div>
  <strong>(1) Withdrawal notice.</strong> A committed heads up window for planned or safety driven model retirements, separate from unplanned downtime. <strong>(2) Capability continuity.</strong> A named fallback model tier the vendor guarantees stays available if the flagship is pulled. <strong>(3) Version pinning.</strong> The right to stay on a known good version for a defined period rather than being force migrated. <strong>(4) Data and eval portability.</strong> Contractual support for exporting your fine tunes, prompts, and eval sets so a switch isn't a rebuild. <strong>(5) Incident transparency.</strong> A post incident report obligation with a real timeline, not a status page emoji.
</div>

<p>None of that removes the risk. What it does is move the risk from "silent and total" to "known and bounded," which is the whole job. A CISO can't promise a model never disappears. A CISO can absolutely promise that if it does, there's a written plan, a fallback, and a phone number that gets answered.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1280&q=80" alt="A developer working across several screens" loading="lazy" /><figcaption>The teams that survived the blackout were not smarter. They just had a second model wired behind a flag before they needed it.</figcaption></figure>

<h2>The one exercise to run this week</h2>
<p>Forget the contract for a second and do something operational. Pick your most model dependent user flow and ask a blunt question. If the primary model vanished right now, for 19 days, what happens? Walk it all the way through. Who notices, what breaks, what is the fallback, how long to stand it up, what do you tell customers on day one and day ten.</p>
<p>If the honest answer is "we wait and hope," you have found your top risk item, and you found it in a tabletop exercise instead of in production. That is the good outcome. The blackout already ran the experiment for you. All you have to do is read the results and act like they will happen again, because they probably will.</p>

<h2>Bottom line</h2>
<p>Fable 5 and Mythos 5 coming back is the boring half of this story. The interesting half is that a jailbreak, a vendor decision, and 19 days of silence just gave every enterprise a preview of a failure mode most of them never planned for. The classifier fixes the specific hole. It does nothing for the structural fact that your most important capability might be single sourced from a vendor who can, and will, turn it off to keep everyone safe. Rewrite the SLA. Wire up the fallback. Do it while the memory is fresh, because the next blackout won't send a calendar invite.</p>
    `
  },
  {
    id: 'frontier-ai-public-tier-sovereign-tier-access-bifurcation',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    title: 'Who Actually Gets to Use the Most Powerful AI Models Now?',
    subtitle: 'GPT-5.6 Sol is gated to around 20 organizations. Fable 5 just came back from a government-ordered blackout. Grok 4.5 is private beta only. Three frontier models, three different velvet ropes, and one quiet trend hiding underneath: frontier AI is splitting into a public tier and a sovereign tier.',
    category: 'AI Industry',
    icon: '🚪',
    bgGradient: 'linear-gradient(135deg, #0a0a2e 0%, #4338ca 55%, #a78bfa 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-03',
    readTime: 8,
    tags: ['GPT-5.6 Sol', 'Fable 5', 'Grok 4.5', 'frontier AI', 'AI access', 'AI policy', 'sovereign AI'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Three frontier launches, three completely different access regimes: <strong>GPT-5.6 Sol</strong> is government gated to roughly <strong>20 orgs</strong>, <strong>Fable 5</strong> just returned from a government ordered blackout, and <strong>Grok 4.5</strong> is invite only private beta.</li>
    <li>The obvious story is "these models are hard to get." The non obvious one is that access itself is bifurcating into a <strong>public tier</strong> anyone can buy and a <strong>sovereign tier</strong> that governments and a handful of insiders control.</li>
    <li>Which tier a model lives in now shapes who can build on it, what it's allowed to do, and how fast it reaches teh rest of us.</li>
    <li>If your roadmap assumes frontier capability keeps flowing freely to whoever pays, its worth stress testing that assumption right now.</li>
  </ul>
</div>

<h2>Three launches, three velvet ropes</h2>
<p>Line the three up next to each other and the pattern jumps out. Reporting from TechCrunch and Forbes puts GPT-5.6 Sol in the hands of about 20 organizations, with access shaped by government involvement rather than a public waitlist. Fable 5, as we covered separately, spent 19 days offline under what looks like a government influenced safety hold before returning in July. Grok 4.5 isn't publicly available at all, it's a private beta you get pulled into, not one you sign up for.</p>
<p>Each rope looks different up close. Step back and they are the same rope. In all three cases the question of who gets the model is being answered by someone other than the open market. That is new, and it's a bigger deal than any single benchmark score.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1280&q=80" alt="Abstract glowing blue AI visualization" loading="lazy" /><figcaption>Three of the most capable models in the world launched inside the same few weeks. None of them shipped as "sign up and start building."</figcaption></figure>

<h2>The public tier you already live in</h2>
<p>Most of us operate entirely in the public tier and never think about it. You want a strong model, you open a billing page, you get an API key, you ship. That tier is real and it's excellent. Sonnet class models, open weights you can self host, the workhorse APIs that power most production AI today. The floor of the public tier keeps rising, and for the vast majority of products it's more than enough.</p>
<p>The public tier has a defining trait: nobody vets you. Your use case is your business. You are trusted to not do anything catastrophic, and the guardrails live inside the model, not inside an approval committee. That openness is exactly what made the last few years of AI product building possible.</p>

<h2>The sovereign tier you'll never log into</h2>
<p>Above the public tier a different layer is forming, and it doesn't have a pricing page. Call it the sovereign tier. Access is granted, not purchased. The gatekeepers are governments, national security bodies, and the labs themselves acting on their guidance. GPT-5.6 Sol sitting with about 20 organizations is the clearest example. You can't buy your way onto that list. Someone decides you belong there, or you don't exist to it.</p>
<p>Fable 5 tells the other half of the story. A model can start in the public tier and get yanked toward the sovereign one when a government decides the risk profile calls for it. The 19 day blackout was, in effect, a public model spending three weeks under sovereign style control before being handed back. The line between the tiers isn't a wall, its a valve, and the valve isn't operated by customers.</p>
<blockquote><strong>Worth reframing:</strong> we used to ask "how good is the best model." The sharper question in 2026 is "wich tier is the best model in, and who holds the key." Capability and access have become separate axes.</blockquote>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80" alt="Rows of servers glowing in a data center" loading="lazy" /><figcaption>Same silicon, same training recipes, radically different rules about who is allowed to run a query. The split is about governance, not hardware.</figcaption></figure>

<h2>Why the split is happening now</h2>
<p>The bifurcation isn't a conspiracy, its a predictable response to capability crossing a line. When a model is genuinely useful for offensive cyber work, bio design, or large scale manipulation, "let anyone with a credit card use it" stops being a defensible default for the frontier edge. The Fable 5 jailbreak was a small preview of why. One clever prompt was enough to take two models offline worldwide.</p>
<p>Governments noticed. Labs noticed. The result is a two speed system. The bulk of capability keeps flowing to the public tier, a little slower and a little more filtered than before. The bleeding edge, the stuff that's powerful enough to be dangerous, gets routed into the sovereign tier where a small set of trusted orgs run it under supervision. Grok 4.5 staying in private beta fits the same logic, even when the driver is commercial caution rather than a formal mandate.</p>

<h2>What it means if you build on these models</h2>
<p>You probably build in the public tier, and that's fine. The thing to internalize is that the gap between what you can access and what the frontier can do is going to widen, not close, at the very top end. Plan for it.</p>

<div class="callout">
  <div class="callout-title">How to build when the frontier is gated</div>
  <strong>(1) Design for the public tier on purpose.</strong> Assume you'll never get the sovereign model. Build your product so a strong, buyable model is enough. <strong>(2) Track the valve, not the leaderboard.</strong> Watch which capabilities move from sovereign to public tier and when, because that timing is your real roadmap input. <strong>(3) Avoid single frontier dependence.</strong> If your differentiator needs one gated model, one policy change can end your product. Spread the bet. <strong>(4) Read access as signal.</strong> Who gets early access to a model tells you which markets the lab is prioritizing, same as it did with GPT-5.6 Sol.
</div>

<p>There is a real upside hiding in here too. The public tier is getting genuinely powerful, and most valuable products don't need frontier of frontier capability. They need reliable, affordable, good enough models wired into a great user experience. That has never been more available. The sovereign tier is where the scary demos live. The public tier is where the businesses get built.</p>

<h2>Bottom line</h2>
<p>GPT-5.6 Sol, Fable 5, and Grok 4.5 look like three separate stories about three hard to reach models. They are one story. Frontier AI is quietly splitting into a public tier you can buy and a sovereign tier you have to be granted, and the border between them is controlled by governments and labs, not customers. Knowing which tier a capability lives in, and which way the valve is turning, is becoming as important as knowing how the model scores. Build for the tier you can actually reach, and watch the valve like it's your roadmap, because increasingly it's.</p>
    `
  },
  {
    id: 'claude-sonnet-5-default-free-users-what-changed',
    bannerImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80',
    title: 'Claude Sonnet 5 Is Now the Default for Free Users: Here Is What Changed',
    subtitle: 'Anthropic quietly made Sonnet 5 the default on Free and Pro plans at $2 per million input tokens, introductory through August 31, and it posts 63.2% on agentic coding benchmarks against Sonnet 4.6 at 58.1%. Most people got upgraded and never noticed. Here is what it actually means for coding, writing, and agent workflows.',
    category: 'AI Models',
    icon: '⭐',
    bgGradient: 'linear-gradient(135deg, #0a1f1a 0%, #0f766e 55%, #2dd4bf 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-03',
    readTime: 7,
    tags: ['Claude Sonnet 5', 'Anthropic', 'AI coding', 'agentic AI', 'LLM pricing', 'Sonnet 4.6'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Anthropic quietly made <strong>Sonnet 5</strong> teh default model on <strong>Free and Pro</strong> plans. Most users were upgraded without any announcement in their face, and never noticed the swap.</li>
    <li>Pricing sits at <strong>$2 per million input tokens</strong> as an introductory rate through <strong>August 31</strong>, per the trackers at pricepertoken.com and llm-stats.com.</li>
    <li>On agentic coding benchmarks Sonnet 5 lands at <strong>63.2%</strong> versus Sonnet 4.6 at <strong>58.1%</strong>. That five point jump is small on paper and pretty noticeable in practice.</li>
    <li>The practical win isn't the score. Its that the default model behind everyday coding, writing, and agent tasks quietly got better for the same or lower cost.</li>
  </ul>
</div>

<h2>You got upgraded and nobody told you</h2>
<p>Model upgrades used to come with a keynote. This one arrived like a silent app update. If you use Claude on a Free or Pro plan, there's a good chance your default model is now Sonnet 5, and there was no banner, no popup, no "you have been upgraded" moment. The write ups on felloai.com and the numbers on llm-stats.com are how a lot of people are finding out after the fact.</p>
<p>That silence is kind of the point. When an upgrade is good enough to just leave on by default, you don't need to sell it. The model got better, the price did not go up, and the rollout was designed to be invisible. Nice problem to have, if you are the one shipping it.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80" alt="Source code on a dark terminal screen" loading="lazy" /><figcaption>No changelog popup, no migration step. The default model behind millions of everyday chats and code sessions just got swapped underneath everyone.</figcaption></figure>

<h2>What the numbers actually say</h2>
<p>Benchmarks get overhyped, so let me be careful here. The headline is 63.2% for Sonnet 5 against 58.1% for Sonnet 4.6 on agentic coding. Agentic coding means the model isn't just completing a snippet, it's driving a multi step task: read the repo, plan a change, edit files, run something, react to the result. That is the workload that actually matters for the way people use these models now.</p>
<p>Five points doesn't sound like much. In agentic work it compounds. A task that touches ten steps fails if any single step goes wrong, so a few points of per step reliability turns into a meaningfully higher chance the whole task finishes without you stepping in. The difference you feel is fewer "ugh, it went off the rails at step six" moments, and those moments are exactly what makes agent workflows frustrating.</p>
<blockquote><strong>Worth reframing:</strong> for agentic tasks, benchmark points aren't about raw smarts, they are about how often the model gets all the way to done without a human rescuing it. That is the number that changes your day.</blockquote>

<h2>What changes for everyday coding</h2>
<p>This is where the upgrade earns its keep. If you lean on Claude for coding, the improvements show up in the boring, high value places. Multi file refactors hold together more often. The model follows a longer chain of instructions before loosing the thread. It is better at reading an existing codebase and matching its style instead of inventing its own. You will still review everything, you should, but the ratio of "usable on the first pass" to "start over" tips in your favor.</p>
<p>The cost side matters just as much. At $2 per million input tokens through August 31, running longer contexts and more iterations is cheaper than it was, so the natural move is to stop rationing tokens and let the model see more of your actual project. More context plus a stronger model is where the real quality lives.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1280&q=80" alt="A developer working across multiple monitors of code" loading="lazy" /><figcaption>The gains land in the unglamorous places: refactors that stay coherent, longer instruction chains, better repo awareness. Exactly where agent coding usually breaks.</figcaption></figure>

<h2>What changes for writing and everyday chat</h2>
<p>Coding gets the headline but the writing side moved too. Sonnet 5 holds a voice more consistently across a long piece, keeps track of constraints you set early in a conversation, and is less likely to drift into generic filler when a draft gets long. For anyone using it as a daily writing or thinking partner, the difference is subtle per message and obvious over a full session.</p>
<p>If you have a system prompt or a set of style rules you reuse, this is a good week to run it again. Prompts that were tuned against 4.6 will still work, but a stronger default sometimes needs less hand holding, and you might be able to trim instructions you no longer need.</p>

<h2>The pricing detail worth circling</h2>
<p>One thing to not sleep on: the $2 per million input rate is introductory, and the trackers flag it as running through August 31. Introductory pricing is a lever, and levers move. If you are budgeting a product or a heavy personal workflow around this cost, build in the assumption that the number could change after that date and check it before you scale spend. Great deal today, worth a calendar reminder for later.</p>

<div class="callout">
  <div class="callout-title">Three things to do this week</div>
  <strong>(1) Confirm your default.</strong> Check that you are actually on Sonnet 5, then rerun a task that used to disappoint you and see if it lands now. <strong>(2) Feed it more context.</strong> With cheaper input tokens, stop trimming so aggressively and let the model see the real problem. <strong>(3) Note the date.</strong> Mark August 31 so the introductory price doesn't surprise your budget.
</div>

<h2>Bottom line</h2>
<p>Sonnet 5 becoming the quiet default on Free and Pro is a small headline with a real payoff. A five point bump on agentic coding, 63.2% against 58.1%, plus a $2 introductory input price, adds up to a better daily model that most people are already using and did not know it. Do not treat it as a press release. Go rerun the tasks that used to frustrate you, give the model more room to work, and keep an eye on that August 31 date. The upgrade already happened. The only thing left is to actually use it.</p>
    `
  },
  {
    id: 'openai-gpt-56-sol-cerebras-750-tokens-second',
    bannerImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1600&q=80',
    title: "OpenAI's 750 Tokens/Second Bet: What GPT-5.6 Sol on Cerebras Actually Unlocks",
    subtitle: 'GPT-5.6 Sol is being previewed on Cerebras hardware at up to 750 tokens a second, roughly 10 to 15 times typical API speed. This is not a demo stunt. It is a direct move on the verticals where latency beats raw intelligence.',
    category: 'AI Infrastructure',
    icon: '⚡',
    bgGradient: 'linear-gradient(135deg, #0a0f2e 0%, #0e7490 55%, #22d3ee 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-02',
    readTime: 9,
    tags: ['GPT-5.6 Sol', 'Cerebras', 'inference speed', 'latency', 'real-time AI', 'OpenAI'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>OpenAI is previewing <strong>GPT-5.6 Sol</strong> on Cerebras wafer-scale hardware at up to <strong>750 tokens/second</strong>, about 10 to 15 times teh speed most of us see from a normal API call.</li>
    <li>Speed at this level isn't a nice-to-have, it changes wich products are even possible. Below a certain latency, an AI stops feeling like a form you submit and starts feeling like a conversation.</li>
    <li>The early access list is tiny, around 20 organizations, and who is on it tells you exactly which markets OpenAI is chasing first: live support, real-time copilots, and financial decisioning.</li>
    <li>If your product lives or dies on response time, now is the moment to figure out what you would build if the model answered instantly.</li>
  </ul>
</div>

<h2>The number that made me sit up</h2>
<p>Every few months there's a benchmark that everyone screenshots, and most of them are about how <em>smart</em> a model is. This one is different. GPT-5.6 Sol running on Cerebras is being clocked at up to 750 tokens per second in the preview, and the reporting from VentureBeat and the walkthroughs on ExplainX line up on that figure. For context, a lot of production API traffic today sits somewhere in the 30 to 80 tokens/second range depending on load. So we aren't talking about a small bump. We are talking about an order of magnitude, and then some.</p>
<p>My first reaction was honestly a shrug, because faster tokens sound like an engineering footnote. But the more I sat with it, the more I realized speed at this scale isn't a footnote at all. It quietly moves the line between "AI you wait for" and "AI you talk to." And that line is where alot of product categories are hiding.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80" alt="Close-up of a large processor and circuitry on a server board" loading="lazy" /><figcaption>Cerebras runs the whole model on a single wafer-scale chip, which is a big part of why the tokens come out so fast. Different silicon, different rules.</figcaption></figure>

<h2>Why speed is a different axis than intelligence</h2>
<p>We have spent two years arguing about capability. Can it reason, can it code, can it pass the bar exam. Those are real questions and they matter. But capability and latency are two separate dials, and for a surprising number of real products the latency dial is the one that decides whether anyone actually uses the thing.</p>
<p>Think about a live phone support agent. A model that's 3% smarter but answers in four seconds loses to a model that's slightly dumber but answers in 400 milliseconds, because the human on the other end of the line won't sit in silence. The same is true for a coding copilot that's supposed to keep up with your typing, or a trading desk tool that has to surface a read before the window closes. In these worlds, speed <em>is</em> the capability.</p>
<blockquote><strong>Worth reframing:</strong> for latency-sensitive products, a fast good-enough model beats a slow brilliant one. GPT-5.6 Sol on Cerebras is OpenAI planting a flag on the fast side of that trade.</blockquote>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80" alt="Rows of servers glowing in a data center" loading="lazy" /><figcaption>The verticals OpenAI seems to be courting first all share one trait: the user is waiting in real time, and every extra second costs them something.</figcaption></figure>

<h2>Who actually gets to touch it, and what that tells us</h2>
<p>Here is the part I find most interesting. Access to the Sol preview isn't open. By the current reporting only around 20 organizations have it, which is a deliberately small circle. When a company hands a scarce, latency-crushing model to a hand-picked group, the composition of that group is basically a roadmap.</p>
<p>You don't give ultra-low-latency inference to a team writing marketing copy, because they genuinely don't care if the paragraph shows up in two seconds or six. You give it to the people for whom milliseconds convert directly into money or trust. Read the tea leaves and its pretty clearly three buckets:</p>
<ul>
  <li><strong>Live customer support.</strong> Voice and chat agents where a pause reads as the bot being broken. Sub-second responses are the whole game, and slow models simply can't play it.</li>
  <li><strong>Real-time copilots.</strong> Coding, writing, and design assistants that need to feel like they are thinking <em>with</em> you, not catching up to you a sentence later.</li>
  <li><strong>Financial decisioning.</strong> Fraud checks, pricing, and trading support where the answer is worthless if it arrives after the moment its meant to inform.</li>
</ul>
<p>Notice what is missing from that list: batch summarization, offline analysis, long-form generation. Those are exactly the workloads where nobody cares about 750 tokens/second. The absence is as telling as the presence.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1280&q=80" alt="A developer working across multiple screens of code" loading="lazy" /><figcaption>A copilot that answers before you finish the thought is a different product than one you wait on. Same model, completely different feel.</figcaption></figure>

<h2>What this means for the rest of us</h2>
<p>Most teams reading this won't be in the 20-org preview, and that's fine. The signal still matters. OpenAI is telling the market that inference speed is about to become a competitive axis of its own, separate from the usual capability leaderboard. When this capability generalizes, and it will, the products that already know what they would do with instant responses are going to move first.</p>
<p>So the useful exercise right now is a thought experiment. Assume the model answers effectively instantly. What changes about your product? For a support tool, maybe you stop showing a typing indicator and just stream a real conversation. For a copilot, maybe you move from "suggest on pause" to "suggest continuously." Teams that have done this thinking will ship faster the day the latency shows up in their tier. Teams that haven't will spend a quarter figuring out that their whole UX assumed a two second wait.</p>

<div class="callout">
  <div class="callout-title">Three moves while you wait for access</div>
  <strong>(1)</strong> Audit where latency, not intelligence, is your real bottleneck. Be honest, it's more places than you think. <strong>(2)</strong> Prototype the "instant response" version of your core flow even on today's slower models, so the UX is ready. <strong>(3)</strong> Watch the Cerebras and OpenAI announcements for when Sol-class speed moves from preview to general availability, because that's your starting gun.
</div>

<h2>Bottom line</h2>
<p>GPT-5.6 Sol at 750 tokens/second is easy to file under "cool benchmark" and scroll past. I think that undersells it. This is OpenAI making a bet that the next wave of valuable AI products aren't the smartest ones, their the fastest ones, in the narrow set of verticals where a human is waiting in real time. The tiny preview list is a map of where they think that value lives. Whether or not you are on it, the smart move is to start designing for a world where the model answers before you finish asking.</p>
    `
  },
  {
    id: 'gpt-56-coding-leap-telemetry-problem',
    bannerImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80',
    title: 'The GPT-5.6 Coding Leap Is a Telemetry Problem Waiting to Happen',
    subtitle: 'Agentic coding models are shipping more autonomous code than ever. The observability gap nobody is talking about is simple: when an AI-written change breaks production, can you even prove it was the AI?',
    category: 'AI Observability',
    icon: '🤖',
    bgGradient: 'linear-gradient(135deg, #0a0a2e 0%, #3730a3 60%, #818cf8 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-01',
    readTime: 8,
    tags: ['GPT-5.6', 'agentic coding', 'AI observability', 'change attribution', 'Terminal-Bench'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>GPT-5.6 and the incoming Gemini 3.5 Pro are pushing agentic coding from "autocomplete" into "writes and ships the whole change" - and most teams have no way to tag which commits came from a model.</li>
    <li>The real gap isn't code quality, it's <strong>attribution</strong>: when an incident hits, you need to know in seconds whether an AI-generated change was involved.</li>
    <li>Instrument the <em>provenance</em> of a change (author, model, prompt id) the same way you already instrument latency and errors.</li>
    <li>Do this now, while AI commits are still a minority. Retrofitting attribution after they are the majority is a nightmare nobody wants.</li>
  </ul>
</div>

<h2>The benchmark everyone quoted, and the part they skipped</h2>
<p>When GPT-5.6 posted its Terminal-Bench numbers, my feed did the usual thing - screenshots of the score, alot of "AGI is here" takes, the whole circus. And look, the jump is real. Terminal-Bench measures whether a model can actually operate a shell and finish a multi-step engineering task, not just autocomplete a function, and the deep dives on BenchLM show 5.6 cloosing tasks that 5.5 straight up gave up on.</p>
<p>But here is the thing nobody put in there screenshot: a model that can finish a whole task end-to-end is a model that ships code you did not write and did not read line by line. That is a fantastic productivity story. It is also, quietly, an observability story - and the observability side is running about a year behind.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80" alt="Lines of source code on a dark terminal screen" loading="lazy" /><figcaption>Agentic models don't suggest a line anymore - they open the PR, write the tests, and merge. Great, until something breaks at 2am.</figcaption></figure>

<h2>The question you can't answer today</h2>
<p>Picture the incident. Checkout error rate doubles at 11:40pm. You get paged, you pull up the deploy timeline, and you see fourteen commits went out in the last hour. Standard stuff so far. Now answer me this: how many of those fourteen were written by a human, and how many were generated by an agent running semi-autonomously?</p>
<p>For almost every team I talk to, the honest answer is "no idea." The git author is a service account, or worse, it's a real engineer's name because the agent committed under their credentials. The telemetry that matters - <em>this change came from a model, here's the prompt, here's the confidence</em> - simply isn't captured anywhere. Its not in the trace, not in the deploy metadata, not in the log line. You're flying blind on the exact axis that's about to matter most.</p>
<blockquote><strong>The uncomfortable framing:</strong> we spent ten years learning to attribute incidents to deploys. Agentic coding just added a new dimension - <em>who or what authored the change</em> - and almost nobody is instrumenting it.</blockquote>

<h2>What "instrument the AI" actually means</h2>
<p>This isn't about distrusting the models. Some of the AI-generated changes I've reviewed lately are cleaner than what a tired human ships on a Friday. It's about being able to <em>reason</em> about your system. When 40% of your merged changes have a non-human author, provenance becomes a first-class signal, and you want it flowing through the same pipeline as everything else.</p>
<ul>
  <li><strong>Tag the commit at the source.</strong> When an agent opens a PR, stamp it - a trailer like <code>Change-Author: gpt-5.6-agent</code> plus a prompt/run id. Cheap to add, priceless during an incident.</li>
  <li><strong>Carry provenance into deploy metadata.</strong> Your deploy markers already show up in the observability tool. Add a field for "share of this deploy that was AI-authored." Now your incident timeline can literally overlay it.</li>
  <li><strong>Make it a queryable dimension.</strong> The goal is to filter error rate or latency by change-author and see, in one chart, whether AI-authored changes regress more, less, or the same. Right now most teams can't even ask the question.</li>
</ul>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80" alt="A dashboard breaking down metrics by category" loading="lazy" /><figcaption>The chart you want but probably can't build yet: error rate split by human-authored vs model-authored change.</figcaption></figure>

<h2>Why the window is closing</h2>
<p>Here's the part that makes this urgent instead of interesting. Retrofitting attribution is painful in direct proportion to how much unattributed history you've already got. Right now, at most shops, AI-authored changes are still a minority - maybe 15 to 30%. Adding a provenance trailer today means your data gets clean from this point forward, and the messy past is small.</p>
<p>Wait eighteen months, until Gemini 3.5 Pro and whatever OpenAI ships next have pushed that number past half your commits, and you're trying to bolt attribution onto a codebase where the majority of recent changes are already anonymous. Alot of teams are going to learn this the hard way. The cheapest moment to start tagging is always the moment before you desperately need the tags.</p>

<div class="callout">
  <div class="callout-title">Three things to ship this sprint</div>
  <strong>(1)</strong> Add a <code>Change-Author</code> commit trailer to every agent in your pipeline - coding assistants, CI bots, the lot. <strong>(2)</strong> Pipe that field into your deploy markers so it lands in your APM tool. <strong>(3)</strong> Build one dashboard: error rate and p99 latency, split by human vs model author. If AI changes ever start regressing, you'll see it the same day instead of arguing about it for a week.
</div>

<h2>Bottom line</h2>
<p>The coding leap is genuinely exciting and I'm not here to rain on it. But every leap in what the models can <em>do</em> is a leap in what your telemetry needs to <em>explain</em>. GPT-5.6 didn't just get better at writing code - it made "which changes came from a model" a question your on-call engineer will be asking at 2am, very soon. Give them a way to answer it before the pager goes off.</p>
    `
  },
  {
    id: 'four-percent-operationalized-aiops-adoption-gap',
    bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    title: "Only 4% Have Operationalized AIOps  -  Here's the Adoption Gap Nobody Names",
    subtitle: 'Fresh survey data says just 4% of organizations have AIOps running in production, while 49% are still piloting. That gap between the demo and the deploy has a name, and a fix.',
    category: 'AIOps',
    icon: '📊',
    bgGradient: 'linear-gradient(135deg, #1a1005 0%, #b45309 60%, #fbbf24 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-01',
    readTime: 8,
    tags: ['AIOps', 'adoption', 'production readiness', 'pilot to production', 'operations'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>New survey data lands hard: only <strong>4%</strong> of organizations have actually operationalized AIOps, versus <strong>49%</strong> stuck in pilots. The "self-healing" marketing is running way ahead of reality.</li>
    <li>The gap isn't a technology problem, its a <em>trust-and-workflow</em> problem - pilots die when nobody redesigns the on-call process around the AI.</li>
    <li>The four things that separate the 4% from the 49%: clean data, a narrow first use case, human-in-the-loop by default, and an owner who isn't doing this as a side quest.</li>
    <li>Use the readiness checklist below before you buy anything else.</li>
  </ul>
</div>

<h2>The number that should stop you scrolling</h2>
<p>Every vendor deck this year opens the same way: autonomous operations, self-healing infrastructure, the machine fixes it before you wake up. Then you read the actual field data - the OpsPilot AIOps 2026 survey, the LogicMonitor trends report, Dynatrace's predictions - and the picture is a lot more humble. Roughly 4% of orgs say AIOps is genuinely operationalized. Around half are still piloting. The rest haven't seriously started.</p>
<p>I don't think the 4% number is embarrassing. I think it's honest, and honestly it's about what you'd expect for a category this young. But it does mean that if you're stuck in a pilot that never seems to graduate, you aren't behind - you are completely normal. The interesting question is what the 4% did that the 49% didn't.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80" alt="An operations dashboard with charts and status indicators" loading="lazy" /><figcaption>Half the market is piloting AIOps. Almost none of them have moved it into the real on-call rotation. That gap is the whole story.</figcaption></figure>

<h2>Why pilots stall (it's rarely the model)</h2>
<p>Here's the pattern I've watched play out again and again. A team runs a proof of concept. The AIOps tool ingests six weeks of alerts and does something genuinely impressive - collapses a noisy storm of 4,000 alerts into 30 real incidents. Everyone's happy. Screenshots get shared. And then... it just sits there. Six months later it's still "in evaluation."</p>
<p>The tool worked. What didn't happen was the boring, unglamorous work around it. Nobody rewired the on-call process so the AI's correlation actually reaches the responder. Nobody decided who owns a bad recommendation. The data feeding it was messy - half the alerts had no service tag - so trust never built. Pilots don't fail because the ML is weak, they fail because the <em>organization</em> around the ML never changed. That's the gap nobody names in the webinars.</p>
<blockquote><strong>The one-liner:</strong> AIOps is 20% a modeling problem and 80% an operations-redesign problem. Guess wich 80% the demo skips.</blockquote>

<h2>What the 4% did differently</h2>
<p>Across the teams I've seen actually cross the line into production, the same four moves show up. None of them are about buying a smarter model.</p>
<ul>
  <li><strong>They fixed the data first.</strong> Consistent service tags, a real ownership map, alerts that carry context. Feed a correlation engine garbage and it produces confident garbage, and there trust never recovers.</li>
  <li><strong>They picked one narrow use case.</strong> Not "automate operations." Something like "cut alert noise for the payments service." A win you can measure in a month beats a platform vision that measures in quarters.</li>
  <li><strong>They kept a human in the loop on purpose.</strong> The AI recommends, a person confirms - for months. Autonomy was earned tier by tier, not switched on because the sales engineer said it was safe.</li>
  <li><strong>They gave it a real owner.</strong> Someone whose actual job was making this work, not an SRE squeezing it between two other on-call rotations. Side-quest projects produce less results and die quietly.</li>
</ul>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80" alt="Abstract circuit and network representing automated systems" loading="lazy" /><figcaption>The 4% treated AIOps as an operations change with a tool attached - not a tool that would change operations by itself.</figcaption></figure>

<h2>The readiness checklist (steal this)</h2>
<p>Before you sign another renewal or start another pilot, run through these. If you can't check most of them, the problem isn't the vendor you picked - it's that the ground isn't ready.</p>
<ul>
  <li><strong>Data:</strong> Do 90%+ of your alerts carry a service tag and an owner? If not, fix this before anything else.</li>
  <li><strong>Scope:</strong> Can you name the <em>one</em> service or workflow where a win would be obvious and measurable in 30 days?</li>
  <li><strong>Process:</strong> Have you decided exactly where the AI's output enters the on-call flow, and who acts on it?</li>
  <li><strong>Trust ladder:</strong> Do you have explicit tiers - suggest, suggest-with-one-click, auto-with-rollback - and rules for promoting between them?</li>
  <li><strong>Ownership:</strong> Is there a named person accountable for this graduating from pilot to production?</li>
</ul>

<div class="callout">
  <div class="callout-title">The honest self-assessment</div>
  If you checked all five, you're ready to push a pilot toward production - and you're already ahead of the 49%. If you checked two or fewer, buying a better tool won't help; the missing pieces are process and data, not algorithms. Spend the next month on the boring stuff. It's the actual moat between the demo and the deploy.
</div>

<h2>Bottom line</h2>
<p>4% operationalized isn't a failure of the technology, it's a snapshot of a market that's still learning the difference between a great demo and a changed workflow. The teams that cross over aren't the ones with the fanciest model - their the ones that did the unglamorous groundwork first. If your pilot is stuck, don't go shopping. Go fix your data, narrow your scope, and give the thing a real owner. That's the whole gap, and it's more closeable than the 4% makes it sound.</p>
    `
  },
  {
    id: 'aws-devops-agent-vs-azure-sre-agent-remediation-faceoff',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    title: 'AWS DevOps Agent vs Azure SRE Agent: The First Real Autonomous-Remediation Face-Off',
    subtitle: 'Both hit general availability in March 2026, and Google just added Managed Agents to the Gemini API. Here is a hands-on look at what each one actually touches  -  and how far you should let it.',
    category: 'AIOps',
    icon: '⚔️',
    bgGradient: 'linear-gradient(135deg, #0a1e33 0%, #0369a1 60%, #38bdf8 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-01',
    readTime: 9,
    tags: ['AWS', 'Azure', 'SRE agent', 'autonomous remediation', 'cloud AIOps'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>AWS DevOps Agent and Azure SRE Agent both went GA in March 2026 - teh first cloud-native remediation agents you can actually turn on in production.</li>
    <li>They touch <em>different surfaces</em>: AWS leans into deploy + code context, Azure leans into telemetry + infra state. That difference decides wich fits your team.</li>
    <li>Guardrails are where the real comparison lives - approval gates, blast-radius limits, and rollback aren't optional, and the two vendors model them differently.</li>
    <li>Google's Managed Agents in the Gemini API are the wildcard: not a hosted SRE yet, but a build-your-own kit that changes the math for multi-cloud shops.</li>
  </ul>
</div>

<h2>Why this face-off matters now</h2>
<p>For years "autonomous remediation" was a slide, not a product. You could buy tools that <em>suggested</em> a fix, but the big clouds hadn't shipped anything that would actually touch production on its own. That changed in March 2026, when AWS and Azure both pushed their remediation agents to general availability within about two weeks of each other. InfoQ's writeup framed it as a race, and it kind of is.</p>
<p>I've spent the last few weeks poking at both in non-critical environments. This isn't a benchmark - it's a "what does each one actually do, and where would I trust it" comparison, in the same spirit as our other APM face-offs. Let's get into it.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&q=80" alt="A glowing network of connections representing cloud infrastructure" loading="lazy" /><figcaption>Two hyperscalers shipped autonomous remediation within two weeks of each other. The interesting differences are in what they're allowed to touch.</figcaption></figure>

<h2>What each agent actually touches</h2>
<p>This is the distinction that gets lost in the marketing, and it's the one that actually decides which tool fits you. The two agents have different centers of gravity.</p>
<ul>
  <li><strong>AWS DevOps Agent - deploy and code first.</strong> Its strongest when the incident traces back to a change. It reads your CodePipeline/CodeDeploy history, correlates the incident with a recent rollout, and its go-to move is a targeted rollback or a config revert. If your outages are mostly "we shipped something bad," this is the one that speaks your language.</li>
  <li><strong>Azure SRE Agent - telemetry and infra state first.</strong> It lives closer to the monitoring layer. It reasons over Azure Monitor signals and resource state, and its instincts run toward scaling, failover, and restarting unhealthy resources. If your incidents are more "something drifted or fell over" than "a bad deploy," Azure's framing fits better.</li>
</ul>
<p>Neither is strictly better. They're optimized for different failure modes, and honestly each one have blind spots exactly where the other is strong. A deploy-caused outage is Azure's weak spot; a slow resource-exhaustion problem is where AWS's deploy-centric view has less to say.</p>
<blockquote><strong>The mental model:</strong> AWS asks "what changed?" first. Azure asks "what's unhealthy?" first. Your incident history tells you which question you need answered more often.</blockquote>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80" alt="Terminal output and logs from an automated system" loading="lazy" /><figcaption>AWS reaches for a rollback; Azure reaches for a failover or scale action. Same goal, very different first instinct.</figcaption></figure>

<h2>Guardrails: the part that actually decides trust</h2>
<p>Any agent can take an action. The question that keeps you employed is what stops it from taking the <em>wrong</em> one at scale. Both vendors thought about this, but they express it differently, and the difference will effect how comfortable your team feels.</p>
<ul>
  <li><strong>Approval gates.</strong> Both let you require human sign-off per action class. AWS ties approvals to change types (rollback vs config edit); Azure ties them to resource scopes and action severity. If you already think in terms of "which deploys need review," AWS will feel natural.</li>
  <li><strong>Blast radius.</strong> Azure's model is more granular here - you can cap how many resources a single automated action may touch, which is reassuring when one bad decision could cascade. AWS leans more on the reversibility of the action itself.</li>
  <li><strong>Rollback and verification.</strong> This is table stakes and both do it, but watch the verification step closely. After acting, does it re-check the original failing signal, or just declare victory? In my testing AWS was slightly more explicit about confirming recovery against the triggering alarm.</li>
</ul>

<h2>The Google wildcard</h2>
<p>Then there's Google, who didn't ship a hosted SRE agent at all - they shipped Managed Agents in the Gemini API, announced around I/O 2026. That's a different bet. Instead of "here's our opinionated remediation robot," it's "here's the runtime, build the remediation logic you want." For a single-cloud shop that's more work than value. But for a multi-cloud team that refuses to run two different vendor agents with two different guardrail models, a build-your-own layer that sits above both clouds suddenly looks pretty attractive. Augment Code and a few others are already exploring exactly this pattern.</p>

<div class="callout">
  <div class="callout-title">How to choose</div>
  <strong>Mostly on AWS, outages usually trace to deploys?</strong> AWS DevOps Agent, guardrails set to rollback-only auto-execute at first. <strong>Mostly on Azure, incidents are infra/health drift?</strong> Azure SRE Agent, with tight blast-radius caps. <strong>Multi-cloud and opinionated about consistency?</strong> Look hard at Google's Managed Agents as the layer that unifies both. And whichever you pick - start in suggest-only mode. Earn the autonomy.
</div>

<h2>Bottom line</h2>
<p>This is the first time the "autonomous remediation" pitch has a real, generally-available product behind it from the big clouds, and that's a genuine milestone. But the two agents aren't interchangeable - they're shaped by whether your pain is bad deploys or unhealthy infrastructure. Pick the one whose first question matches your most common 2am question, wire the guardrails tight, and let it earn every tier of autonomy the slow way. The demo is finally real. That just means the guardrail conversation is real too.</p>
    `
  },
  {
    id: 'gemini-35-flash-speed-real-time-ai-observability',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80',
    title: "What Gemini 3.5 Flash's Speed Jump Means for Real-Time AI Observability",
    subtitle: "Google's new default model is roughly 4x faster than 3.1 Pro. That's great  -  right up until you realise the slow part of your stack is no longer the model.",
    category: 'AI Observability',
    icon: '⚡',
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1e3a8a 60%, #38bdf8 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-30',
    readTime: 8,
    tags: ['Gemini 3.5 Flash', 'AI observability', 'inference latency', 'trace sampling', 'token cost'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Gemini 3.5 Flash - now Google's default - clocks in around <strong>4x faster</strong> than 3.1 Pro at a fraction of the per-token cost.</li>
    <li>When the model stops being the slow part, your telemetry pipeline quietly becomes the new bottleneck.</li>
    <li>Cheaper, faster tokens mean <em>more</em> calls and far more spans - the sampling rules you set last year are now wrong.</li>
    <li>Token cost has graduated from a finance spreadsheet line into a real-time observability signal.</li>
  </ul>
</div>

<h2>The speed jump nobody fully priced in</h2>
<p>I'll admit it: when Google announced at I/O that 3.5 Flash would become the default model, my first reaction was "nice, cheaper bills." It took a couple of days of actually wiring it into a live pipeline before the more interesting consequence sank in.</p>
<p>The headline number - roughly four times faster than 3.1 Pro - isn't the story on its own. Plenty of models get faster every cycle. The story is what that speed does to everything <em>around</em> the model. WaveSpeed's launch-day latency map put first-token times for Flash in the low hundreds of milliseconds for typical prompts. When a model responds that quickly, the human staring at the screen is no longer waiting on the LLM. They're waiting on your network hop, your auth check, your retrieval step, and - this is the uncomfortable one - your observability layer.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80" alt="A monitoring dashboard showing live latency and throughput metrics" loading="lazy" /><figcaption>Once inference drops below ~300ms, the slowest thing on the trace is often the telemetry you bolted on to watch it.</figcaption></figure>

<h2>Where the bottleneck actually moved</h2>
<p>Here's the mental model that helped me. A year ago, a typical RAG request looked something like: 80ms of retrieval, 60ms of glue code, and then 1,400ms sitting on the model. The model dominated. You could instrument the daylights out of everything else and nobody would notice the overhead, because it was rounding error next to that 1,400ms.</p>
<p>Flip to Flash. That same request might spend 80ms on retrieval, 60ms on glue, and 350ms on the model. Suddenly your "rounding error" - the synchronous span export, the verbose structured log you write on every call, the trace context you serialise and ship - is a measurable slice of the user's wait. The APM Digest 2026 predictions called this out months ago and I shrugged at the time. They were right. Faster inference doesn't remove latency from the system; it relocates it to whichever component you were least careful about.</p>
<blockquote><strong>The shift in one line:</strong> we spent a decade optimising around slow models. The models stopped being slow, and alot of our pipelines were never built for that.</blockquote>

<h2>Your sampling strategy was built for a slower world</h2>
<p>This is the part that actually costs money if you ignore it. When each model call was expensive and slow, you naturally made fewer of them. Teams batched, cached aggressively, and a single user action might trigger one or two LLM calls. Tracing all of it was fine.</p>
<p>Cheap, fast tokens change the economics of <em>calling the model at all</em>. Agentic loops that would have been absurd at Pro prices - "let the model re-plan after every tool call" - become totally reasonable at Flash prices. So one user action now fans out into ten, twenty, fifty model calls. If your tracing is still set to "capture everything," your observability bill grows in lockstep with a usage pattern that just got an order of magnitude noisier.</p>
<ul>
  <li><strong>Move to tail-based sampling if you haven't.</strong> Head-based sampling decides before the request runs, wich means you keep a random 1% - including 1% of the boring successes and only 1% of the rare failures. Tail-based lets you keep every error and every slow trace while dropping the thousands of identical happy paths.</li>
  <li><strong>Sample by decision, not by call.</strong> In an agent loop, the interesting unit isn't a single model call - it's the whole reasoning chain. Keep traces that changed plan, retried, or hit a tool error; thin out the ones that went straight through.</li>
  <li><strong>Re-check your retention.</strong> Ten times the spans at the same 30-day retention is ten times the storage. Most teams find 7 days hot + cheap cold archive is plenty.</li>
</ul>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1280&q=80" alt="Charts and trend lines representing telemetry sampled over time" loading="lazy" /><figcaption>At Flash prices, agent loops fan one user action into dozens of calls. Sample the reasoning chain, not the individual call.</figcaption></figure>

<h2>Token cost is now a latency-adjacent metric</h2>
<p>For years, token spend lived in a monthly export that someone in finance squinted at. That's no longer good enough. When usage can spike 10x because a single buggy agent got stuck in a planning loop, you need cost on the same dashboard as latency and error rate - updating in something close to real time.</p>
<p>Treat tokens-per-request the way you treat p99 latency: a first-class signal with an alert attached. A sudden jump in average tokens per session is frequently the earliest sign that an agent is misbehaving, long before it shows up as a user complaint. I've now seen "tokens per request" catch a runaway loop a full fifteen minutes before the error rate budged.</p>

<div class="callout">
  <div class="callout-title">What to instrument this quarter</div>
  Add three things if you don't have them: (1) <strong>per-request token counts</strong> as a metric, not just a log field, so you can alert on them; (2) <strong>tail-based sampling</strong> keyed on errors, latency, and "the agent changed its plan"; and (3) a <strong>latency budget</strong> for your own observability overhead - if exporting a span costs 40ms on a 350ms request, that's worth fixing.
</div>

<h2>Bottom line</h2>
<p>Faster models are an unambiguous win. But "the model got 4x faster" is really an instruction to go look at everything you'd quietly decided didn't matter because the model was slow. Your sampling rules, your synchronous exporters, your token accounting - all of it was tuned for a world that just disappeared. The teams that treat Flash as a prompt to re-tune their telemetry pipeline will feel snappy and spend less. The ones that don't will wonder why their "4x faster model" only made the product feel a little quicker.</p>
    `
  },
  {
    id: 'aiops-autonomous-remediation-self-healing-2026',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    title: 'From Noise Reduction to Self-Healing: AIOps Crosses Into Autonomous Remediation in 2026',
    subtitle: 'Vendors now promise the full incident lifecycle  -  detect, act, verify  -  with no human in the loop. Here is a skeptic\'s checklist for telling real autonomy from a confident demo.',
    category: 'AIOps',
    icon: '🩹',
    bgGradient: 'linear-gradient(135deg, #052e16 0%, #166534 60%, #22c55e 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-28',
    readTime: 9,
    tags: ['AIOps', 'autonomous remediation', 'self-healing', 'incident response', 'automation'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>The 2026 pitch has shifted from "we cut your alert noise" to "we close teh incident for you" - detect, act, and verify, autonomously.</li>
    <li>Real autonomy needs a <strong>causal model</strong> of your system, not just correlation. Acting on correlation is how you make outages worse.</li>
    <li><strong>Rollback safety</strong> is the line between self-healing and self-harming. If the system can't cleanly undo its own action, it isn't ready to take it.</li>
    <li>Most "autonomous" products in the wild are really fast suggestion engines with a human still pressing the button. That's fine - just know wich one you bought.</li>
  </ul>
</div>

<h2>What changed in the pitch</h2>
<p>If you sat through vendor briefings this year - I sat through too many - you noticed the language move. Two years ago AIOps sold noise reduction: take 10,000 alerts, hand you back the 12 that matter. Genuinely useful, genuinely measurable. This year the decks all say some version of "full incident-lifecycle automation." LogicMonitor's trends report, Dynatrace's 2026 predictions, IBM's observability outlook - they all lean on the same arc: <em>detect → act → verify</em>, with the human moved from operator to spectator.</p>
<p>I want this to be real. I also spent enough years on call to be deeply suspicious of any system that promises to change production while I'm asleep. So instead of arguing about whether "autonomous" is marketing, here's the checklist I actually use when a vendor claims it.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80" alt="An operations dashboard tracking incidents and remediation status" loading="lazy" /><figcaption>"Detect → act → verify" is an easy slide to draw. The middle step is where the careers are made or lost.</figcaption></figure>

<h2>Test 1: Does it understand cause, or just correlation?</h2>
<p>This is the one that separates the serious products from the demos. Correlation says "the database CPU spiked and checkout errors spiked at the same time." Causation says "checkout errors spiked <em>because</em> a slow query saturated the connection pool, and the database CPU is a symptom of the same root cause, not the cause itself."</p>
<p>The difference isn't academic. An autonomous system acting on correlation might "fix" the database CPU by scaling it up - burning money and time - while the actual problem (a missing index shipped in the last deploy) sails on untouched. Worse, it might restart the database, drop the in-flight connections, and turn a degraded checkout into a fully broken one.</p>
<blockquote><strong>The question to ask the vendor:</strong> "Show me where your system encodes service dependencies and causal direction." If the answer is hand-wavy about machine learning, the system is pattern-matching, not reasoning. Pattern-matching is great for detection. It's dangerous for action.</blockquote>

<h2>Test 2: Can it undo what it just did?</h2>
<p>Self-healing only deserves the name if the heal is reversible. Every autonomous action falls into one of three buckets, and you should know which is which before you switch anything on:</p>
<ul>
  <li><strong>Trivially reversible</strong> - scale a stateless service up, then back down; drain a node; clear a cache. Low blast radius. Let the robot have these.</li>
  <li><strong>Reversible with care</strong> - roll back a deploy, fail over to a replica, restart a pod. Usually fine, but state and traffic shifting can bite. Automate with guardrails and a verification step.</li>
  <li><strong>Effectively irreversible</strong> - run a schema migration, delete data, modify a security policy, touch anything with a customer-facing side effect. The robot suggests; a human decides. Full stop.</li>
</ul>
<p>A mature platform lets you assign actions to these tiers explicitly and refuses to auto-execute anything you haven't blessed. If a product treats "restart the database" and "scale the web tier" as the same kind of action, that's a red flag waving at you.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80" alt="Code and logs representing an automated rollback in progress" loading="lazy" /><figcaption>The honest test of self-healing isn't whether it can act - it's whether it can cleanly take the action back.</figcaption></figure>

<h2>Test 3: How does it verify the fix worked?</h2>
<p>"Verify" is the step that quietly gets skipped in the demos, and it's the one that matters most. After the system acts, how does it know it helped? A real verification loop re-checks the original failing signal - the SLO that was burning, the golden signal that tripped - and confirms it actually recovered, not that some adjacent metric looks calmer.</p>
<p>And crucially: what happens when the fix <em>doesn't</em> work? The grown-up answer is "it reverts the action, escalates to a human, and stops trying." The scary answer is "it tries the next remediation in its playbook," because now you've got an automated system improvising on production during an active incident. Ask exactly how many automated attempts it will make before it gives up and pages someone. If there's no hard limit, walk away.</p>

<h2>So where does that leave us in 2026?</h2>
<p>Honestly, in a good place - as long as you read the label. The detection and correlation layers are genuinely excellent now; the noise reduction wave delivered. Autonomous <em>action</em> is real for the trivially-reversible tier and getting trustworthy for the careful-reversible tier. The "human entirely out of the loop for anything important" version is still mostly a slide.</p>
<p>That's not a criticism. A system that auto-heals the safe 70% of incidents and hands you a clean, root-caused, one-click suggestion for the scary 30% is a fantastic outcome. The mistake is buying the slide and discovering the limits during your first 3 a.m. page.</p>

<div class="callout">
  <div class="callout-title">The five-minute vendor screen</div>
  Before you believe "autonomous," get straight answers to five things: <strong>(1)</strong> Where is the causal/dependency model? <strong>(2)</strong> Which action tiers will it auto-execute? <strong>(3)</strong> Can every auto-action roll back cleanly? <strong>(4)</strong> How does it verify recovery against the original signal? <strong>(5)</strong> How many tries before it escalates to a human? Vague answers to any of these mean you're buying a suggestion engine - which is fine, if that's what you wanted.
</div>
    `
  },
  {
    id: 'ai-agents-observability-blind-spot',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    title: 'Why Every New AI Agent Is an Observability Blind Spot',
    subtitle: 'Each agent you ship adds a chunk of independent, non-deterministic behaviour to your system. Here is a practical way to instrument the decisions  -  not just the API calls.',
    category: 'AI Observability',
    icon: '🕵️',
    bgGradient: 'linear-gradient(135deg, #2d0a2e 0%, #831843 60%, #ec4899 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-26',
    readTime: 9,
    tags: ['AI agents', 'observability', 'OpenTelemetry', 'tracing', 'agentic AI'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Every agent you add is a little non-deterministic black box - same input, different path, and your existing monitoring can't see why.</li>
    <li>Traditional instrumentation captures teh <em>API call</em>. With agents you also have to capture the <em>decision</em>: what it chose, why, and what it considered.</li>
    <li>OpenTelemetry is quietly becoming the default data layer for this - GenAI semantic conventions give you a standard place to put agent telemetry.</li>
    <li>The unit of debugging shifts from "the failing request" to "the reasoning trace." Instrument accordingly or you'll be reading tea leaves.</li>
  </ul>
</div>

<h2>The blind spot, stated plainly</h2>
<p>A normal microservice is boring in the best way. Same input, same output, every time. When it breaks, you read the logs, find the bad branch, fix it. Predictable systems are observable systems.</p>
<p>An agent breaks that contract on purpose. Give it the same request twice and it might take two completely different routes - call a different tool, re-plan after a bad result, decide it has enough information and stop early. That non-determinism is the whole point; it's also exactly what your monitoring was never designed for. DataBahn's state-of-observability report this year had a line that stuck with me: most teams adopting agents are flying with instrumentation built for software that doesn't make choices. The surge in agentic AI is, quietly, a surge in un-observed decision-making running in production.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1280&q=80" alt="Abstract neural-network visual representing an AI agent's decision space" loading="lazy" /><figcaption>An agent is a service that makes choices. If your telemetry only records the calls, you've recorded the symptoms and missed the cause.</figcaption></figure>

<h2>Why "trace the API calls" isn't enough</h2>
<p>Here's a concrete failure I watched happen. A support agent kept giving users slightly wrong refund amounts. The API traces were spotless - every call returned 200, latency was fine, no errors anywhere. By the old playbook, the system was healthy. The bug was in the agent's <em>reasoning</em>: it was pulling the order total instead of the refundable subtotal, then confidently calling a perfectly functional API with the wrong number.</p>
<p>No amount of API-level observability would have caught that, because nothing failed at the API level. The decision failed. If you only instrument the calls, you can see <em>what</em> the agent did but never <em>why</em> it thought that was the right thing to do - and "why" is the entire debugging surface for an agent.</p>
<blockquote><strong>Worth reframing:</strong> for a deterministic service, the request is the thing you debug. For an agent, the reasoning chain is the thing you debug. Instrument the chain.</blockquote>

<h2>A practical framework for instrumenting decisions</h2>
<p>You don't need a PhD or a fancy platform to start. You need to capture, on every agent run, four things beyond the usual spans:</p>
<ul>
  <li><strong>The plan.</strong> What did the agent decide to do, and in what order? If it re-planned mid-run, capture the before and after. This is your single most valuable signal.</li>
  <li><strong>The inputs to each choice.</strong> What context, retrieved documents, and prior tool outputs were in front of the model when it made each decision? Most bad decisions are actually bad inputs wearing a disguise.</li>
  <li><strong>The tool selection rationale.</strong> Not just "called search_orders" but the alternatives it had and (where the model exposes it) why it picked that one. Wrong-tool-selection is one of the most common agent failure modes.</li>
  <li><strong>Confidence and stop conditions.</strong> Why did it decide it was done? An agent that stops too early and an agent that loops forever are the same bug from opposite ends - a broken stop condition.</li>
</ul>
<p>Capture those and your debugging session changes character entirely. Instead of "the output was wrong, let me guess," you get "on step three it retrieved the wrong document, wich made step four's reasoning correct given bad inputs." That's a fix you can actually ship.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1280&q=80" alt="Layered trace and span data visualised as a timeline" loading="lazy" /><figcaption>A reasoning trace: plan, inputs, tool choices, and stop conditions - laid out so a wrong answer has a visible cause.</figcaption></figure>

<h2>OpenTelemetry is becoming the default data layer</h2>
<p>The good news is you don't have to invent a format. OpenTelemetry's GenAI semantic conventions have matured to the point where there's now a standard, vendor-neutral place to record model calls, token usage, tool invocations, and agent spans. Monte Carlo's roundup of AI observability tools and the latest APM Digest agent coverage both point the same direction: the winners are building <em>on</em> OTel rather than around it.</p>
<p>Why that matters practically: if you instrument your agents with OTel GenAI conventions, you stay portable. You can send the same telemetry to whichever backend you like, switch vendors without re-instrumenting, and benefit from a shared vocabulary as the ecosystem standardises. Rolling your own agent telemetry format in 2026 is choosing to maintain a dialect nobody else speaks.</p>

<div class="callout">
  <div class="callout-title">Where to start this week</div>
  Pick your highest-traffic agent. Add OTel GenAI spans around (1) each model call with token counts, (2) each tool invocation, and (3) the planning step - log the plan as a span attribute. Then deliberately break it in staging: feed it an input you know is ambiguous and confirm you can reconstruct, from telemetry alone, exactly why it chose what it chose. If you can't, you've found your blind spot before production did.
</div>

<h2>The bottom line</h2>
<p>Agents aren't just another service to add to the dashboard. They're a different <em>kind</em> of thing - non-deterministic, decision-making, and opaque by default. Every one you deploy without decision-level instrumentation is a blind spot you're choosing to live with. The teams pulling ahead aren't the ones with the most agents; they're the ones who can answer "why did it do that?" in minutes instead of days. Build for the reasoning trace, lean on OpenTelemetry, and the blind spot turns back into a system you can actually run.</p>
    `
  },
  {
    id: 'observability-vs-monitoring',
    bannerImage: '/blog-banners/observability.jpg',
    title: 'Observability vs Monitoring: Why the Difference Actually Matters',
    subtitle: 'Monitoring tells you something is broken. Observability tells you why. Here\'s how to think about each  -  and why modern systems need both.',
    category: 'Observability',
    icon: '🔭',
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1e3a8a 60%, #2563eb 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-05-10',
    readTime: 8,
    tags: ['observability', 'monitoring', 'metrics', 'AIOps'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Monitoring detects known failures; observability helps you understand <em>unknown</em> ones.</li>
    <li>Observability rests on three telemetry pillars: metrics, logs, and distributed traces.</li>
    <li>High-cardinality data is teh cornerstone of a truly observable system.</li>
    <li>You can't predict every failure mode - observability lets you ask questions you didn't anticipate.</li>
  </ul>
</div>

<h2>What Is Monitoring?</h2>
<p>Monitoring is the practice of collecting and tracking predefined metrics to watch for known failure states. When CPU hits 90%, an alert fires. When the error rate spikes, a dashboard turns red. Monitoring answers the question: <strong>"Is this thing working?"</strong></p>
<p>The core assumption behind monitoring is that you already know what can go wrong. You define thresholds and rules ahead of time. This works well for simple, well-understood systems - but falls apart in distributed, cloud-native architectures where failure modes multiply unpredictably.</p>

<h2>What Is Observability?</h2>
<p>Observability is a property of a system - specifically, how well you can understand its internal state by examining its external outputs. A system is "observable" if you can answer any question about why it's behaving the way it does, <em>even questions you didn't think to ask when you built it</em>.</p>
<blockquote><strong>The key insight:</strong> With observability, you can ask questions you didn't know you'd need to ask. With monitoring alone, you can only confirm what you already suspected.</blockquote>
<p>The term comes from control theory, where a system is considered observable if its current state can be fully determined from a sequence of outputs and inputs. In software, those "outputs" are your telemetry data.</p>

<h2>The Three Pillars of Observability</h2>
<p>Observability is typically built on three types of telemetry:</p>
<ul>
  <li><strong>Metrics</strong> - Numeric measurements aggregated over time (CPU %, request count, latency percentiles). Efficient to store and query, ideal for alerting on trends and patterns you know to watch.</li>
  <li><strong>Logs</strong> - Timestamped records of discrete events. Rich in contextual detail but expensive to query at scale; structured logging (JSON) dramatically improves their utility.</li>
  <li><strong>Distributed Traces</strong> - End-to-end records of a request's journey through all services. Essential for pinpointing latency sources and error origins in microservice architectures.</li>
</ul>
<p>OpenTelemetry has emerged as the open-source standard for collecting and exporting all three. If you're starting fresh today, it's the right default choice.</p>

<h2>High Cardinality: The Real Differentiator</h2>
<p>Traditional monitoring tools struggle with high-cardinality data - metrics that have thousands or millions of unique label combinations (user IDs, request IDs, specific service instances, feature flag variants). Observability platforms are designed to handle this, letting you slice and dice data by any dimension to find the needle in the haystack.</p>
<p>Consider this query: <em>"Show me all requests that took over 2 seconds, from users in Germany, hitting the /checkout endpoint, during the deploy window between 14:02 and 14:18 UTC."</em> That requires high-cardinality support. A conventional metrics stack would either not store those dimensions at all, or cost a fortune to query them.</p>

<h2>When to Use Each</h2>
<p>The honest answer: you need both. Monitoring provides the initial signal - the page that wakes you at 2 a.m. Observability provides the investigative depth to understand root causes quickly. Think of monitoring as your smoke detector and observability as the fire investigation that follows.</p>

<div class="callout">
  <div class="callout-title">Practical Starting Point</div>
  Start with good metrics and alerting (monitoring). Add structured logging next. Implement distributed tracing as your system grows past three or four services. Don't try to boil the ocean - incremental observability still beats zero observability.
</div>

<h2>The Business Case</h2>
<p>Organizations with mature observability practices resolve incidents 2 - 5× faster than those relying solely on traditional monitoring. Mean Time to Resolution (MTTR) correlates directly with how quickly engineers can understand what went wrong and why. In cloud-native environments running dozens of services, that's the difference between a 5-minute fix and a 3-hour outage - and the reputational cost that follows.</p>
<p>Observability also shifts the team's posture from reactive firefighting to proactive reliability engineering. When your tooling can answer arbitrary questions about system behavior, engineers spend less time guessing and more time building.</p>
    `
  },
  {
    id: 'four-golden-signals',
    bannerImage: '/blog-banners/golden-signals.jpg',
    title: 'The Four Golden Signals: Google\'s Framework for SRE Monitoring',
    subtitle: 'Rate, errors, latency, and saturation. Four numbers that tell you almost everything you need to know about whether a service is healthy.',
    category: 'SRE',
    icon: '📊',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #7c3aed 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-05-24',
    readTime: 7,
    tags: ['SRE', 'golden signals', 'latency', 'monitoring', 'metrics'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Google's SRE book defines four signals that cover teh health of almost any service.</li>
    <li>Latency must be measured at percentiles (p50, p95, p99) - averages hide tail latency.</li>
    <li>Saturation is the hardest signal to measure, but the most important for predicting failures before they happen.</li>
    <li>Start alerting on symptoms (latency, error rate) before alerting on causes (CPU, memory).</li>
  </ul>
</div>

<h2>Where the Framework Comes From</h2>
<p>The Four Golden Signals come from Google's <em>Site Reliability Engineering</em> book, published in 2016. They were codified from years of experience monitoring some of the world's most complex distributed systems. The framework's genius is its simplicity: if you can only instrument four things about a user-facing service, these are the four.</p>

<h2>Signal 1 - Latency</h2>
<p>Latency is how long it takes to service a request. It sounds simple, but measuring it correctly is subtle. Two mistakes are common:</p>
<ul>
  <li><strong>Using averages:</strong> A service with p50 latency of 20ms might have p99 latency of 4 seconds. The average looks fine while 1 in 100 users has a terrible experience.</li>
  <li><strong>Not separating success from error latency:</strong> A fast error response (HTTP 500 in 2ms) shouldn't make your latency numbers look better. Measure them separately.</li>
</ul>
<p>Best practice: track p50 (median), p95, and p99 latency for every service. Alert on p99 to catch tail latency that affects a real percentage of users.</p>

<h2>Signal 2 - Traffic</h2>
<p>Traffic measures the demand placed on your service - requests per second for an HTTP service, messages per second for a queue, queries per second for a database. Traffic is your baseline: it tells you how busy the system is and helps contextualize every other signal.</p>
<p>A spike in error rate means something different if traffic doubled at the same time versus if traffic stayed flat. Traffic is also critical for capacity planning - knowing your peak load helps you right-size your infrastructure before saturation causes incidents.</p>

<h2>Signal 3 - Errors</h2>
<p>Errors are the rate of requests that fail, either explicitly (HTTP 5xx, exception thrown) or implicitly (HTTP 200 with a wrong content type, or a response that violates an SLO). The implicit errors are the dangerous ones - they slip past naive error rate monitoring.</p>
<p>Distinguish error types in your instrumentation:</p>
<ul>
  <li><strong>Client errors (4xx)</strong> - Usually not your problem. High 4xx rates can indicate API contract issues, but they don't mean your service is unhealthy.</li>
  <li><strong>Server errors (5xx)</strong> - Your problem. Alert aggressively on these.</li>
  <li><strong>Business logic errors</strong> - HTTP 200s that indicate a failed transaction. Require domain-specific instrumentation.</li>
</ul>

<h2>Signal 4 - Saturation</h2>
<p>Saturation describes how "full" a service is - what fraction of its capacity is being used. It's the most forward-looking of the four signals because it lets you predict failures before they happen. A service approaching 100% CPU saturation will degrade; you want to know at 70%, not 99%.</p>
<p>Every service has a different saturation bottleneck. For a CPU-bound service it's CPU utilization. For a database it might be connection pool usage or disk IOPS. For a queue consumer it's queue depth. Identifying your service's primary saturation dimension is a key architectural decision.</p>
<blockquote><strong>Google's advice:</strong> "If you can only measure four metrics, the four golden signals are likely your best choice." But they also note that saturation is the hardest to get right - spend time on it.</blockquote>

<h2>Putting Them Together</h2>
<p>The signals work best as a system. Here's a typical incident walkthrough:</p>
<ol>
  <li>Error rate alert fires (Signal 3). An SRE pages in.</li>
  <li>Latency check: p99 is also elevated (Signal 1). Something is slow <em>and</em> erroring.</li>
  <li>Traffic check: traffic is normal (Signal 2). Not a load spike - something changed in the service itself.</li>
  <li>Saturation check: database connection pool is at 98% (Signal 4). The root cause is identified.</li>
</ol>

<div class="callout">
  <div class="callout-title">Implementation Tip</div>
  Use the four golden signals as your SLI candidates. Pick latency and error rate thresholds that represent "good enough for users" as your SLOs. Traffic drives your capacity model. Saturation drives your scaling triggers.
</div>
    `
  },
  {
    id: 'distributed-tracing-explained',
    bannerImage: '/blog-banners/tracing.jpg',
    title: 'Distributed Tracing Explained: From First Principles',
    subtitle: 'When a request touches 12 microservices and fails, how do you know which one is responsible? Distributed tracing is the answer.',
    category: 'Observability',
    icon: '🕸️',
    bgGradient: 'linear-gradient(135deg, #042f2e 0%, #115e59 60%, #0d9488 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-05',
    readTime: 10,
    tags: ['tracing', 'spans', 'OpenTelemetry', 'microservices', 'distributed systems'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>A trace is a complete record of one request's journey across all services.</li>
    <li>Traces are built from spans - individual units of work with start time, duration, and attributes.</li>
    <li>Context propagation (trace IDs passed in HTTP headers) is what stitches spans into a single trace.</li>
    <li>OpenTelemetry is now teh industry standard for trace instrumentation - use it.</li>
  </ul>
</div>

<h2>The Problem Distributed Tracing Solves</h2>
<p>Imagine a user clicks "Buy Now." Under the hood, that click triggers your API gateway, wich calls an auth service, which calls a user service, which calls a cart service, which calls an inventory service, which calls a payment service. The request takes 4.2 seconds and the user gives up. Which service is responsible?</p>
<p>Logs can't answer this question without enormous effort - you'd have to correlate log entries across six services by timestamp, hoping nothing is out of sync. Metrics tell you aggregate latency per service, but not how they combine for this specific request. Distributed tracing was invented to solve exactly this problem.</p>

<h2>Traces and Spans</h2>
<p>Every trace starts with a root span - the first operation in the request flow, typically at your edge service or API gateway. Each subsequent service operation creates a child span that references the parent. The resulting structure is a tree (technically a directed acyclic graph) called a <strong>trace</strong>.</p>
<p>A span captures:</p>
<ul>
  <li>A unique span ID and the parent span ID</li>
  <li>The trace ID (shared by every span in the request)</li>
  <li>A name/operation (e.g., <code>POST /checkout</code>, <code>db.query</code>)</li>
  <li>Start timestamp and duration</li>
  <li>Attributes/tags - key-value pairs with context (user ID, database query, HTTP status)</li>
  <li>Events - timestamped log-like records within the span</li>
  <li>Status - OK, Error, or Unset</li>
</ul>

<h2>Context Propagation: The Glue</h2>
<p>For spans across services to know they're part of the same trace, trace context must be propagated. In HTTP systems, this typically happens via the <code>traceparent</code> header (W3C Trace Context standard) or proprietary headers like Datadog's <code>x-datadog-trace-id</code>.</p>
<p>When Service A calls Service B, it injects the current trace ID and span ID into the outgoing request headers. Service B extracts these headers, creates a child span referencing Service A's span, and propagates the same context forward.</p>
<blockquote><strong>Without context propagation, you have isolated spans, not a trace.</strong> This is the most common implementation mistake - teams instrument their services individually but forget to propagate context at service boundaries.</blockquote>

<h2>Sampling: The Practical Necessity</h2>
<p>In a high-traffic system, tracing every single request is prohibitively expensive. Sampling decides which requests to trace. Two main strategies:</p>
<ul>
  <li><strong>Head-based sampling</strong> - The decision is made at the root span before any downstream calls. Simple and low-overhead, but may miss important infrequent events like errors.</li>
  <li><strong>Tail-based sampling</strong> - The decision is made after the entire trace is complete, so you can always keep errors and slow traces. More complex and requires a trace aggregation buffer.</li>
</ul>
<p>A common approach: sample ~1% of traffic head-based, plus always sample errors and traces over a latency threshold.</p>

<h2>OpenTelemetry: The Standard</h2>
<p>OpenTelemetry (OTel) merges the former OpenCensus and OpenTracing projects into a single vendor-neutral instrumentation standard. It provides:</p>
<ul>
  <li>SDKs for 12+ languages (Go, Java, Python, Node.js, .NET, Ruby, PHP, and more)</li>
  <li>Auto-instrumentation for popular frameworks - Django, Spring, Express, gRPC, database drivers</li>
  <li>The OpenTelemetry Collector - a standalone agent/gateway for receiving, processing, and exporting telemetry</li>
  <li>OTLP (OpenTelemetry Protocol) - the wire format for sending data to backends</li>
</ul>

<div class="callout">
  <div class="callout-title">Getting Started</div>
  Start with auto-instrumentation for your HTTP and database layers. You'll immediately get traces without changing application code. Add manual spans for your critical business operations. Route everything through an OTel Collector so you can switch backends without re-instrumenting.
</div>

<h2>Reading a Waterfall Diagram</h2>
<p>Tracing UIs display traces as waterfall diagrams - horizontal bars showing each span's start time and duration, nested to show parent-child relationships. To diagnose a slow trace:</p>
<ol>
  <li>Find the longest bar - that's your bottleneck span.</li>
  <li>Look for gaps between parent and first child - time spent serializing, waiting for connections, or in middleware.</li>
  <li>Look for long sequential chains - operations that could potentially be parallelized.</li>
  <li>Check the error status on individual spans - not every error in a trace is the root cause.</li>
</ol>
    `
  },
  {
    id: 'aiops-machine-learning-it-operations',
    bannerImage: '/blog-banners/aiops.jpg',
    title: 'AIOps Explained: Where Machine Learning Meets IT Operations',
    subtitle: 'AIOps promises to tame the alert storm and find root causes automatically. Here\'s what it actually does  -  and what it doesn\'t.',
    category: 'AIOps',
    icon: '🤖',
    bgGradient: 'linear-gradient(135deg, #052e16 0%, #166534 60%, #16a34a 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-12',
    updatedAt: '2026-07-06',
    readTime: 11,
    tags: ['AIOps', 'machine learning', 'anomaly detection', 'alert fatigue', 'automation', 'autonomous remediation'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>AIOps applies ML/AI techniques to IT operations data to automate correlation, anomaly detection, and root cause analysis.</li>
    <li>Alert noise reduction is teh most immediate and measurable benefit - teams typically see 70 - 95% fewer actionable alerts.</li>
    <li>AIOps doesn't replace human judgment; it filters the signal so engineers focus on what matters.</li>
    <li>Data quality is the biggest predictor of AIOps success. Garbage in, garbage out.</li>
  </ul>
</div>

<h2>What AIOps Actually Means</h2>
<p>Gartner coined the term "AIOps" in 2017, defining it as platforms that combine big data and machine learning to enhance and partially automate IT operations functions including availability and performance monitoring, event correlation and analysis, and IT service management.</p>
<p>In practice, AIOps sits on top of your existing observability data - metrics, logs, events, traces - and applies machine learning to make sense of it at machine speed and scale. A modern infrastructure generates millions of events per day; no human team can read all of them. AIOps tools read them for you.</p>

<h2>The Core Capabilities</h2>

<h3>Anomaly Detection</h3>
<p>Instead of static thresholds ("alert if CPU &gt; 80%"), anomaly detection models learn the normal behavior of each metric and alert when observed values deviate significantly from the learned baseline. This means seasonal patterns (higher traffic on Mondays, lower at 3 a.m.) are accounted for automatically, reducing false positives that plague static thresholds.</p>

<h3>Alert Correlation and Noise Reduction</h3>
<p>When one infrastructure failure cascades through a system, it typically generates hundreds of alerts - one per affected metric, per affected service. AIOps engines correlate these into a single incident with a probable root cause and supporting evidence. Teams go from triaging 200 alerts to investigating one incident summary.</p>

<h3>Root Cause Analysis (RCA)</h3>
<p>By analyzing the topology of your infrastructure (wich services depend on which), the timing of events, and historical patterns of past incidents, AIOps platforms can propose probable root causes. The best systems surface a ranked list of hypotheses with confidence scores, not a single guess.</p>

<h3>Predictive Alerting</h3>
<p>Rather than alerting when something fails, predictive analytics can alert when the trend suggests failure is 30 minutes away. Disk-full predictions, connection pool exhaustion, and memory leak detection are mature use cases. You fix the problem before the user is impacted.</p>

<h2>What AIOps Doesn't Do</h2>
<p>The marketing around AIOps has historically oversold it. It's worth being clear about what it doesn't do:</p>
<ul>
  <li><strong>It doesn't eliminate engineers.</strong> It makes engineers more productive by reducing noise. Judgment, remediation, and architectural decisions remain human tasks.</li>
  <li><strong>It doesn't work on bad data.</strong> If your metrics are inconsistent, your logs are unstructured, or your service topology is undocumented, AIOps tools will produce confusing results.</li>
  <li><strong>It doesn't replace strong observability foundations.</strong> AIOps is most powerful when layered on top of good instrumentation - not as a substitute for it.</li>
</ul>

<blockquote><strong>A useful frame:</strong> AIOps is a force multiplier for your existing observability investment, not a shortcut around building good observability.</blockquote>

<h2>Alert Fatigue: The Problem AIOps Was Born to Solve</h2>
<p>Industry surveys consistently show that operations teams receive thousands of alerts per day, of which only 5 - 30% require human action. Engineers habituate to the noise and start ignoring alerts - including real ones. This is alert fatigue, and it's one of the leading causes of prolonged outages.</p>
<p>AIOps noise reduction typically achieves 70 - 95% reduction in actionable alert volume. The remaining alerts are higher quality and better contextualized, making on-call rotations more sustainable and mean time to resolution shorter.</p>

<h2>2026 Update: From ML-Assisted to Autonomous Remediation</h2>
<p>Everything above describes AIOps as it was mostly practiced through 2024 - 2025: machine learning <em>assists</em> a human. The model finds the anomaly, correlates the alerts, and proposes a root cause, but a person still decides what to do and executes the fix. In 2026 the frontier has moved. The combination of capable LLM-based agents and MCP-style tool access means AIOps platforms are starting to <strong>close the loop</strong> - not just diagnosing incidents but resolving a defined subset of them without a human in the critical path.</p>
<p>This is a genuine category shift, not a marketing rebrand. It's worth being precise about the difference:</p>
<ul>
  <li><strong>ML-assisted (the classic model above):</strong> detect → correlate → suggest. A human approves and acts. The AI's output is a recommendation.</li>
  <li><strong>Autonomous remediation (the 2026 model):</strong> detect → correlate → reason → <em>act</em> → verify. An agent selects a runbook or writes a fix, executes it against a guarded scope, checks whether the signal recovered, and rolls back if it didn't. The human reviews after the fact.</li>
</ul>
<p>What made this practical was less a leap in anomaly detection and more the arrival of agents that can reason over an incident and safely invoke tools. Cloud vendors now ship first-party remediation agents, and the interesting engineering questions have shifted from "can it find the problem?" to "how far do we let it act, and how do we observe the agent itself?" The honest answer for most teams in 2026 is <strong>bounded autonomy</strong>: let agents auto-remediate well-understood, low-blast-radius failures (restart a wedged pod, scale a saturated pool, roll back a bad deploy) while everything novel or high-impact still routes to a human.</p>
<p>If this is where your roadmap is heading, three of our newer pieces pick up exactly where this article ends:</p>
<ul>
  <li><a href="/blog/aiops-autonomous-remediation-self-healing-2026">From Noise Reduction to Self-Healing: AIOps Crosses Into Autonomous Remediation in 2026</a> - the deep dive on how the loop actually closes and where the guardrails go.</li>
  <li><a href="/blog/aws-devops-agent-vs-azure-sre-agent-remediation-faceoff">AWS DevOps Agent vs Azure SRE Agent</a> - a head-to-head of the first real autonomous-remediation agents from the major clouds.</li>
  <li><a href="/blog/ai-agents-observability-blind-spot">Why Every New AI Agent Is an Observability Blind Spot</a> - the flip side: the remediation agents themselves become systems you have to monitor.</li>
</ul>
<blockquote><strong>The through-line:</strong> autonomous remediation doesn't retire the fundamentals in this article - clean data, good instrumentation, and correlated signals are exactly what an agent needs to act safely. Weak observability made ML-assisted AIOps produce confusing suggestions; it makes autonomous AIOps produce confident <em>mistakes</em>. The bar on data quality goes up, not down.</blockquote>

<div class="callout">
  <div class="callout-title">Evaluating AIOps Tools</div>
  Ask vendors for their "noise reduction rate" on your actual data (not a demo environment). Request a proof-of-concept using 30 days of historical data. Measure precision (how often are the correlated incidents real?) and recall (how many real incidents are detected?) separately - a tool that never alerts has perfect recall but zero precision.
</div>
    `
  },
  {
    id: 'slo-sla-sli-practical-guide',
    bannerImage: '/blog-banners/slo.jpg',
    title: 'SLOs, SLAs, and SLIs: A Practical Guide for Engineers',
    subtitle: 'Error budgets, reliability targets, and the contracts that govern them. This is the vocabulary of modern SRE  -  demystified.',
    category: 'SRE',
    icon: '🎯',
    bgGradient: 'linear-gradient(135deg, #431407 0%, #9a3412 60%, #ea580c 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-19',
    readTime: 11,
    tags: ['SLO', 'SLA', 'SLI', 'error budget', 'SRE', 'reliability'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>SLI (what you measure) → SLO (what you target) → SLA (what you promise externally).</li>
    <li>Error budgets convert a reliability target into a budget for risk - enabling faster iteration when teh system is healthy.</li>
    <li>99.9% availability allows ~43 minutes of downtime per month. 99.99% allows ~4.3 minutes.</li>
    <li>The most common mistake: setting SLOs so tight that you're always burning error budget, wich kills your release velocity.</li>
  </ul>
</div>

<h2>The Hierarchy Explained</h2>
<p>The three terms are often confused because they're closely related. Here's the cleanest way to think about them:</p>

<table>
  <thead>
    <tr><th>Term</th><th>What it's</th><th>Who it's for</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>SLI</strong></td><td>A measured metric of service behavior</td><td>Engineers</td><td>Fraction of requests completed in &lt;200ms</td></tr>
    <tr><td><strong>SLO</strong></td><td>A target value or range for an SLI</td><td>Engineers + Product</td><td>95% of requests must complete in &lt;200ms</td></tr>
    <tr><td><strong>SLA</strong></td><td>A contractual commitment to customers</td><td>Customers + Legal</td><td>We guarantee 99.9% monthly uptime or issue credits</td></tr>
  </tbody>
</table>

<h2>Service Level Indicators (SLIs)</h2>
<p>An SLI is a carefully defined quantitative measure of some aspect of the level of service being provided. Good SLIs have three properties:</p>
<ul>
  <li><strong>Measurable.</strong> You can derive the number from your telemetry data right now.</li>
  <li><strong>Meaningful to users.</strong> It correlates with whether users are having a good experience.</li>
  <li><strong>Actionable.</strong> When it degrades, your team knows what to investigate.</li>
</ul>
<p>Common SLI types: availability (fraction of time the service is up), request success rate (fraction of requests returning non-5xx), latency (fraction of requests below a threshold), and freshness (how recently data was updated).</p>

<h2>Service Level Objectives (SLOs)</h2>
<p>An SLO is a target value for an SLI over a time window. The time window matters enormously:</p>
<ul>
  <li><strong>Rolling 28-day windows</strong> are popular because they smooth out weekly seasonality and give a consistent signal regardless of when in the calendar month you're looking.</li>
  <li><strong>Calendar-month windows</strong> align with business reporting but create a cliff effect - you might burn half your error budget in the last week of the month.</li>
</ul>
<p>Setting the right SLO target is more art than science. Start by measuring your current reliability baseline, then set a target slightly above it. The goal isn't to achieve 100% reliability - that's unachievable and trying to approach it costs exponentially more as you get closer.</p>

<h2>The Math of Uptime</h2>
<p>These numbers are worth memorizing:</p>
<table>
  <thead>
    <tr><th>SLO Target</th><th>Allowed downtime / month</th><th>Allowed downtime / year</th></tr>
  </thead>
  <tbody>
    <tr><td>99%</td><td>7.3 hours</td><td>3.65 days</td></tr>
    <tr><td>99.5%</td><td>3.6 hours</td><td>1.83 days</td></tr>
    <tr><td>99.9%</td><td>43.8 minutes</td><td>8.77 hours</td></tr>
    <tr><td>99.95%</td><td>21.9 minutes</td><td>4.38 hours</td></tr>
    <tr><td>99.99%</td><td>4.38 minutes</td><td>52.6 minutes</td></tr>
    <tr><td>99.999%</td><td>26.3 seconds</td><td>5.26 minutes</td></tr>
  </tbody>
</table>

<h2>Error Budgets: The Key Concept</h2>
<p>An error budget is the amount of unreliability you're allowed before you breach your SLO. If your SLO is 99.9% availability over 30 days, your error budget is 0.1% of the total request volume - roughly 43.8 minutes of complete downtime, or an equivalent combination of partial degradation.</p>
<p>Error budgets turn reliability into a resource that can be <em>spent</em>. Engineering teams can use error budget on risky deployments, infrastructure migrations, and experiments. When the budget is healthy, you move fast. When the budget is running low, you slow down, focus on reliability work, and potentially freeze non-critical releases.</p>
<blockquote><strong>The insight:</strong> An SLO without an error budget policy is just a number on a dashboard. The error budget policy is what changes engineering behavior.</blockquote>

<h2>Service Level Agreements (SLAs)</h2>
<p>An SLA is an explicit or implicit contract with users that typically includes consequences for failure - service credits, refunds, or contractual remedies. SLAs are typically set more conservatively than SLOs. If your internal SLO is 99.9%, you might offer an SLA of 99.5% - giving you a buffer to detect and remediate SLO breaches before they become SLA violations.</p>

<div class="callout">
  <div class="callout-title">Common Mistakes to Avoid</div>
  <strong>Too many SLOs:</strong> Pick 2 - 3 SLIs per service that best represent the user experience. More than five and they become noise. <br/><br/>
  <strong>SLO set at current reliability:</strong> If you're already hitting 99.99% by accident, setting the SLO there locks you in and kills your error budget permanently. Set aspirational but realistic targets. <br/><br/>
  <strong>No error budget policy:</strong> Document in advance what happens when the budget is 50%, 25%, and 0% burned. Otherwise every conversation about burning budget is a negotiation from scratch.
</div>
    `
  },

  /* ── APM Vendor Posts ── */
  {
    id: 'datadog-full-stack-observability-2026',
    bannerImage: '/blog-banners/datadog-full-stack-observability-2026.jpg',
    title: 'Datadog in 2026: A Full-Stack Observability Deep Dive',
    subtitle: 'Datadog started as a cloud metrics tool. Today it covers APM, logs, RUM, security, and cost management. Here\'s what that means for your platform team.',
    category: 'APM',
    icon: '🐶',
    logo: '/logos/datadog.svg',
    bgGradient: 'linear-gradient(135deg, #1a0533 0%, #6b21a8 60%, #a855f7 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-05-20',
    readTime: 10,
    tags: ['Datadog', 'APM', 'observability', 'Watchdog', 'cloud monitoring'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Datadog has expanded from metrics-only into a 20+ product platform covering teh full observability stack.</li>
    <li>Watchdog, Datadog's AI engine, automatically surfaces anomalies without manual threshold configuration.</li>
    <li>Universal Service Monitoring (USM) provides APM-level visibility with zero code instrumentation.</li>
    <li>Datadog's pricing model can surprise teams at scale - understanding it early prevents bill shock.</li>
  </ul>
</div>

<h2>From Monitoring Tool to Observability Platform</h2>
<p>Datadog was founded in 2010 with a simple premise: give DevOps teams a single place to monitor their cloud infrastructure. In 2016 it added APM. In 2017, log management. By 2026, Datadog is a sprawling platform of over 20 integrated products - Infrastructure, APM, Logs, RUM (Real User Monitoring), Synthetic Monitoring, Network Monitoring, Security, CI Visibility, Database Monitoring, Cloud Cost Management, and more.</p>
<p>This breadth is Datadog's biggest selling point and its most common criticism. Teams that buy into the platform get genuine out-of-the-box correlation between signals - a trace links directly to the host metrics and logs generated during that request. Teams that only need one capability often find the pricing disproportionate.</p>

<h2>APM: Distributed Tracing at Datadog's Core</h2>
<p>Datadog APM instruments your services automatically through its <strong>dd-trace</strong> agents, wich support Python, Java, Go, Node.js, Ruby, .NET, PHP and more. Traces appear in the Service Catalog - a real-time map of every instrumented service, its dependencies, error rates, and latency SLOs.</p>
<p>The <strong>Flame Graph</strong> view shows a waterfall of spans for any individual trace. Each span includes host metrics, logs, and profiling data from the same time window - no pivoting between tabs. This level of correlation is where Datadog genuinely differentiates from tools that manage these signals in silos.</p>

<h2>Watchdog: AI Anomaly Detection Built In</h2>
<p>Watchdog is Datadog's automated anomaly detection engine, running continuously across your metrics and traces without any configuration. It identifies:</p>
<ul>
  <li>Sudden changes in error rates, latency, or request volume</li>
  <li>Database query slowdowns correlating with upstream latency</li>
  <li>Infrastructure issues (disk pressure, CPU anomalies) surfacing in service health</li>
  <li>Log anomalies - unusual patterns in error log volume</li>
</ul>
<p>Watchdog surfaces these as "Watchdog Alerts" in the APM interface, ranked by estimated impact. In practice this dramatically reduces the time engineers spend writing and tuning manual alert conditions.</p>

<h2>Universal Service Monitoring: Zero-Code APM</h2>
<p>Universal Service Monitoring (USM) uses eBPF-based network traffic analysis to automatically discover services and measure their request rates, error rates, and latency - without any code instrumentation or agent injection. For teams inheriting legacy applications where adding a tracing agent is politically or technically difficult, USM provides a meaningful starting point.</p>
<blockquote><strong>The tradeoff:</strong> USM gives you the four golden signals per service, but no distributed traces - you can't follow a request across service boundaries. It's a bridge, not a replacement for full APM instrumentation.</blockquote>

<h2>Log Management: Pipelines, Archives, and Flex Logs</h2>
<p>Datadog Log Management ingests logs from any source, applies parsing pipelines (Grok patterns, remappers, processors), and indexes them for fast search. Key features to understand:</p>
<ul>
  <li><strong>Log Archives:</strong> Route logs to S3 or GCS after ingestion; rehydrate on demand for historical analysis. Essential for cost management - only index what you actively query.</li>
  <li><strong>Flex Logs:</strong> A tiered storage option between live indexed logs and archives, with lower cost and slightly higher query latency.</li>
  <li><strong>Log-to-Trace correlation:</strong> Inject trace IDs into your logs and Datadog automatically links them. Click on a log line and jump directly to the associated trace.</li>
</ul>

<h2>Pricing: The Part Nobody Talks About Enough</h2>
<p>Datadog charges per host per month for infrastructure monitoring, per GB for log ingestion (plus separately for indexing), per million indexed spans for APM, and per thousand test runs for Synthetics. Custom metrics carry an additional cost once you exceed the per-host allocation.</p>
<p>At small scale this is very manageable. At scale - hundreds of hosts, high-cardinality tracing, verbose logging - costs can escalate rapidly. The key levers are: Metrics Without Limits™ (store all, index only queried metrics), log archive + rehydration patterns, and APM span ingestion control via head-based sampling rules.</p>

<div class="callout">
  <div class="callout-title">Getting Started Recommendation</div>
  Start with Infrastructure + APM for your three most critical services. Get correlation working before expanding surface area. Enable Watchdog from day one - it's free overhead that immediately pays dividends during incidents.
</div>
    `
  },

  {
    id: 'new-relic-opentelemetry-first-strategy',
    bannerImage: '/blog-banners/new-relic-opentelemetry-first-strategy.jpg',
    title: 'New Relic Goes OpenTelemetry-First: What It Means for Your Stack',
    subtitle: 'New Relic bet its future on OpenTelemetry. If you\'re evaluating APM platforms today, this strategic shift changes almost everything about the implementation conversation.',
    category: 'APM',
    icon: '🌐',
    logo: '/logos/newrelic.svg',
    bgGradient: 'linear-gradient(135deg, #003d2b 0%, #007e58 60%, #00b386 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-05-28',
    readTime: 9,
    tags: ['New Relic', 'OpenTelemetry', 'NRDB', 'Pixie', 'APM'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>New Relic has publicly committed to OpenTelemetry as its primary instrumentation strategy - proprietary agents are still supported but OTel is teh recommended path.</li>
    <li>NRDB (New Relic Database) underpins everything - a petabyte-scale telemetry database built for high-cardinality queries.</li>
    <li>Pixie provides live Kubernetes debugging with no persistent storage and near-zero overhead using eBPF.</li>
    <li>The free tier (100 GB/month, one full-access user) makes New Relic genuinely accessible for small teams and evaluation.</li>
  </ul>
</div>

<h2>The OpenTelemetry Bet</h2>
<p>In 2023, New Relic made a strategic announcement: they were committing to OpenTelemetry as their primary instrumentation path. This meant investing engineering resources in OTel SDKs, contributing to upstream OTel projects, and orienting their documentation around OTel-first workflows.</p>
<p>The business logic is clear: proprietary instrumentation agents create vendor lock-in. As OpenTelemetry has become the industry standard - backed by Google, Microsoft, AWS, and dozens of observability vendors - the cost of maintaining competing proprietary agents became increasingly unjustifiable. By embracing OTel, New Relic commoditizes instrumentation and competes on the quality of its backend, query language, and UI.</p>
<blockquote><strong>For users, this is good news:</strong> OTel-instrumented services can switch backends by changing a single OTLP endpoint configuration. New Relic's value proposition shifts to "best place to send your OTel data" - not "most convenient to get locked into."</blockquote>

<h2>NRDB: The Telemetry Database Behind Everything</h2>
<p>New Relic Database (NRDB) is the time-series and event database that powers every New Relic query. It was purpose-built for high-cardinality, high-throughput telemetry - ingesting trillions of data points per day across New Relic's customer base. Key properties:</p>
<ul>
  <li>Schemaless ingestion - every attribute on every span, metric, log, or event is automatically indexed</li>
  <li>NRQL (New Relic Query Language) - a SQL-like query language optimized for telemetry analytics</li>
  <li>Sub-second query latency on billions of rows in most cases</li>
  <li>Unified data model - metrics, events, logs, and traces (MELT) are all first-class citizens</li>
</ul>
<p>The schemaless approach means you never have to define schemas upfront. Send a trace span with a custom attribute <code>checkout.cart_value</code> and immediately query <code>SELECT average(checkout.cart_value) FROM Span</code>. This is the practical benefit of NRDB over fixed-schema databases.</p>

<h2>Pixie: Live Kubernetes Debugging</h2>
<p>Pixie is an open-source Kubernetes observability tool acquired by New Relic in 2021. It uses eBPF kernel-level tracing to automatically capture request/response payloads, service maps, and performance metrics - without any code changes or sidecar injection.</p>
<p>What makes Pixie unusual: it keeps all data in-cluster by default. Query results are streamed to your terminal or the New Relic UI on demand but never persistently exported. This means zero storage cost for Pixie data, negligible overhead (typically &lt;2% CPU), and no privacy concerns about sending payloads off-cluster.</p>

<h2>New Relic Errors Inbox</h2>
<p>Errors Inbox aggregates errors from APM agents, Browser monitoring, and Mobile - grouping similar errors by fingerprint and showing:</p>
<ul>
  <li>Number of occurrences and affected users</li>
  <li>First seen / last seen timestamps</li>
  <li>Stack traces with source code context (via CodeStream integration)</li>
  <li>Assignment to team members with Slack and Jira notifications</li>
</ul>
<p>The CodeStream integration is genuinely valuable - it shows the git blame for the offending line, lets developers create a PR directly from the error, and closes the loop between incident detection and code fix without leaving the observability tool.</p>

<h2>Pricing: The 100 GB Free Tier</h2>
<p>New Relic's pricing model charges by data ingest (GB/month) rather than per host. The free tier includes 100 GB/month - enough to instrument a meaningful microservices environment - plus one full-access user and unlimited basic users.</p>

<table>
  <thead><tr><th>Tier</th><th>Data Ingest</th><th>Users</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Free</td><td>100 GB/month</td><td>1 full + unlimited basic</td><td>$0</td></tr>
    <tr><td>Standard</td><td>Pay per GB above 100</td><td>1 full + unlimited basic</td><td>~$0.35/GB</td></tr>
    <tr><td>Pro</td><td>Pay per GB</td><td>Pay per full user</td><td>~$0.35/GB + $99/user</td></tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">Migration Tip</div>
  If you're currently on a proprietary APM and evaluating New Relic, instrument one service with OTel and point it at both your current backend and New Relic's OTLP endpoint simultaneously. Run them in parallel for two weeks - zero migration risk, genuine data to compare.
</div>
    `
  },

  {
    id: 'appdynamics-business-iq-apm-revenue',
    bannerImage: '/blog-banners/appdynamics-business-iq-apm-revenue.jpg',
    title: 'AppDynamics Business iQ: When APM Meets Revenue Intelligence',
    subtitle: 'Most APM tools tell you a service is slow. AppDynamics Business iQ tells you which customers are affected, how much revenue is at risk, and which code path caused it.',
    category: 'APM',
    icon: '💼',
    logo: '/logos/appdynamics.svg',
    bgGradient: 'linear-gradient(135deg, #0c1a3a 0%, #1d4ed8 60%, #60a5fa 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-03',
    readTime: 9,
    tags: ['AppDynamics', 'Business iQ', 'APM', 'Cisco FSO', 'Business Transactions'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>AppDynamics models your application around Business Transactions - end-to-end flows mapped to real user actions, not just technical service calls.</li>
    <li>Business iQ (formerly Business Performance Monitoring) correlates application performance data with business KPIs like revenue, conversions, and customer satisfaction.</li>
    <li>Cisco's acquisition of AppDynamics in 2017 led to FSO (Full Stack Observability) - a broader platform integrating network, security, and cloud cost context.</li>
    <li>AppDynamics excels in large enterprises with complex Java/.NET applications; it's less common in greenfield cloud-native environments.</li>
  </ul>
</div>

<h2>What Makes AppDynamics Different: Business Transactions</h2>
<p>Most APM tools are service-centric - they show you teh health of <em>services</em>. AppDynamics is transaction-centric - it's built around <strong>Business Transactions (BTs)</strong>, which represent meaningful user-facing operations: "Place Order," "Login," "Search Product," "Process Payment."</p>
<p>AppDynamics agents automatically discover Business Transactions by inspecting entry points - servlet URLs, MQ message types, web service endpoints. Every metric (response time, error rate, throughput) is captured per Business Transaction. When "Place Order" degrades, you immediately see it as a Business Transaction slowdown - not buried in aggregate service metrics.</p>

<h2>Business iQ: The Revenue Layer</h2>
<p>Business iQ extends APM data into business analytics. You define business metrics (revenue per minute, successful checkouts, cart abandonment rate) and map them to the underlying Business Transactions. The result: a single dashboard showing both application performance and its business impact in real time.</p>
<p>During an incident, Business iQ answers the questions that matter to stakeholders:</p>
<ul>
  <li><em>"How much revenue are we loosing per minute this checkout service is slow?"</em></li>
  <li><em>"Which customer segments are most affected - enterprise accounts or SMB?"</em></li>
  <li><em>"Has the mobile experience degraded more than web?"</em></li>
  <li><em>"What's our conversion rate right now vs baseline?"</em></li>
</ul>
<p>This bridges the traditional gap between the NOC ("p99 latency is 4 seconds") and the business ("we're losing $12K per minute"). Executives and engineers are literally looking at the same data.</p>

<h2>Browser and Mobile RUM</h2>
<p>AppDynamics Browser Real User Monitoring (BRUM) instruments your frontend with a JavaScript beacon that captures page load times, JavaScript errors, AJAX call performance, and user session data. Mobile RUM does the same for iOS and Android apps. Both correlate with server-side APM traces - click a slow AJAX call in BRUM and drill directly into the server-side Business Transaction it triggered.</p>

<h2>The Cognition Engine: AI-Driven Root Cause Analysis</h2>
<p>AppDynamics' Cognition Engine applies machine learning to automatically:</p>
<ul>
  <li>Learn dynamic baselines for each Business Transaction (accounting for time-of-day and day-of-week patterns)</li>
  <li>Detect anomalies without manual threshold configuration</li>
  <li>Correlate anomalies across tiers - identify that a slow "Place Order" BT traces back to a specific database query on a specific node</li>
  <li>Generate root cause analysis narratives surfaced in the alert - not just "something is wrong" but "the checkout BT is slow because of increased database call time on db-node-03"</li>
</ul>

<h2>Cisco FSO: The Bigger Picture</h2>
<p>Since Cisco's 2017 acquisition, AppDynamics has become a pillar of Cisco's Full Stack Observability (FSO) platform, which integrates AppDynamics APM with:</p>
<ul>
  <li>ThousandEyes - network and internet intelligence</li>
  <li>Intersight - infrastructure and cloud cost visibility</li>
  <li>Cisco Secure - security telemetry</li>
</ul>
<p>For large enterprises already invested in Cisco's infrastructure, FSO offers a genuinely unified view from the network layer up through the application layer. For organizations without Cisco infrastructure, the APM product stands alone effectively.</p>

<div class="callout">
  <div class="callout-title">Best Fit Assessment</div>
  AppDynamics shines in enterprises with complex Java or .NET monoliths/SOA where Business Transaction modeling provides immediate clarity. If your architecture is primarily microservices on Kubernetes and your team is OTel-native, tools like Datadog or New Relic may offer a smoother path. The two aren't mutually exclusive - many enterprises run AppDynamics for legacy apps and a complementary tool for cloud-native services.
</div>
    `
  },

  {
    id: 'datadog-vs-newrelic-vs-splunk-2026',
    bannerImage: '/blog-banners/comparison.jpg',
    title: 'Datadog vs New Relic vs Splunk: Choosing Your APM Stack in 2026',
    subtitle: 'Three enterprise-grade platforms, three very different philosophies. This head-to-head breaks down what actually matters when your team has to pick one.',
    category: 'APM',
    icon: '⚖️',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #334155 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-10',
    updatedAt: '2026-07-06',
    readTime: 13,
    tags: ['Datadog', 'New Relic', 'Splunk', 'APM comparison', 'observability', 'MCP'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Datadog leads on breadth and UI polish - best for teams wanting a single pane of glass without integration work.</li>
    <li>New Relic leads on OTel-native workflows and pricing transparency - best for teams already investing in open standards.</li>
    <li>Splunk leads on log analytics depth and SIEM integration - best for security-observability convergence and large enterprises with compliance requirements.</li>
    <li>No single platform wins on every dimension - teh right choice depends on your primary pain point and existing stack.</li>
  </ul>
</div>

<h2>The Three Platforms at a Glance</h2>
<table>
  <thead><tr><th>Dimension</th><th>Datadog</th><th>New Relic</th><th>Splunk</th></tr></thead>
  <tbody>
    <tr><td><strong>Core strength</strong></td><td>Full-stack, unified UX</td><td>OTel-native, data model</td><td>Log analytics, SIEM</td></tr>
    <tr><td><strong>APM approach</strong></td><td>Proprietary + OTel</td><td>OTel-first</td><td>OTel + SignalFx agents</td></tr>
    <tr><td><strong>Free tier</strong></td><td>14-day trial only</td><td>100 GB/month forever</td><td>Trial only</td></tr>
    <tr><td><strong>Pricing model</strong></td><td>Per host + per GB + per span</td><td>Per GB ingest</td><td>Per GB ingest / per host</td></tr>
    <tr><td><strong>Kubernetes</strong></td><td>Excellent</td><td>Good (Pixie)</td><td>Good (k8s navigator)</td></tr>
    <tr><td><strong>Log management</strong></td><td>Excellent</td><td>Good</td><td>Best-in-class</td></tr>
    <tr><td><strong>Security (SIEM)</strong></td><td>Cloud SIEM (add-on)</td><td>Limited</td><td>Market-leading</td></tr>
    <tr><td><strong>Business metrics</strong></td><td>Good (dashboards)</td><td>Good (NRQL)</td><td>Good (SPL)</td></tr>
  </tbody>
</table>

<h2>APM Depth: Distributed Tracing</h2>
<p><strong>Datadog</strong> has the most polished distributed tracing UI - flame graphs, service maps, and correlated logs/metrics are tightly integrated. The Service Catalog auto-discovers dependencies and flags SLO health. For teams that want minimal friction and maximum out-of-the-box value, Datadog APM is hard to beat.</p>
<p><strong>New Relic</strong> offers excellent tracing via the OTel pipeline into NRDB. The query-driven approach (NRQL over spans) gives power users flexibility that fixed UI views don't. Distributed traces are interactive, and correlation to logs and metrics is solid - though marginally less integrated than Datadog's experience.</p>
<p><strong>Splunk Observability Cloud</strong> (formerly SignalFx) uses NoSample™ tracing - every trace is captured, not sampled. This is a genuine differentiator: you never miss a rare slow trace or one-in-a-thousand error. The tradeoff is storage cost at high traffic volumes. Splunk APM also provides Tag Spotlight - instant correlation between any span tag and performance metrics.</p>

<h2>Log Management: Splunk's Home Turf</h2>
<p>Log analytics is Splunk's original product and remains its strongest suit. SPL (Search Processing Language) is more powerful than Datadog's or New Relic's query languages for complex log transformations, statistical analysis, and building operational intelligence dashboards. Splunk Enterprise Security (ES) integrates log data with threat intelligence for a combined observability + SIEM workflow.</p>
<p>If your primary use case is log-heavy - compliance, security investigations, complex operational analytics - Splunk wins this dimension clearly. If logs are one of several signals, Datadog and New Relic are both capable enough.</p>

<h2>Pricing: The Real-World Comparison (Updated for 2026)</h2>
<p>Pricing varies enormously by usage pattern, so these are indicative rather than precise:</p>
<ul>
  <li><strong>100 hosts, 100 GB logs/month, light tracing:</strong> Datadog ≈ $3,000 - 5,000/month; New Relic ≈ $1,500 - 2,500/month; Splunk ≈ $2,500 - 4,000/month</li>
  <li><strong>Enterprise (500+ hosts, heavy tracing, SIEM):</strong> All three move to contract pricing with significant negotiation room.</li>
</ul>
<p>New Relic's per-GB model becomes most predictable at scale. Datadog's multi-dimensional pricing (hosts + GB + spans + custom metrics) requires careful management. Splunk's pricing is highly dependent on log compression ratios and whether you're on enterprise vs. cloud.</p>

<h3>What Changed in Datadog's 2026 Enterprise Tiers</h3>
<p>The biggest pricing shift this year came from Datadog, which restructured its enterprise packaging. The old approach - buy each product (Infrastructure, APM, Log Management, Cloud SIEM) as a separate per-unit line item - has been consolidated into committed-use <strong>platform bundles</strong> negotiated as an annual observability spend commitment rather than a stack of individual SKUs. Three things matter for buyers:</p>
<ul>
  <li><strong>Committed-use discounting is now the default.</strong> Large accounts negotiate a single annual commitment across products and draw down against it, replacing the old per-product on-demand rates. This rewards accurate forecasting and punishes lumpy usage - unused commitment doesn't roll over cleanly.</li>
  <li><strong>Flex Logs and ingestion/indexing split.</strong> Datadog now separates cheap high-volume ingest from the more expensive indexed/queryable tier, so enterprise log bills depend heavily on how much you actually index versus archive. Modeled correctly, this lowers cost; modeled lazily, it doesn't.</li>
  <li><strong>New usage dimensions carry their own pricing.</strong> AI/LLM Observability, per-agent monitoring, and the newer autonomous-remediation features are priced as their own dimensions on top of the platform bundle - budget for them explicitly rather than assuming they're included.</li>
</ul>
<p>The net effect: Datadog's headline per-host number is less meaningful in 2026 than the total committed spend and how disciplined your team is about which data gets indexed. For enterprise finalists, model your cost against the committed-use bundle at 2× your current data volume, not the on-demand list price - the gap between the two is where budget surprises live.</p>

<h2>MCP Support: Connecting Your Observability Data to AI Agents</h2>
<p>The most important capability that didn't exist when most APM comparisons were written is <strong>Model Context Protocol (MCP)</strong> support. MCP is the open standard - originally introduced by Anthropic and now broadly adopted - that lets AI assistants and agents query a tool's data and take actions through a well-defined server interface. In practice, an MCP server for your observability platform means an engineer (or an autonomous SRE agent) can ask "why is checkout latency up?" in natural language and have the agent pull the relevant traces, logs, and dashboards directly. In 2026 this has moved from novelty to a real selection criterion.</p>
<table>
  <thead><tr><th>Platform</th><th>MCP approach</th><th>What you can do today</th></tr></thead>
  <tbody>
    <tr><td><strong>Datadog</strong></td><td>Official Datadog MCP server</td><td>Query metrics, logs, traces, monitors, and incidents from an AI agent; pull Watchdog findings and dashboard context into a chat or triage workflow. Tightly aligned with its Bits AI assistant.</td></tr>
    <tr><td><strong>New Relic</strong></td><td>MCP server over NerdGraph/NRQL</td><td>Run NRQL from an agent, retrieve entities and alerts, and expose the full data model programmatically. The OTel-native, query-first design maps cleanly onto MCP's tool model.</td></tr>
    <tr><td><strong>Splunk</strong></td><td>MCP access to SPL and Observability Cloud</td><td>Drive SPL searches and pull APM/log results from an agent; Cisco-era investment has pushed AI-assistant and MCP integration across the Splunk and AppDynamics portfolio.</td></tr>
  </tbody>
</table>
<p>Two things to check before you weight this heavily. First, <strong>scope</strong>: some MCP servers are read-only (query and retrieve) while others also expose write actions (acknowledge an alert, silence a monitor, trigger a runbook) - read-only is safer to adopt first. Second, <strong>authentication and governance</strong>: an MCP server is a new access path into production telemetry, so confirm it respects your existing RBAC, scopes tokens per agent, and logs what the agent did. If your roadmap includes AI-assisted triage or <a href="/blog/aiops-autonomous-remediation-self-healing-2026">autonomous remediation</a>, first-class MCP support is quickly becoming as important as the quality of the dashboards themselves.</p>

<h2>Making the Decision</h2>
<p>Rather than picking the "best" platform, ask which pain you're solving first:</p>
<ul>
  <li><strong>Primary pain: slow incident triage across many services →</strong> Datadog's unified UX and Watchdog AI reduce MTTR fastest.</li>
  <li><strong>Primary pain: vendor lock-in and OTel standardization →</strong> New Relic's OTel-first strategy gives you the most portable foundation.</li>
  <li><strong>Primary pain: security + observability convergence, heavy log analytics →</strong> Splunk's SIEM + Observability Cloud combination is the most complete.</li>
</ul>

<div class="callout">
  <div class="callout-title">Proof-of-Concept Checklist</div>
  Before signing any contract: (1) instrument your three most critical services; (2) run a tabletop incident simulation using only the candidate tool; (3) test your most frequent ad-hoc query patterns; (4) calculate projected cost at 2× your current data volume. Do this with each finalist - the winner on paper often loses in practice.
</div>
    `
  },

  {
    id: 'broadcom-dx-apm-ca-apm-legacy-cloud',
    bannerImage: '/blog-banners/broadcom-dx-apm-ca-apm-legacy-cloud.jpg',
    title: 'Broadcom DX APM: The Enterprise Giant Navigating a Cloud-Native World',
    subtitle: 'Once known as CA APM, Broadcom\'s DX APM still runs in thousands of enterprises. Here\'s where it excels, where it struggles, and how to think about its future.',
    category: 'APM',
    icon: '🏛️',
    logo: '/logos/broadcom.svg',
    bgGradient: 'linear-gradient(135deg, #2d0a0a 0%, #991b1b 60%, #dc2626 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-17',
    readTime: 10,
    tags: ['Broadcom', 'CA APM', 'DX APM', 'enterprise APM', 'Introscope'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>CA APM, rebranded as Broadcom DX APM after teh 2018 acquisition, has a 25+ year history in enterprise Java and .NET monitoring.</li>
    <li>The Introscope agent remains one of the deepest bytecode instrumentation engines in the market - unmatched for complex JEE application profiling.</li>
    <li>DX APM is strongest in regulated, on-premises environments (banking, insurance, government) where cloud-native alternatives are constrained.</li>
    <li>Broadcom's reputation for post-acquisition support reduction is a real concern - plan your roadmap with eyes open.</li>
  </ul>
</div>

<h2>A Brief History: From Wily to CA to Broadcom</h2>
<p>DX APM's lineage begins with Wily Technology and its Introscope product, founded in 1998 specifically to address the performance complexity of enterprise Java application servers. CA Technologies (formerly Computer Associates) acquired Wily in 2004 for $375 million - a sign of how seriously the industry took Java application monitoring.</p>
<p>Under CA, Introscope became CA APM and was expanded to cover .NET, mainframes, and eventually cloud environments. In 2018, Broadcom acquired CA Technologies for $18.9 billion, and CA APM became part of Broadcom's "DX" (Digital Experience) portfolio - hence the rebrand to <strong>DX APM</strong>.</p>

<h2>What DX APM Does Well</h2>
<p>Despite its age relative to cloud-native competitors, DX APM retains genuine strengths:</p>

<h3>Deep JEE and .NET Instrumentation</h3>
<p>Introscope's bytecode instrumentation engine provides granular visibility into application server internals - EJB calls, connection pool states, garbage collection impact on request latency, thread pool exhaustion. For large Java EE applications running on WebSphere, WebLogic, or JBoss, this depth of insight remains difficult to match with newer tools that prioritize microservices over monoliths.</p>

<h3>On-Premises and Air-Gapped Deployments</h3>
<p>Many regulated industries - banking, insurance, government, defense - operate in environments where sending telemetry to a SaaS cloud is prohibited or requires extensive compliance review. DX APM runs entirely on-premises, often on the same infrastructure as the applications it monitors. For these environments, the choice of on-prem APM tools is narrow, and DX APM's 25-year track record counts for a great deal.</p>

<h3>SmartStor: Efficient Long-Term Metric Storage</h3>
<p>DX APM's SmartStor engine uses differential compression to store metric time series efficiently for months or years. Long-term trend analysis - "how has our order processing latency changed over the last 18 months?" - is built into the product rather than requiring a seperate data warehouse.</p>

<h2>Where DX APM Struggles</h2>
<p>The product's enterprise-era design shows in several areas:</p>
<ul>
  <li><strong>Kubernetes and containers:</strong> DX APM was architected for persistent servers, not ephemeral containers. Monitoring containerized workloads requires additional configuration and lacks the out-of-the-box pod/deployment topology views that Datadog or New Relic provide natively.</li>
  <li><strong>Distributed tracing:</strong> While DX APM offers transaction tracing, its model predates the OpenTracing/OpenTelemetry era. Integrating with modern OTel pipelines requires additional work.</li>
  <li><strong>UI and query experience:</strong> The Investigator interface feels dated compared to the cloud-native alternatives. Simple queries that take seconds in Datadog or NRQL can require navigating multiple drill-down menus.</li>
</ul>

<h2>The Broadcom Acquisition Factor</h2>
<p>Broadcom has a well-documented history of acquiring mature enterprise software and reducing investment in R&D while monetizing the installed base - a strategy that worked with CA, Symantec, and VMware. Customers using DX APM should evaluate their long-term roadmap with this context:</p>
<blockquote><strong>Questions to ask your Broadcom account team:</strong> What is the engineering headcount on DX APM? What new capabilities shipped in the last 12 months? What is the Kubernetes/container roadmap? When is OpenTelemetry natively supported?</blockquote>

<h2>Migration Considerations</h2>
<p>For organizations considering migrating away from DX APM, the key challenges are:</p>
<ul>
  <li><strong>Custom metric re-expression:</strong> DX APM's metric naming conventions (Agent|Process|Resource:MetricName) require translation into the target platform's schema.</li>
  <li><strong>Business logic in alert rules:</strong> Years of accumulated alert configurations in Introscope require careful auditing before migration.</li>
  <li><strong>Historical data:</strong> SmartStor data doesn't export to standard formats cleanly; plan for a "start fresh" cutover rather than a full history migration.</li>
</ul>

<div class="callout">
  <div class="callout-title">Strategic Recommendation</div>
  If DX APM is working for your legacy Java/mainframe applications in an on-prem environment with no near-term cloud migration, staying put may be entirely reasonable. If you have new cloud-native workloads being built in parallel, instrument those with a modern OTel-native platform from day one and run hybrid until the legacy migration is complete. Avoid extending DX APM coverage to new cloud-native services.
</div>
    `
  },

  /* ── Comparison Posts ── */
  {
    id: 'datadog-vs-newrelic-deep-comparison-2026',
    bannerImage: '/blog-banners/comparison-bars.jpg',
    title: 'Datadog vs New Relic (2026): The Definitive Head-to-Head',
    subtitle: 'Both platforms cover the full observability stack. The differences lie in pricing philosophy, OTel commitment, and where each excels under pressure. Here\'s the unvarnished comparison.',
    category: 'Comparison',
    icon: '⚔️',
    bgGradient: 'linear-gradient(135deg, #1a0533 0%, #1e1b4b 40%, #003d2b 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-18',
    readTime: 13,
    tags: ['Datadog', 'New Relic', 'comparison', 'APM', 'pricing'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Datadog wins on UI polish, breadth of integrations, and AI-driven alerting - but costs more at scale.</li>
    <li>New Relic wins on OTel-native workflows, pricing predictability, and teh 100 GB free tier.</li>
    <li>For high-cardinality querying and custom analytics, New Relic's NRDB gives more flexibility than Datadog's fixed dashboards.</li>
    <li>Teams that prioritize avoiding vendor lock-in should lean New Relic; teams that want the most out-of-the-box signal should lean Datadog.</li>
  </ul>
</div>

<h2>The Core Philosophy Gap</h2>
<p>Datadog and New Relic both started as monitoring tools and both evolved into full observability platforms - but they took opposite philosophical paths to get there. <strong>Datadog</strong> built its platform by acquiring and integrating best-of-breed tools (Datadog APM, Logs, RUM, Security, Profiling, Synthetics) into a single unified agent and UI. <strong>New Relic</strong> rebuilt its entire platform around a single petabyte-scale telemetry database (NRDB) and bet its future on OpenTelemetry as the instrumentation standard.</p>
<p>This divergence has real consequences for how you'll use each product day-to-day.</p>

<h2>APM &amp; Distributed Tracing</h2>
<table>
  <thead><tr><th>Feature</th><th>Datadog</th><th>New Relic</th></tr></thead>
  <tbody>
    <tr><td>Instrumentation</td><td>Proprietary dd-trace agents + OTel support</td><td>OTel-first; proprietary agents still available</td></tr>
    <tr><td>Trace UI</td><td>Flame graph, Service Map, correlated host metrics</td><td>Distributed tracing UI, correlated NRDB queries</td></tr>
    <tr><td>Service Catalog</td><td>Yes - auto-discovered with SLO health</td><td>Service map in APM; less opinionated</td></tr>
    <tr><td>Continuous Profiling</td><td>Yes - code-level CPU/memory attribution</td><td>Yes - CodeStream-linked</td></tr>
    <tr><td>Sampling</td><td>Head-based + tail-based (App Analytics)</td><td>Head-based; Infinite Tracing for tail-based</td></tr>
    <tr><td>AI anomaly detection</td><td>Watchdog - automated, always on</td><td>Applied Intelligence - event correlation engine</td></tr>
  </tbody>
</table>
<p>Datadog's APM UI is marginally more polished for day-to-day incident triage - the Service Map, correlated flame graphs, and Watchdog anomaly cards are immediately actionable. New Relic's strength is querying: you can write NRQL directly against spans to answer questions the fixed UI doesn't expose, like <code>SELECT percentile(duration, 95) FROM Span WHERE service.name = 'checkout' FACET db.statement SINCE 1 hour ago</code>.</p>

<h2>Log Management</h2>
<table>
  <thead><tr><th>Feature</th><th>Datadog</th><th>New Relic</th></tr></thead>
  <tbody>
    <tr><td>Ingestion pipeline</td><td>Grok parsers, remappers, enrichment</td><td>Drop rules, parsing rules, enrichment</td></tr>
    <tr><td>Storage tiers</td><td>Online (indexed) → Flex Logs → Archives (S3/GCS)</td><td>Live (indexed) → Data retention → S3 export</td></tr>
    <tr><td>Log-to-trace correlation</td><td>Automatic via trace ID injection</td><td>Automatic via trace ID + NRDB linking</td></tr>
    <tr><td>Query language</td><td>Datadog Log Query (Lucene-based)</td><td>NRQL over Log events - more powerful</td></tr>
    <tr><td>Anomaly detection</td><td>Log Anomalies (pattern-based)</td><td>Log patterns + alert on log volume spikes</td></tr>
  </tbody>
</table>
<p>Datadog's log management UI and pipeline tooling are more refined. New Relic's NRQL over logs gives more analytical power - you can join log data with span data in a single query, something that requires dashboard-level stitching in Datadog.</p>

<h2>Kubernetes &amp; Infrastructure</h2>
<p><strong>Datadog</strong> has arguably the most full Kubernetes monitoring of any platform - cluster agent, node agent, DaemonSets, Admission Controller for auto-injection, and a built-in Kubernetes Explorer with pod/deployment/node health views. NPM (Network Performance Monitoring) and USM (Universal Service Monitoring via eBPF) add depth without code instrumentation.</p>
<p><strong>New Relic</strong> counters with <strong>Pixie</strong> - eBPF-based in-cluster live debugging that captures full request/response payloads with zero egress cost. For Kubernetes live debugging (not just metrics), Pixie has no equivalent in Datadog's stack. New Relic's infrastructure agent and Kubernetes integration also cover the essentials competently.</p>

<h2>Pricing: The Real-World Numbers</h2>
<table>
  <thead><tr><th>Scenario</th><th>Datadog (est.)</th><th>New Relic (est.)</th></tr></thead>
  <tbody>
    <tr><td>5 hosts, minimal tracing, 10 GB logs/mo</td><td>~$300 - 500/mo</td><td>Free tier covers this</td></tr>
    <tr><td>50 hosts, moderate tracing, 100 GB logs/mo</td><td>~$3,000 - 5,500/mo</td><td>~$1,500 - 2,500/mo</td></tr>
    <tr><td>200 hosts, heavy tracing, RUM, 500 GB logs/mo</td><td>~$18,000 - 28,000/mo</td><td>~$8,000 - 14,000/mo</td></tr>
    <tr><td>Enterprise contract (500+ hosts)</td><td>Negotiated - typically significant discount</td><td>Negotiated - generally lower baseline</td></tr>
  </tbody>
</table>
<p>New Relic's per-GB ingest model is more predictable. Datadog's multi-axis pricing (per host + per GB logs + per million indexed spans + per custom metric beyond allocation) requires active management to avoid surprises.</p>

<h2>When to Choose Datadog</h2>
<ul>
  <li>Your team wants the fastest time-to-value with minimal configuration - Watchdog, Service Catalog, and Flame Graph work out of the box.</li>
  <li>You need deep cloud security monitoring alongside observability in one platform.</li>
  <li>You're running multi-cloud or hybrid and want the richest set of out-of-the-box integrations (750+).</li>
  <li>Your engineers already know Datadog - switching cost matters.</li>
</ul>

<h2>When to Choose New Relic</h2>
<ul>
  <li>You're standardising on OpenTelemetry and want a backend that treats OTel as a first-class citizen.</li>
  <li>You want to evaluate at zero cost - 100 GB/month free is meaningful.</li>
  <li>Your team runs complex ad-hoc telemetry analytics - NRQL over a unified data model beats Datadog's per-product query languages.</li>
  <li>Avoiding vendor lock-in is a hard requirement - OTel instrumentation is portable.</li>
</ul>

<div class="callout">
  <div class="callout-title">Decision Framework</div>
  Run a 2-week parallel proof-of-concept. Instrument your three most critical services with OTel and point the OTLP exporter at both platforms simultaneously. Simulate your last three major incidents using only each tool. Calculate projected cost at 2× current scale. The winner in your environment may differ from industry analysts' rankings.
</div>
    `
  },

  {
    id: 'datadog-vs-appdynamics-cloudnative-vs-enterprise',
    bannerImage: '/blog-banners/comparison.jpg',
    title: 'Datadog vs AppDynamics: Cloud-Native Agility vs Enterprise APM Depth',
    subtitle: 'Datadog was built for the cloud. AppDynamics was built for the enterprise. When your architecture sits between those worlds, the choice gets interesting.',
    category: 'Comparison',
    icon: '🆚',
    bgGradient: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #0c1a3a 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-19',
    readTime: 11,
    tags: ['Datadog', 'AppDynamics', 'comparison', 'enterprise APM', 'cloud-native'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Datadog excels in cloud-native, containerised, polyglot environments - faster setup, broader coverage.</li>
    <li>AppDynamics excels in large enterprise Java/.NET applications where Business Transaction modelling provides unique business context.</li>
    <li>Cisco's FSO platform gives AppDynamics a network-to-application context that Datadog doesn't match natively.</li>
    <li>For greenfield cloud-native projects, Datadog wins. For modernising complex legacy Java estates, AppDynamics' depth is hard to replicate.</li>
  </ul>
</div>

<h2>Architectural Philosophy</h2>
<p>The fundamental difference between Datadog and AppDynamics is the unit of measurement. <strong>Datadog</strong> is service-centric and metric-centric - it measures services, hosts, containers, and traces, then lets you build dashboards and alerts on top. <strong>AppDynamics</strong> is <em>transaction-centric</em> - it builds its entire model around Business Transactions (BTs), mapping technical operations to real user actions like "Checkout," "Login," or "Search."</p>
<p>This difference compounds throughout every part of the product. In Datadog, "the checkout service is slow" requires cross-referencing APM traces, RUM sessions, and database spans. In AppDynamics, its a single Business Transaction degradation visible at a glance with business impact quantified in the same view.</p>

<h2>Instrumentation &amp; Setup</h2>
<table>
  <thead><tr><th>Aspect</th><th>Datadog</th><th>AppDynamics</th></tr></thead>
  <tbody>
    <tr><td>Time to first trace</td><td>Minutes (auto-instrumentation, Helm chart)</td><td>Minutes (JVM agent attach) - but config is deeper</td></tr>
    <tr><td>Language support</td><td>15+ languages; OTel for the rest</td><td>Java, .NET, PHP, Python, Node.js, Go, iOS, Android</td></tr>
    <tr><td>No-code instrumentation</td><td>USM via eBPF (golden signals only)</td><td>No equivalent; agent required</td></tr>
    <tr><td>Kubernetes-native</td><td>Cluster agent, DaemonSet, admission controller</td><td>Operator available; less native</td></tr>
    <tr><td>Configuration complexity</td><td>Low - sensible defaults throughout</td><td>Medium-high - BT configuration rewards investment</td></tr>
  </tbody>
</table>

<h2>APM Core: Tracing &amp; Root Cause Analysis</h2>
<p><strong>Datadog</strong> generates distributed traces automatically, correlates them with host metrics and logs, and surfaces anomalies via Watchdog. The Service Map visualises inter-service dependencies in real time. For a microservices architecture with dozens of services, Datadog's topology awareness and AI anomaly detection reduce MTTR significantly.</p>
<p><strong>AppDynamics</strong> traces at the Business Transaction level - every end-to-end flow from browser click to database write is captured as a single unit. The Cognition Engine analyses BT health, learns dynamic baselines, and generates root cause analysis narratives that identify the specific tier, node, and code path responsible. For complex JEE applications with intricate in-process call chains, AppDynamics' bytecode instrumentation depth is unmatched.</p>
<blockquote><strong>Key insight:</strong> Datadog tells you wich service is slow. AppDynamics tells you which business transaction is slow, how much revenue impact it represents, and the specific SQL query on node X that caused it - in one screen.</blockquote>

<h2>Business Metrics Integration</h2>
<p>This is AppDynamics' strongest differentiator. Business iQ maps custom business KPIs (revenue per minute, successful orders, cart abandonment rate) directly to APM data. During an incident, a single dashboard shows both technical degradation and live business impact.</p>
<p>Datadog offers custom metrics and dashboards that can approximate this, but it requires manual instrumentation of business events and custom dashboard construction. AppDynamics' business context is architecturally baked in, not bolted on.</p>

<h2>Cloud-Native &amp; Kubernetes</h2>
<p>Datadog is the clear winner here. Its Kubernetes Explorer, cluster agent with auto-discovery, Admission Controller for zero-touch APM injection, and eBPF-based USM give it full Kubernetes coverage with minimal operational overhead. Container-level CPU profiling and network flow tracking are genuinely useful for platform teams managing large Kubernetes fleets.</p>
<p>AppDynamics supports Kubernetes via the AppDynamics Operator, but container monitoring is a secondary capability compared to its traditional server-based model. The product wasn't architected for ephemeral workloads and it shows in the complexity of Kubernetes configuration.</p>

<h2>Security &amp; Network Context</h2>
<p>Datadog has invested heavily in Cloud Security: CSPM (Cloud Security Posture Management), CSM Threats (runtime threat detection), and Application Security (library vulnerability scanning). These are premium add-ons but the integration with APM traces is unique - a suspicious trace can be correlated with a security signal automatically.</p>
<p>AppDynamics, as part of Cisco's FSO platform, integrates with ThousandEyes (network/internet intelligence) and Cisco Secure. For organisations already in the Cisco ecosystem, this provides network-layer context that Datadog can't match natively - especially valuable for diagnosing whether a performance issue is application-side or network-side.</p>

<h2>Pricing Model</h2>
<table>
  <thead><tr><th>Model</th><th>Datadog</th><th>AppDynamics</th></tr></thead>
  <tbody>
    <tr><td>Primary unit</td><td>Per host/container + per GB + per span</td><td>Per CPU core (server-side) or per user (SaaS)</td></tr>
    <tr><td>Predictability</td><td>Medium - multiple dimensions</td><td>High - core-based is more linear</td></tr>
    <tr><td>Enterprise negotiation</td><td>Yes - significant at scale</td><td>Yes - often bundled with Cisco ELA</td></tr>
    <tr><td>Free tier</td><td>14-day trial only</td><td>15-day trial only</td></tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">Decision Matrix</div>
  <strong>Choose Datadog if:</strong> You're primarily cloud-native, need fast setup, value breadth over depth, or have polyglot microservices.<br/><br/>
  <strong>Choose AppDynamics if:</strong> You run complex Java/.NET enterprise applications, need business transaction context, are already in the Cisco ecosystem, or require network-to-application correlation.
</div>
    `
  },

  {
    id: 'newrelic-vs-splunk-observability-comparison-2026',
    bannerImage: '/blog-banners/comparison-bars.jpg',
    title: 'New Relic vs Splunk: OTel-Native Observability vs Log-First Intelligence',
    subtitle: 'Both platforms handle the full telemetry stack. But New Relic was built for developers debugging services; Splunk was built for operators searching logs. That origin still shapes everything.',
    category: 'Comparison',
    icon: '🔬',
    bgGradient: 'linear-gradient(135deg, #003d2b 0%, #064e3b 40%, #431407 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-21',
    readTime: 11,
    tags: ['New Relic', 'Splunk', 'comparison', 'log analytics', 'OpenTelemetry'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>New Relic is purpose-built for MELT (Metrics, Events, Logs, Traces) with a unified query model via NRQL - ideal for developer-centric observability.</li>
    <li>Splunk leads on log analytics power, SIEM integration, and compliance-grade data retention - ideal for security-observability convergence.</li>
    <li>Splunk Observability Cloud (ex-SignalFx) uses NoSample™ tracing - every trace is retained, not sampled. New Relic requires Infinite Tracing for tail-based sampling.</li>
    <li>New Relic is almost always cheaper per GB for pure observability workloads. Splunk's value shines when you need SIEM + Observability from one platform.</li>
  </ul>
</div>

<h2>Origins Shape Everything</h2>
<p><strong>Splunk</strong> was founded in 2003 to solve one problem: making machine data searchable. Its SPL (Search Processing Language) is extraordinarily powerful for log analytics, and that DNA runs through every Splunk product. Even Splunk Observability Cloud - its cloud-native APM product built on teh SignalFx acquisition - shows Splunk's data-analytics roots in how it exposes metric and trace exploration.</p>
<p><strong>New Relic</strong> was founded in 2008 specifically for application performance monitoring. Its DNA is developer-first: instrument your app, see how it performs, find slow transactions. The 2020 rebuild around NRDB and the 2023 OTel-first pivot are both expressions of the same instinct - give developers a single, powerful, open platform to understand their applications.</p>

<h2>APM &amp; Distributed Tracing</h2>
<table>
  <thead><tr><th>Feature</th><th>New Relic</th><th>Splunk Observability Cloud</th></tr></thead>
  <tbody>
    <tr><td>Instrumentation</td><td>OTel-first + proprietary agents</td><td>OTel + SignalFx smart agents</td></tr>
    <tr><td>Trace sampling</td><td>Head-based default; Infinite Tracing (tail-based, add-on)</td><td>NoSample™ - every trace retained by default</td></tr>
    <tr><td>Trace UI</td><td>Waterfall, correlated NRDB queries, Errors Inbox</td><td>Waterfall, Tag Spotlight, Related Content panel</td></tr>
    <tr><td>Service dependency map</td><td>Service map in APM</td><td>Service Map with RED metrics per edge</td></tr>
    <tr><td>AI/ML anomaly detection</td><td>Applied Intelligence - event correlation</td><td>AutoDetect - streaming anomaly detection</td></tr>
  </tbody>
</table>
<p>Splunk's NoSample™ tracing is a genuine technical differentiator. In high-traffic systems, tail-based sampling means you never miss a rare but important trace - the 0.01% of requests that hit a specific code path and take 30 seconds. New Relic's Infinite Tracing provides this capability, but it requires the Trace Observer endpoint and adds cost.</p>

<h2>Log Analytics: Splunk's Home Ground</h2>
<p>This is where the comparison isn't close. SPL is simply more powerful than NRQL for log-centric workloads:</p>
<ul>
  <li><strong>Transaction command:</strong> SPL's <code>transaction</code> command groups related events across time into a single object - invaluable for session analysis, user journey reconstruction, and multi-step workflow debugging.</li>
  <li><strong>Stat transformations:</strong> SPL's statistical operators (streamstats, eventstats, sistats) allow rolling windows, event-relative calculations, and across-group comparisons that NRQL can't match.</li>
  <li><strong>Lookups and enrichment:</strong> Splunk's lookup tables enable real-time enrichment of log events with external data (CMDB, threat intel, user directories) at search time.</li>
  <li><strong>Compliance retention:</strong> Splunk's SmartStore and tiered storage architecture was designed for multi-year log retention at petabyte scale - a common requirement for regulated industries.</li>
</ul>
<p>New Relic's log management handles standard operational observability - finding errors, correlating with traces, alerting on log volume spikes - very well. It handles complex log analytics workloads less well than Splunk.</p>

<h2>Infrastructure &amp; Kubernetes Monitoring</h2>
<p>New Relic's <strong>Pixie</strong> is its Kubernetes secret weapon - eBPF-based live debugging with in-cluster data retention, full request/response capture, and near-zero overhead. For Kubernetes developers needing instant visibility without YAML configuration, Pixie is remarkable.</p>
<p>Splunk Observability Cloud's <strong>Kubernetes Navigator</strong> provides a topology-aware view of cluster, node, pod, and container health with streaming metrics at 10-second resolution. Its infrastructure monitoring (formerly SignalFx) is purpose-built for cloud-native and was ahead of the market in streaming metrics before most competitors caught up.</p>

<h2>Security: SIEM Integration</h2>
<p>Splunk Enterprise Security (ES) is one of the leading SIEM platforms, deeply integrated with Splunk's log platform. For organisations that need security operations (threat detection, compliance, incident response) from the same platform as their observability data, Splunk is the strongest answer in the market.</p>
<p>New Relic has limited native security capabilities - it has vulnerability management (library CVE scanning surfaced in APM) but no SIEM. If security is a primary use case alongside observability, Splunk wins this comparison unambiguously.</p>

<h2>Pricing Comparison</h2>
<table>
  <thead><tr><th>Workload</th><th>New Relic</th><th>Splunk</th></tr></thead>
  <tbody>
    <tr><td>Pure APM (100 services, light logging)</td><td>~$1,500 - 3,000/mo</td><td>~$2,500 - 5,000/mo</td></tr>
    <tr><td>APM + heavy log analytics (500 GB/mo)</td><td>~$5,000 - 9,000/mo</td><td>~$8,000 - 15,000/mo</td></tr>
    <tr><td>APM + SIEM (enterprise)</td><td>Not applicable (no native SIEM)</td><td>Contract pricing - significant value bundle</td></tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">Choose New Relic if…</div>
  Your primary use case is application observability, your team is developer-centric, you want OTel portability, or cost efficiency matters more than log analytics depth.<br/><br/>
  <strong>Choose Splunk if…</strong> Log analytics is central to your workflow, you need SIEM + observability from one platform, compliance mandates multi-year log retention, or you're a security-operations team that also wants APM.
</div>
    `
  },

  {
    id: 'appdynamics-vs-broadcom-dxapm-enterprise-showdown',
    bannerImage: '/blog-banners/comparison.jpg',
    title: 'AppDynamics vs Broadcom DX APM: The Enterprise APM Showdown',
    subtitle: 'Both target large enterprises. Both dominate Java application monitoring. But one is accelerating into cloud-native; the other is managing a legacy. Which fits your roadmap?',
    category: 'Comparison',
    icon: '🏢',
    bgGradient: 'linear-gradient(135deg, #0c1a3a 0%, #1e2d5a 50%, #2d0a0a 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-23',
    readTime: 10,
    tags: ['AppDynamics', 'Broadcom', 'CA APM', 'DX APM', 'enterprise APM', 'comparison'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Both platforms have deep Java/.NET APM DNA - AppDynamics from its 2008 founding, Broadcom DX APM from teh 1998 Wily Introscope lineage.</li>
    <li>AppDynamics is actively investing in cloud-native, Kubernetes, and Cisco FSO integration. Broadcom DX APM is in maintenance mode.</li>
    <li>For on-premises, air-gapped, or mainframe environments, DX APM's SmartStor and long-term metric retention may still be the better fit.</li>
    <li>Broadcom's post-acquisition track record (CA, Symantec, VMware) makes long-term roadmap planning for DX APM customers a serious concern.</li>
  </ul>
</div>

<h2>Shared DNA, Different Trajectories</h2>
<p>These two products share more history than most people realise. Both emerged from the late-1990s/early-2000s wave of enterprise Java monitoring tools, both use bytecode instrumentation agents, and both built their reputations in Fortune 500 banking, insurance, and retail environments. Today they're on opposite trajectories.</p>
<p><strong>AppDynamics</strong>, acquired by Cisco in 2017 for $3.7 billion, has received sustained investment and is the APM pillar of Cisco's FSO (Full Stack Observability) platform. It's actively expanding into cloud-native and Kubernetes environments. <strong>Broadcom DX APM</strong> (formerly CA APM), acquired as part of Broadcom's $18.9 billion CA Technologies purchase in 2018, has seen more limited investment and is widely perceived to be in harvest mode.</p>

<h2>Agent Architecture &amp; Instrumentation</h2>
<table>
  <thead><tr><th>Aspect</th><th>AppDynamics</th><th>Broadcom DX APM</th></tr></thead>
  <tbody>
    <tr><td>Java agent</td><td>Lightweight bytecode instrumentation; low overhead (&lt;2% in production)</td><td>Introscope agent - deep bytecode; higher overhead in some configs</td></tr>
    <tr><td>.NET agent</td><td>Good coverage; CLR profiling API</td><td>Strong - mature .NET support since early 2000s</td></tr>
    <tr><td>Node.js/Python/Go</td><td>Supported with auto-instrumentation</td><td>Limited; primarily Java/.NET focused</td></tr>
    <tr><td>Mainframe</td><td>Limited</td><td>Strong - CICS, IMS, MQ monitoring available</td></tr>
    <tr><td>OTel support</td><td>In progress - partial OTel ingestion</td><td>Minimal</td></tr>
    <tr><td>Kubernetes/containers</td><td>AppDynamics Operator + cluster agent</td><td>Limited - not architecturally native</td></tr>
  </tbody>
</table>

<h2>Application Performance Monitoring</h2>
<p><strong>AppDynamics</strong> organises everything around Business Transactions (BTs) - every operation from end-user click to database write is a measurable, nameable BT. The Cognition Engine learns dynamic baselines per BT, detects anomalies, and generates root cause narratives. The Business iQ layer maps BT health to business KPIs (revenue, conversions). It's a cohesive, deeply thought-through APM model.</p>
<p><strong>Broadcom DX APM</strong> uses Introscope's metric tree - a hierarchical namespace of numeric metrics captured at every instrumented code point. The granularity is remarkable: you can measure time spent in specific EJB methods, connection pool states, garbage collection overhead, and thread pool saturation at a level of detail that few tools match. But presenting that data in a coherent incident investigation workflow requires significant manual configuration of dashboards and alert rules - it doesn't do it for you.</p>

<h2>Data Storage &amp; Long-Term Retention</h2>
<p>This is where Broadcom DX APM has a genuine differentiator. <strong>SmartStor</strong> - DX APM's proprietary time-series storage engine - uses differential compression to store metric data efficiently for months or years on-premises. Long-term trend analysis without an external data warehouse is built in.</p>
<p>AppDynamics stores metric data for 4 hours at full resolution, rolling up to lower resolutions for longer retention. For compliance use cases requiring multi-year metric retention, AppDynamics requires third-party storage integration. DX APM handles this natively.</p>

<h2>Vendor Trajectory &amp; Support Quality</h2>
<p>This dimension is critical and often underweighted in feature comparisons.</p>
<p><strong>AppDynamics under Cisco</strong> has continued to release meaningful new features: the FSO platform, Kubernetes monitoring improvements, Business iQ enhancements, and growing OTel support. Support quality is generally rated well, and the product has a defined forward roadmap.</p>
<p><strong>DX APM under Broadcom</strong> faces a more uncertain outlook. Broadcom's acquisition pattern - aggressive cost reduction in R&D and support after acquisition - is documented across CA Technologies, Symantec, and VMware. Customers consistently report reduced support quality and slowing feature development post-acquisition. This doesn't mean DX APM stops working - many installations will run well for years - but it does mean the gap with more actively developed competitors will widen.</p>

<h2>Migration Path</h2>
<p>For DX APM customers considering migration to AppDynamics:</p>
<ul>
  <li><strong>Agent swap:</strong> Both use JVM bytecode agents; swapping is technically feasible but requires testing against each application's specific frameworks.</li>
  <li><strong>Alert migration:</strong> DX APM's Introscope alert definitions use a metric path syntax that doesn't map directly to AppDynamics' Business Transaction health rules. Manual migration with rationalisation is the only path.</li>
  <li><strong>Dashboard migration:</strong> No automated tool exists; rebuild in AppDynamics using BT-centric views, wich typically provide more insight than the migrated metric-tree dashboards anyway.</li>
  <li><strong>Historical data:</strong> SmartStor data doesn't export to formats AppDynamics ingests. Plan for a clean cutover with parallel running.</li>
</ul>

<div class="callout">
  <div class="callout-title">Bottom Line</div>
  If you're evaluating today and have no legacy DX APM investment: choose AppDynamics. If you're already on DX APM: assess your architecture. On-prem mainframe/legacy Java with no cloud migration in sight? DX APM may serve you for years. Hybrid or cloud migration in progress? Start AppDynamics on new workloads now and migrate legacy when it makes operational sense.
</div>
    `
  },

  {
    id: 'ultimate-apm-comparison-datadog-newrelic-splunk-appdynamics-broadcom-2026',
    bannerImage: '/blog-banners/comparison-podium.jpg',
    title: 'The Ultimate APM Comparison 2026: Datadog, New Relic, Splunk, AppDynamics & Broadcom DX APM',
    subtitle: 'One table to rule them all. A comprehensive, vendor-neutral scoring of every major APM platform across 20 dimensions  -  so your team can make a defensible decision.',
    category: 'Comparison',
    icon: '🏆',
    bgGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1e3a8a 35%, #6b21a8 65%, #003d2b 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-25',
    readTime: 15,
    tags: ['Datadog', 'New Relic', 'Splunk', 'AppDynamics', 'Broadcom', 'APM comparison', 'observability'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>No single platform wins every dimension - teh right choice depends on your architecture, team, and budget.</li>
    <li>Datadog scores highest overall for cloud-native organisations who want breadth and speed.</li>
    <li>New Relic offers the best price-to-value for developer-centric observability, especially with OpenTelemetry.</li>
    <li>Splunk is the only platform with enterprise-grade SIEM + observability convergence.</li>
    <li>AppDynamics remains the strongest for enterprise Java with business context; Broadcom DX APM is best suited for stable on-prem legacy environments.</li>
  </ul>
</div>

<h2>The 20-Dimension Scorecard</h2>
<p>Scores are ★ (basic), ★★ (good), ★★★ (excellent), based on publicly available product documentation, community feedback, and analyst reports as of mid-2026. All five vendors provide more capability than any one score can capture - use this as a starting filter, not a final verdict.</p>

<table>
  <thead>
    <tr>
      <th>Dimension</th>
      <th>Datadog</th>
      <th>New Relic</th>
      <th>Splunk</th>
      <th>AppDynamics</th>
      <th>Broadcom DX APM</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>Distributed Tracing</strong></td><td>★★★</td><td>★★★</td><td>★★★</td><td>★★★</td><td>★★</td></tr>
    <tr><td><strong>Log Analytics</strong></td><td>★★★</td><td>★★</td><td>★★★</td><td>★★</td><td>★★</td></tr>
    <tr><td><strong>Metrics &amp; Dashboards</strong></td><td>★★★</td><td>★★★</td><td>★★★</td><td>★★★</td><td>★★★</td></tr>
    <tr><td><strong>Kubernetes Monitoring</strong></td><td>★★★</td><td>★★★</td><td>★★</td><td>★★</td><td>★</td></tr>
    <tr><td><strong>Business Metrics / KPI Correlation</strong></td><td>★★</td><td>★★</td><td>★★</td><td>★★★</td><td>★★</td></tr>
    <tr><td><strong>AI / Anomaly Detection</strong></td><td>★★★</td><td>★★</td><td>★★</td><td>★★★</td><td>★★</td></tr>
    <tr><td><strong>Root Cause Analysis</strong></td><td>★★★</td><td>★★</td><td>★★</td><td>★★★</td><td>★★</td></tr>
    <tr><td><strong>OpenTelemetry Support</strong></td><td>★★</td><td>★★★</td><td>★★</td><td>★★</td><td>★</td></tr>
    <tr><td><strong>Real User Monitoring (RUM)</strong></td><td>★★★</td><td>★★★</td><td>★★</td><td>★★★</td><td>★</td></tr>
    <tr><td><strong>Synthetic Monitoring</strong></td><td>★★★</td><td>★★</td><td>★★</td><td>★★</td><td>★</td></tr>
    <tr><td><strong>SIEM / Security</strong></td><td>★★</td><td>★</td><td>★★★</td><td>★★</td><td>★</td></tr>
    <tr><td><strong>Network Monitoring</strong></td><td>★★★</td><td>★★</td><td>★★</td><td>★★★</td><td>★★</td></tr>
    <tr><td><strong>Cloud Cost Visibility</strong></td><td>★★★</td><td>★</td><td>★★</td><td>★★</td><td>★</td></tr>
    <tr><td><strong>On-Premises Deployment</strong></td><td>★</td><td>★</td><td>★★★</td><td>★★</td><td>★★★</td></tr>
    <tr><td><strong>Legacy / Mainframe Support</strong></td><td>★</td><td>★</td><td>★★</td><td>★★</td><td>★★★</td></tr>
    <tr><td><strong>Java/.NET APM Depth</strong></td><td>★★</td><td>★★</td><td>★★</td><td>★★★</td><td>★★★</td></tr>
    <tr><td><strong>Ease of Setup</strong></td><td>★★★</td><td>★★★</td><td>★★</td><td>★★</td><td>★★</td></tr>
    <tr><td><strong>Pricing Transparency</strong></td><td>★★</td><td>★★★</td><td>★★</td><td>★★</td><td>★★</td></tr>
    <tr><td><strong>Free Tier / Trial</strong></td><td>★ (14-day)</td><td>★★★ (100 GB/mo)</td><td>★ (trial)</td><td>★ (15-day)</td><td>★ (trial)</td></tr>
    <tr><td><strong>Vendor Momentum / Roadmap</strong></td><td>★★★</td><td>★★★</td><td>★★</td><td>★★★</td><td>★</td></tr>
  </tbody>
</table>

<h2>Platform Summaries</h2>

<h3>Datadog - Best Overall for Cloud-Native Teams</h3>
<p>Datadog is the safest default for organisations building on AWS, GCP, or Azure with containerised workloads. The breadth of integrations (750+), the quality of Watchdog AI alerting, the Kubernetes Explorer, and the polished unified UX make it the fastest path from "nothing" to "meaningfully observable." The price premium is real - budget carefully and enable Metrics Without Limits from day one.</p>

<h3>New Relic - Best Value + OTel-Native</h3>
<p>New Relic is the right choice for developer-first teams that care about portability, pricing predictability, and OTel standardisation. NRDB's query flexibility, Pixie for Kubernetes live debugging, Errors Inbox for developer workflows, and the 100 GB free tier make it the most accessible serious observability platform. The UI is slightly less polished than Datadog's, but the underlying data model is more powerful.</p>

<h3>Splunk - Best for Security + Observability Convergence</h3>
<p>Splunk wins when log analytics depth, SIEM integration, and compliance-grade data retention are requirements. If your security operations team and your observability team are the same people - or need to be - Splunk is the only platform that serves both credibly. The APM capabilities (Observability Cloud, ex-SignalFx) are strong, especially NoSample™ tracing. The price is higher than pure-observability alternatives.</p>

<h3>AppDynamics - Best Business Context for Enterprise Java</h3>
<p>AppDynamics is the right choice when "wich code path is hurting revenue right now" is the question that matters most. Business Transaction monitoring, Business iQ, and the Cognition Engine provide a combination of technical depth and business context that no other platform matches for complex enterprise Java or .NET applications. Cisco's FSO integration adds network context. For cloud-native greenfield, start with Datadog or New Relic instead.</p>

<h3>Broadcom DX APM - Best for Stable On-Premises Legacy</h3>
<p>Broadcom DX APM (CA APM) is the right choice only in a narrow but real scenario: large on-premises Java installations with no imminent cloud migration, no Kubernetes in sight, and an existing investment in the CA/Broadcom toolchain. SmartStor's long-term retention, Introscope's deep JEE visibility, and mainframe monitoring capabilities are genuinely unmatched for that context. For anything else, choose a more actively invested alternative.</p>

<h2>Decision Flowchart</h2>
<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:22px 26px">
  <p style="margin:0 0 10px;font-weight:700">Answer these questions in order:</p>
  <ol style="margin:0;padding-left:22px;line-height:2.2">
    <li>Do you need SIEM + observability from one platform? <strong>→ Splunk</strong></li>
    <li>Do you have complex legacy Java/.NET on-premises with no near-term cloud migration? <strong>→ DX APM</strong> (or AppDynamics if budget allows)</li>
    <li>Is business transaction monitoring and revenue correlation critical? <strong>→ AppDynamics</strong></li>
    <li>Is OpenTelemetry standardisation or avoiding lock-in a hard requirement? <strong>→ New Relic</strong></li>
    <li>Do you want the fastest time-to-value with the broadest feature set for cloud-native? <strong>→ Datadog</strong></li>
    <li>Are you a small team or want to evaluate at zero cost? <strong>→ New Relic</strong> (free tier)</li>
  </ol>
</div>

<div class="callout">
  <div class="callout-title">Final Recommendation</div>
  Run a 30-day proof-of-concept before signing any contract. Instrument the same three critical services on each finalist platform, simulate your last three major incidents, test your most-used query patterns, and calculate projected cost at 2× current scale. The platform that performs best <em>in your environment</em> is the right answer - ignore the analyst rankings.
</div>
    `
  },

  /* ══ AI in Observability  -  Beginner-to-Expert Path ══ */
  {
    id: 'ai-observability-beginner-intro',
    bannerImage: '/blog-banners/ai-observability.jpg',
    title: 'What Is AI in Observability? A Complete Beginner\'s Guide',
    subtitle: 'Level 1 of 5 · No prior knowledge needed. Understand why traditional monitoring breaks down and how AI changes the game  -  explained simply.',
    category: 'AI Observability',
    icon: '🌱',
    bgGradient: 'linear-gradient(135deg, #052e16 0%, #166534 60%, #22c55e 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-24',
    updatedAt: '2026-07-06',
    readTime: 8,
    tags: ['AI', 'observability', 'beginner', 'AIOps', 'monitoring', 'LLM observability'],
    featured: false,
    body: `
<div style="display:inline-flex;align-items:center;gap:8px;background:#dcfce7;color:#166534;font-size:.8rem;font-weight:800;padding:6px 14px;border-radius:50px;margin-bottom:20px;letter-spacing:.04em">🟢 LEVEL 1 OF 5 - BEGINNER</div>

<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Traditional monitoring uses fixed rules; AI learns what "normal" looks like and flags deviations.</li>
    <li>Modern systems generate too much data for humans to read - AI filters teh signal from the noise.</li>
    <li>You don't need a machine-learning background to benefit from AI observability tools today.</li>
    <li>The three pillars of AI observability are: anomaly detection, alert correlation, and root cause analysis.</li>
  </ul>
</div>

<svg viewBox="0 0 780 272" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:12px;margin:28px 0;display:block">
  <rect width="780" height="272" fill="#0f172a" rx="12"/>
  <line x1="390" y1="16" x2="390" y2="256" stroke="#1e293b" stroke-width="1"/>
  <circle cx="390" cy="136" r="24" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <text x="390" y="141" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="11" font-weight="800">VS</text>
  <text x="195" y="44" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2">TRADITIONAL MONITORING</text>
  <text x="585" y="44" text-anchor="middle" fill="#22c55e" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2">AI-POWERED OBSERVABILITY</text>
  <circle cx="48" cy="76" r="5" fill="#ef4444"/>
  <text x="62" y="81" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Fixed thresholds (CPU &gt; 80%)</text>
  <circle cx="48" cy="104" r="5" fill="#ef4444"/>
  <text x="62" y="109" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Only known failure modes</text>
  <circle cx="48" cy="132" r="5" fill="#ef4444"/>
  <text x="62" y="137" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Reactive - alerts after failure</text>
  <circle cx="48" cy="160" r="5" fill="#ef4444"/>
  <text x="62" y="165" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Thousands of noisy alerts</text>
  <circle cx="48" cy="188" r="5" fill="#ef4444"/>
  <text x="62" y="193" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Manual root cause investigation</text>
  <circle cx="48" cy="216" r="5" fill="#ef4444"/>
  <text x="62" y="221" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Breaks at microservice scale</text>
  <circle cx="408" cy="76" r="5" fill="#22c55e"/>
  <text x="422" y="81" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Dynamic baselines per service</text>
  <circle cx="408" cy="104" r="5" fill="#22c55e"/>
  <text x="422" y="109" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Detects unknown anomalies</text>
  <circle cx="408" cy="132" r="5" fill="#22c55e"/>
  <text x="422" y="137" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Predictive - warns before failure</text>
  <circle cx="408" cy="160" r="5" fill="#22c55e"/>
  <text x="422" y="165" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">90 - 95% noise reduction</text>
  <circle cx="408" cy="188" r="5" fill="#22c55e"/>
  <text x="422" y="193" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Automated root cause analysis</text>
  <circle cx="408" cy="216" r="5" fill="#22c55e"/>
  <text x="422" y="221" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13">Scales with complexity</text>
</svg>

<h2>Why Traditional Monitoring Breaks Down</h2>
<p>Imagine you're responsible for a web application. You set an alert: "notify me if CPU usage goes above 80%." This works fine - until it doesn't. Maybe your CPU regularly spikes to 85% every Monday morning when the batch job runs. Now that alert fires every week, correctly but uselessly. You start ignoring it. And then one Tuesday, the CPU hits 85% because something is actually broken - and you miss it because you've learned to tune out that alert.</p>
<p>This is the core problem with <strong>rule-based monitoring</strong>: it requires you to predict failures in advance, and it doesn't adapt to normal variation in your system. At the scale of a modern cloud application - hundreds of services, thousands of metrics, millions of events per minute - static rules simply can't keep up.</p>

<h2>What AI Brings to the Table</h2>
<p>AI in observability doesn't mean robots are running your infrastructure. It means machine learning algorithms are continuously analysing your telemetry data to:</p>
<ul>
  <li><strong>Learn what normal looks like</strong> - not a fixed number, but a pattern. "Normal CPU for this service on Monday morning is 70 - 85%." The AI builds this model automatically from historical data.</li>
  <li><strong>Detect deviations from normal</strong> - when something behaves differently from its own learned pattern, the AI flags it, regardless of whether you wrote a rule for it.</li>
  <li><strong>Correlate related signals</strong> - when a deployment causes 47 alerts across 12 services, the AI recognises they're all caused by the same root event and surfaces one incident instead of 47 alerts.</li>
  <li><strong>Prioritise by impact</strong> - not all alerts are equal. AI ranks issues by estimated user impact, so on-call engineers tackle the highest-priority problems first.</li>
</ul>

<h2>The Three Pillars You'll Hear About</h2>
<p>As you go deeper into this topic, you'll encounter three core AI capabilities:</p>
<ol>
  <li><strong>Anomaly Detection</strong> - the AI equivalent of "something unusual is happening here." We'll cover this in depth in Level 2.</li>
  <li><strong>Alert Correlation</strong> - grouping thousands of alerts into a small number of meaningful incidents. This is the topic of Level 3.</li>
  <li><strong>Root Cause Analysis (RCA)</strong> - working backwards from a symptom to the underlying cause. Covered in Levels 4 and 5.</li>
</ol>

<h2>Real Tools You Can Start With Today</h2>
<p>You don't need to build anything from scratch. Every major observability platform has AI capabilities built in:</p>
<ul>
  <li><strong>Datadog Watchdog</strong> - automatically runs anomaly detection across all your metrics without any configuration</li>
  <li><strong>New Relic Applied Intelligence</strong> - correlates alerts into incidents using ML</li>
  <li><strong>Splunk ITSI</strong> - AI-powered service health scoring and episode review</li>
  <li><strong>AppDynamics Cognition Engine</strong> - learns baselines per Business Transaction and generates root cause narratives</li>
</ul>

<h2>One Important Distinction: Observability <em>of</em> AI vs. AI <em>for</em> Observability</h2>
<p>Everything so far has been about <strong>AI for observability</strong> - using machine learning to watch normal software systems (web apps, databases, servers) more intelligently. In 2026 there's a second, newer meaning of the term that's easy to confuse with it, and as a beginner it's worth getting the distinction straight early.</p>
<p>As teams build products on top of large language models (LLMs) and <strong>AI agents</strong>, those AI systems themselves need to be observed - and they misbehave in ways a normal app doesn't. This newer discipline is called <strong>LLM observability</strong> or <strong>agentic observability</strong>. A traditional APM tool asks "is this service fast and error-free?" LLM observability has to ask harder questions:</p>
<ul>
  <li><strong>Was the answer actually correct?</strong> An LLM can return a confident, fluent, completely wrong response with a 200 OK status and 300ms latency. Classic monitoring sees a healthy request; the user got a hallucination.</li>
  <li><strong>What did it cost?</strong> Every request burns tokens, and tokens are money. Cost-per-request and token usage become first-class signals, not afterthoughts.</li>
  <li><strong>What did the agent actually do?</strong> An AI agent chains multiple steps and calls tools. You need to trace the whole reasoning path - which prompt, which tool calls, which retrieved documents - to understand why it did something.</li>
  <li><strong>Is it drifting or being misused?</strong> Prompt quality, jailbreak attempts, and slow degradation in answer quality are things you have to watch for that simply don't exist in a normal database.</li>
</ul>
<p>So the field has genuinely split into two related tracks: the AI-powered monitoring of ordinary systems that this guide introduces, and the observability of AI systems themselves. They share tooling and ideas but answer different questions. If the second one is what brought you here, it's a deeper topic - our <a href="/blog/ai-agents-observability-blind-spot">guide to why every AI agent is an observability blind spot</a> is the right next stop.</p>

<h2>How This Fits the Bigger Observability Picture</h2>
<p>AI observability doesn't replace the fundamentals. You still need solid <a href="/blog/observability-vs-monitoring">monitoring and observability foundations</a>, meaningful <a href="/blog/four-golden-signals">golden signals</a>, and eventually <a href="/blog/distributed-tracing-explained">distributed tracing</a> as your architecture grows. AI layers on top to reduce noise and speed up investigation - especially when you are comparing platforms in our <a href="/blog/datadog-vs-newrelic-vs-splunk-2026">Datadog vs New Relic vs Splunk shootout</a> or building an <a href="/blog/slo-sla-sli-practical-guide">SLO practice</a>.</p>
<p>Teams that succeed treat AI as an amplifier for good telemetry hygiene: structured logs, consistent instrumentation, and clear ownership per service. Without that baseline, even the best ML models produce confident-sounding guesses. With it, anomaly detection and correlation become force multipliers that cut mean time to resolution dramatically.</p>

<div class="callout">
  <div class="callout-title">Your Learning Path</div>
  You're at Level 1. Next up - <strong><a href="/blog/ai-observability-anomaly-detection-explained">Level 2: How Anomaly Detection Actually Works</a></strong>, where we go under the hood on the algorithms that power "intelligent alerting." No maths degree required.
</div>
    `
  },

  {
    id: 'ai-observability-anomaly-detection-explained',
    bannerImage: '/blog-banners/anomaly.jpg',
    title: 'How AI Detects Anomalies: Under the Hood of Intelligent Alerting',
    subtitle: 'Level 2 of 5 · You understand the why. Now learn the how  -  the algorithms and techniques that make anomaly detection work, explained without a maths degree.',
    category: 'AI Observability',
    icon: '🔍',
    bgGradient: 'linear-gradient(135deg, #042f2e 0%, #115e59 60%, #0d9488 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-24',
    readTime: 9,
    tags: ['anomaly detection', 'AI', 'machine learning', 'observability', 'beginner+'],
    featured: false,
    body: `
<div style="display:inline-flex;align-items:center;gap:8px;background:#ccfbf1;color:#0f766e;font-size:.8rem;font-weight:800;padding:6px 14px;border-radius:50px;margin-bottom:20px;letter-spacing:.04em">🔵 LEVEL 2 OF 5 - BEGINNER+</div>

<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Anomaly detection compares current values to a learned "normal" range - not a fixed threshold.</li>
    <li>The normal range shifts with time-of-day and day-of-week patterns automatically.</li>
    <li>Statistical anomalies are measured in standard deviations (σ) - a 3σ event happens ~0.3% of teh time.</li>
    <li>Context matters: a CPU spike during a batch job is normal; the same spike at 3 a.m. on a Sunday isn't.</li>
  </ul>
</div>

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:12px;margin:28px 0;display:block">
  <rect width="780" height="300" fill="#0f172a" rx="12"/>
  <text x="32" y="34" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13" font-weight="700">API Response Time (ms)</text>
  <text x="748" y="34" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="11">Last 24 hours</text>
  <line x1="70" y1="50" x2="70" y2="240" stroke="#334155" stroke-width="1"/>
  <line x1="70" y1="240" x2="748" y2="240" stroke="#334155" stroke-width="1"/>
  <text x="62" y="90" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">600</text>
  <line x1="68" y1="86" x2="748" y2="86" stroke="#1e293b" stroke-width="1"/>
  <text x="62" y="135" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">400</text>
  <line x1="68" y1="131" x2="748" y2="131" stroke="#1e293b" stroke-width="1"/>
  <text x="62" y="180" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">200</text>
  <line x1="68" y1="176" x2="748" y2="176" stroke="#1e293b" stroke-width="1"/>
  <text x="62" y="244" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">0</text>
  <text x="70" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">00:00</text>
  <text x="250" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">06:00</text>
  <text x="408" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">12:00</text>
  <text x="570" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">18:00</text>
  <text x="718" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">24:00</text>
  <polygon points="70,158 130,150 190,155 250,148 310,152 370,154 430,150 490,153 550,156 600,60 620,158 660,153 700,155 748,152 748,176 550,183 490,180 430,178 370,180 310,179 250,176 190,180 130,177 70,181" fill="#0d9488" opacity="0.18"/>
  <polygon points="70,153 130,145 190,150 250,143 310,147 370,149 430,145 490,148 550,151 600,60 620,153 660,148 700,150 748,147 748,164 550,170 490,167 430,166 370,168 310,167 250,164 190,168 130,165 70,168" fill="#0d9488" opacity="0.1"/>
  <polyline points="70,160 130,152 190,156 250,146 310,151 370,154 430,148 490,152 550,155 600,60 620,155 660,150 700,153 748,150" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="6,3"/>
  <polyline points="70,162 130,154 190,158 250,148 310,153 370,156 430,150 490,154 550,158" fill="none" stroke="#2dd4bf" stroke-width="2.5"/>
  <polyline points="620,156 660,152 700,155 748,152" fill="none" stroke="#2dd4bf" stroke-width="2.5"/>
  <circle cx="600" cy="60" r="8" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
  <line x1="600" y1="50" x2="600" y2="10" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <rect x="490" y="4" width="220" height="38" fill="#1e293b" rx="6" stroke="#ef4444" stroke-width="1"/>
  <text x="600" y="21" text-anchor="middle" fill="#f87171" font-family="Inter,sans-serif" font-size="11" font-weight="700">AI DETECTED ANOMALY</text>
  <text x="600" y="36" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="10">4.3 sigma deviation at 16:12</text>
  <rect x="490" y="162" width="130" height="20" fill="#134e4a" rx="4"/>
  <text x="555" y="175" text-anchor="middle" fill="#2dd4bf" font-family="Inter,sans-serif" font-size="10" font-weight="600">Normal range (learned)</text>
</svg>

<h2>What Is a "Normal" Range?</h2>
<p>When an AI anomaly detection system says "this metric looks unusual," it's comparing the current value to a learned model of what that metric normally looks like. This model is built from historical data - typically 2 - 4 weeks of observations - and it accounts for patterns like:</p>
<ul>
  <li><strong>Time of day:</strong> Response times are naturally higher at 2 p.m. than 2 a.m.</li>
  <li><strong>Day of week:</strong> Traffic on Saturday is different from Monday.</li>
  <li><strong>Weekly cycles:</strong> Monday batch jobs create predictable spikes.</li>
  <li><strong>Long-term trends:</strong> A slowly growing metric (like database size) shouldn't be flagged as anomalous just because it's higher than last month.</li>
</ul>
<p>The result is a <strong>dynamic baseline</strong> - a "normal band" that shifts throughout the day and week. Values inside the band are considered normal; values outside trigger investigation.</p>

<h2>Standard Deviations: The Unit of "How Weird Is This?"</h2>
<p>The most common way to measure how unusual a value is: <strong>standard deviations (σ)</strong>. In a normal distribution:</p>
<ul>
  <li>~68% of values fall within 1σ of the mean - completely normal</li>
  <li>~95% fall within 2σ - still probably fine</li>
  <li>~99.7% fall within 3σ - worth looking at</li>
  <li>Beyond 4σ - almost certainly something unusual is happening</li>
</ul>
<p>When Datadog Watchdog says it detected a "significant anomaly," it's typically flagging a 3σ+ deviation from the dynamic baseline. At 4σ (like the chart above), you're seeing something that should statistically occur 0.006% of the time under normal conditions.</p>
<blockquote><strong>Plain English:</strong> If your service normally responds in 150 - 200ms, and it suddenly takes 850ms, the AI calculates that this is statistically impossible under normal conditions - and fires a single, high-confidence alert instead of waiting for you to notice.</blockquote>

<h2>Three Common Algorithms</h2>
<p>You don't need to implement these yourself, but understanding what's running under the hood helps you trust (and tune) the output:</p>
<ol>
  <li><strong>ARIMA / Holt-Winters:</strong> Time-series forecasting models that predict the next value based on historical patterns and compare the actual value to the forecast. Good for smooth, well-behaved metrics like request rate.</li>
  <li><strong>Isolation Forest:</strong> A tree-based algorithm that identifies outliers by how easily they can be "isolated" from the rest of the data. Effective for high-dimensional data (many metrics at once) without assuming a specific distribution.</li>
  <li><strong>LSTM Neural Networks:</strong> Sequence-to-sequence deep learning models that learn complex temporal patterns. More powerful but require more data and compute - used in higher-end platforms for subtle anomaly detection.</li>
</ol>

<h2>Why Context Changes Everything</h2>
<p>The most sophisticated anomaly detection systems understand context - not just "is this metric high?" but "is this metric high given everything else that's happening?" A 5× increase in error rate is alarming. A 5× increase in error rate during a major product launch, while traffic is also 5× higher than normal? Probably expected. Good AI observability platforms factor in correlated signals before firing an alert.</p>

<div class="callout">
  <div class="callout-title">Next: Level 3</div>
  Anomaly detection identifies <em>individual</em> issues. But in a distributed system, one root cause generates hundreds of alerts. <strong>Level 3 covers AIOps alert correlation</strong> - how AI groups those hundreds of alerts into a single, actionable incident.
</div>
    `
  },

  {
    id: 'aiops-alert-correlation-noise-reduction-intermediate',
    bannerImage: '/blog-banners/alert-correlation.jpg',
    title: 'AIOps in Practice: Taming the Alert Storm with ML Correlation',
    subtitle: 'Level 3 of 5 · Your monitoring fires 847 alerts in 90 seconds. How does AI turn that into 3 actionable incidents? This is alert correlation  -  and it\'s the biggest MTTR reducer in modern ops.',
    category: 'AI Observability',
    icon: '⚡',
    bgGradient: 'linear-gradient(135deg, #0c1a3a 0%, #312e81 60%, #4f46e5 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-24',
    readTime: 10,
    tags: ['AIOps', 'alert correlation', 'MTTR', 'machine learning', 'intermediate'],
    featured: false,
    body: `
<div style="display:inline-flex;align-items:center;gap:8px;background:#ede9fe;color:#5b21b6;font-size:.8rem;font-weight:800;padding:6px 14px;border-radius:50px;margin-bottom:20px;letter-spacing:.04em">🟡 LEVEL 3 OF 5 - INTERMEDIATE</div>

<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>A single infrastructure failure in a distributed system typically generates 100 - 1,000+ cascading alerts.</li>
    <li>Alert correlation groups related alerts using temporal proximity, topology awareness, and historical patterns.</li>
    <li>The output of correlation is an "incident" - a curated event with identified root cause candidates and affected services.</li>
    <li>Teams using AIOps correlation report 70 - 95% alert volume reduction with better signal quality.</li>
  </ul>
</div>

<svg viewBox="0 0 780 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:12px;margin:28px 0;display:block">
  <rect width="780" height="320" fill="#0f172a" rx="12"/>
  <text x="390" y="30" text-anchor="middle" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="14" font-weight="700">Alert Correlation: From Noise to Signal</text>
  <circle cx="100" cy="72" r="11" fill="#f59e0b" opacity="0.9"/>
  <circle cx="135" cy="65" r="9" fill="#ef4444" opacity="0.8"/>
  <circle cx="165" cy="78" r="10" fill="#f59e0b" opacity="0.7"/>
  <circle cx="195" cy="62" r="8" fill="#ef4444" opacity="0.9"/>
  <circle cx="220" cy="75" r="11" fill="#f59e0b" opacity="0.8"/>
  <circle cx="248" cy="68" r="9" fill="#ef4444" opacity="0.7"/>
  <circle cx="272" cy="80" r="10" fill="#f59e0b" opacity="0.9"/>
  <circle cx="300" cy="70" r="8" fill="#ef4444" opacity="0.8"/>
  <circle cx="112" cy="95" r="9" fill="#ef4444" opacity="0.7"/>
  <circle cx="148" cy="88" r="11" fill="#f59e0b" opacity="0.9"/>
  <circle cx="180" cy="100" r="8" fill="#ef4444" opacity="0.8"/>
  <circle cx="210" cy="90" r="10" fill="#f59e0b" opacity="0.7"/>
  <circle cx="240" cy="102" r="9" fill="#ef4444" opacity="0.9"/>
  <circle cx="268" cy="92" r="11" fill="#f59e0b" opacity="0.8"/>
  <circle cx="292" cy="85" r="8" fill="#ef4444" opacity="0.7"/>
  <text x="200" y="130" text-anchor="middle" fill="#f59e0b" font-family="Inter,sans-serif" font-size="13" font-weight="700">847 Raw Alerts</text>
  <text x="200" y="148" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="11">firing in 90 seconds</text>
  <line x1="200" y1="160" x2="200" y2="185" stroke="#4f46e5" stroke-width="2"/>
  <polygon points="193,185 207,185 200,196" fill="#4f46e5"/>
  <rect x="110" y="200" width="180" height="52" fill="#1e1b4b" rx="8" stroke="#4f46e5" stroke-width="1.5"/>
  <text x="200" y="222" text-anchor="middle" fill="#a5b4fc" font-family="Inter,sans-serif" font-size="12" font-weight="700">AI Correlation Engine</text>
  <text x="200" y="240" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="10">Topology + Temporal + Historical</text>
  <line x1="200" y1="255" x2="200" y2="275" stroke="#4f46e5" stroke-width="2"/>
  <polygon points="193,275 207,275 200,286" fill="#4f46e5"/>
  <rect x="420" y="55" width="320" height="50" fill="#1e3a8a" rx="8" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="580" y="76" text-anchor="middle" fill="#93c5fd" font-family="Inter,sans-serif" font-size="12" font-weight="700">Incident 1: Database Connection Pool</text>
  <text x="580" y="93" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="10">341 alerts grouped · Root cause: db-node-03</text>
  <rect x="420" y="118" width="320" height="50" fill="#14532d" rx="8" stroke="#22c55e" stroke-width="1.5"/>
  <text x="580" y="139" text-anchor="middle" fill="#86efac" font-family="Inter,sans-serif" font-size="12" font-weight="700">Incident 2: Deployment Canary Error</text>
  <text x="580" y="156" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="10">298 alerts grouped · Root cause: v2.4.1 deploy</text>
  <rect x="420" y="181" width="320" height="50" fill="#431407" rx="8" stroke="#f97316" stroke-width="1.5"/>
  <text x="580" y="202" text-anchor="middle" fill="#fdba74" font-family="Inter,sans-serif" font-size="12" font-weight="700">Incident 3: CDN Latency Spike</text>
  <text x="580" y="219" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="10">208 alerts grouped · Root cause: us-east-1 edge</text>
  <line x1="300" y1="290" x2="420" y2="180" stroke="#4f46e5" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
  <text x="200" y="300" text-anchor="middle" fill="#22c55e" font-family="Inter,sans-serif" font-size="12" font-weight="700">3 Incidents  ·  99.6% noise reduction</text>
</svg>

<h2>The Problem: Cascading Alerts</h2>
<p>A single database node failure in a distributed system doesn't generate one alert. It generates a cascade: every service that queries that database starts seeing high latency, then errors. Every latency alert fires. Every error rate alert fires. Every downstream service that depends on teh upstream erroring services fires too. Within 90 seconds, 847 alerts are queued in your ticketing system - all for one root cause.</p>
<p>This is called an <strong>alert storm</strong>, and it's the leading cause of alert fatigue. On-call engineers who receive 847 alerts can't triage 847 alerts. They scan a few, try something, and hope. Or worse - they silence everything and go back to sleep.</p>

<h2>How Alert Correlation Works</h2>
<p>AIOps correlation engines use three dimensions to group alerts into incidents:</p>

<h3>1. Temporal Correlation</h3>
<p>Alerts that fire within a short time window (typically 5 - 15 minutes) are candidates for grouping. If your database alert fires at 14:12:03 and 500 downstream service alerts fire between 14:12:05 and 14:13:47, the temporal proximity is a strong signal that they're related.</p>

<h3>2. Topological Correlation</h3>
<p>The AI maintains a model of your service dependency graph - wich services call which other services. When alerts propagate along known dependency paths, the correlation engine uses that topology to identify the likely root cause: the upstream service that broke first.</p>

<h3>3. Historical Pattern Matching</h3>
<p>The AI learns from past incidents. If a specific pattern of alerts has occurred 7 times in the past year and was always resolved by restarting the message queue, that historical pattern informs the current grouping - and may surface the resolution suggestion automatically.</p>

<h2>The Output: Incidents, Not Alerts</h2>
<p>A well-configured correlation engine outputs <strong>incidents</strong> - curated events that include:</p>
<ul>
  <li>A probable root cause (with confidence score)</li>
  <li>All affected services and components</li>
  <li>Timeline of how the failure propagated</li>
  <li>Suggested remediation steps based on similar past incidents</li>
  <li>Business impact estimate (users affected, SLO burn rate)</li>
</ul>

<h2>Tools That Do This Today</h2>
<table>
  <thead><tr><th>Platform</th><th>Correlation Feature</th><th>Strength</th></tr></thead>
  <tbody>
    <tr><td>Datadog</td><td>Watchdog + Incident Management</td><td>Automatic anomaly-to-incident linking</td></tr>
    <tr><td>New Relic</td><td>Applied Intelligence - Decisions</td><td>ML-trained correlation policies</td></tr>
    <tr><td>Splunk ITSI</td><td>Episode Review + Correlation Search</td><td>Deep SIEM+APM integration</td></tr>
    <tr><td>AppDynamics</td><td>Cognition Engine</td><td>BT-level root cause narrative</td></tr>
  </tbody>
</table>

<h2>Putting Correlation in Your Runbook</h2>
<p>Alert correlation pays off fastest when it sits on top of a coherent observability stack. Start by ensuring each service exports the <a href="/blog/four-golden-signals">four golden signals</a>, adopt <a href="/blog/distributed-tracing-explained">trace context propagation</a> across HTTP boundaries, and define <a href="/blog/slo-sla-sli-practical-guide">SLOs with error budgets</a> so incidents are prioritised by user impact rather than alert volume. If you are still choosing a platform, compare how each vendor handles noise reduction in our <a href="/blog/datadog-vs-newrelic-vs-splunk-2026">APM comparison guide</a> and the broader <a href="/blog/ultimate-apm-comparison-datadog-newrelic-splunk-appdynamics-broadcom-2026">ultimate APM shootout</a>.</p>
<p>Operationally, train on-call engineers to work from incidents, not individual alerts. The goal is a single timeline with a probable root cause, affected services, and remediation hints - the output modern AIOps tools are designed to produce once topology and history models are fed with clean telemetry.</p>

<div class="callout">
  <div class="callout-title">Next: Level 4</div>
  Correlation reacts to what's already happening. <strong><a href="/blog/predictive-monitoring-ml-capacity-forecasting-advanced">Level 4 goes further: predicting failures before they occur</a></strong> using ML forecasting models for capacity and reliability.
</div>
    `
  },

  {
    id: 'predictive-monitoring-ml-capacity-forecasting-advanced',
    bannerImage: '/blog-banners/forecast.jpg',
    title: 'Predictive Monitoring: Teaching ML to Forecast Failures Before They Happen',
    subtitle: 'Level 4 of 5 · Move from reactive to proactive. Learn how ML forecasting models predict capacity exhaustion, reliability degradation, and SLO breaches  -  hours before users are impacted.',
    category: 'AI Observability',
    icon: '🎯',
    bgGradient: 'linear-gradient(135deg, #431407 0%, #9a3412 60%, #ea580c 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-25',
    readTime: 11,
    tags: ['predictive monitoring', 'ML forecasting', 'capacity planning', 'SLO', 'advanced'],
    featured: false,
    body: `
<div style="display:inline-flex;align-items:center;gap:8px;background:#fff7ed;color:#c2410c;font-size:.8rem;font-weight:800;padding:6px 14px;border-radius:50px;margin-bottom:20px;letter-spacing:.04em">🟠 LEVEL 4 OF 5 - ADVANCED</div>

<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Predictive monitoring uses time-series ML models to forecast where a metric is heading, not just where it's.</li>
    <li>Capacity forecasting can predict disk-full, connection pool exhaustion, and memory leak failures hours or days in advance.</li>
    <li>SLO burn rate prediction lets you act before your error budget is exhausted - not after.</li>
    <li>The key ML techniques: SARIMA for seasonal patterns, Prophet for trend + seasonality, and regression models for correlation-based forecasting.</li>
  </ul>
</div>

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:12px;margin:28px 0;display:block">
  <rect width="780" height="300" fill="#0f172a" rx="12"/>
  <text x="32" y="34" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="13" font-weight="700">Disk Utilisation Forecast (%)</text>
  <text x="748" y="34" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="11">Historical + ML Prediction</text>
  <line x1="70" y1="50" x2="70" y2="240" stroke="#334155" stroke-width="1"/>
  <line x1="70" y1="240" x2="748" y2="240" stroke="#334155" stroke-width="1"/>
  <line x1="70" y1="74" x2="748" y2="74" stroke="#ef4444" stroke-width="1" stroke-dasharray="6,3" opacity="0.7"/>
  <text x="752" y="78" fill="#ef4444" font-family="Inter,sans-serif" font-size="10">90% Threshold</text>
  <text x="62" y="78" text-anchor="end" fill="#ef4444" font-family="Inter,sans-serif" font-size="10">90</text>
  <text x="62" y="116" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">75</text>
  <line x1="68" y1="112" x2="748" y2="112" stroke="#1e293b" stroke-width="1"/>
  <text x="62" y="162" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">50</text>
  <line x1="68" y1="158" x2="748" y2="158" stroke="#1e293b" stroke-width="1"/>
  <text x="62" y="205" text-anchor="end" fill="#64748b" font-family="Inter,sans-serif" font-size="10">25</text>
  <line x1="68" y1="201" x2="748" y2="201" stroke="#1e293b" stroke-width="1"/>
  <text x="80" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">Jan</text>
  <text x="160" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">Feb</text>
  <text x="240" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">Mar</text>
  <text x="320" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">Apr</text>
  <text x="400" y="268" fill="#64748b" font-family="Inter,sans-serif" font-size="10">May</text>
  <text x="472" y="268" fill="#22c55e" font-family="Inter,sans-serif" font-size="10" font-weight="700">NOW</text>
  <text x="540" y="268" fill="#fb923c" font-family="Inter,sans-serif" font-size="10">Jun</text>
  <text x="620" y="268" fill="#fb923c" font-family="Inter,sans-serif" font-size="10">Jul</text>
  <text x="700" y="268" fill="#fb923c" font-family="Inter,sans-serif" font-size="10">Aug</text>
  <line x1="480" y1="50" x2="480" y2="255" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polyline points="80,210 160,202 240,195 320,185 400,175 480,162" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
  <polygon points="480,142 540,130 620,108 700,80 748,64 748,110 700,130 620,150 540,160 480,172" fill="#fb923c" opacity="0.15"/>
  <polyline points="480,162 540,145 620,129 700,105 748,87" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-dasharray="7,4"/>
  <circle cx="700" cy="80" r="8" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
  <line x1="700" y1="68" x2="700" y2="35" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <rect x="570" y="10" width="168" height="28" fill="#1e293b" rx="6" stroke="#ef4444" stroke-width="1"/>
  <text x="654" y="28" text-anchor="middle" fill="#f87171" font-family="Inter,sans-serif" font-size="11" font-weight="700">⚠ Breach predicted: July 18</text>
  <rect x="10" y="176" width="130" height="22" fill="#1e3a8a" rx="5"/>
  <text x="75" y="190" text-anchor="middle" fill="#93c5fd" font-family="Inter,sans-serif" font-size="10" font-weight="600">Historical data</text>
  <rect x="150" y="176" width="150" height="22" fill="#431407" rx="5"/>
  <text x="225" y="190" text-anchor="middle" fill="#fdba74" font-family="Inter,sans-serif" font-size="10" font-weight="600">ML forecast + confidence band</text>
</svg>

<h2>The Shift from Reactive to Predictive</h2>
<p>Levels 1 - 3 of this series covered detecting and correlating problems that are already happening. Predictive monitoring is different: it answers teh question <em>"where is this metric heading?"</em> and raises an alert before the threshold is breached - giving your team time to act while the system is still healthy.</p>
<p>The classic example is disk space. Your disk is at 62% utilisation today. Traditional monitoring won't alert until it hits 90%. But if you look at the growth rate over the past 90 days, you can see it's growing 4 GB per week. Simple extrapolation: disk full in approximately 9 weeks. ML forecasting makes that projection explicit, with confidence intervals, and alerts you weeks in advance.</p>

<h2>Key Forecasting Techniques</h2>

<h3>SARIMA (Seasonal ARIMA)</h3>
<p>SARIMA extends the classic ARIMA time-series model with a Seasonal component. It models three things simultaneously: the trend (long-term direction), the autocorrelation (today's value is related to yesterday's), and the seasonality (weekly/daily cycles). It's the go-to for metrics with strong, regular seasonal patterns - like request volume that spikes every Monday and drops on weekends.</p>

<h3>Facebook Prophet</h3>
<p>Prophet, open-sourced by Meta, was designed specifically for business time-series forecasting. It handles missing data gracefully, allows you to specify known events (like deployment windows or marketing campaigns) as regressors, and produces confidence intervals out of the box. Many observability platforms use Prophet under the hood for their capacity forecasting features.</p>

<h3>Regression-Based Correlation Forecasting</h3>
<p>Sometimes you don't need to model a metric in isolation - you can predict it from correlated leading indicators. Database query volume predicts connection pool usage. Traffic volume predicts memory pressure. Linear or gradient-boosted regression models learn these correlations and produce forecasts that are often more accurate than time-series-only models.</p>

<h2>SLO Burn Rate Prediction</h2>
<p>One of the most powerful predictive applications is <strong>SLO burn rate forecasting</strong>. Your error budget burns at some rate right now. At the current burn rate, when will your 30-day error budget hit zero?</p>
<p>Google's original SRE practices defined burn rate alerts (e.g., "alert if burning 14× the sustainable rate"), but these are still reactive - they fire when you're already burning fast. Predictive burn rate models go further: they extrapolate the current burn rate trend and alert you at the inflection point, before the rate becomes critical.</p>

<div class="callout">
  <div class="callout-title">Implementing Predictive Monitoring</div>
  Start with disk and memory - both have well-behaved, mostly monotonic growth curves that even simple linear regression predicts accurately. Then add connection pool and thread pool forecasting. These four metrics alone prevent the majority of "we didn't see it coming" incidents.
</div>

<h2>Platforms with Predictive Capabilities</h2>
<ul>
  <li><strong>Datadog Forecast Monitor</strong> - built-in <code>forecast()</code> function in the metrics query language; set alerts on predicted values</li>
  <li><strong>Splunk MLTK</strong> - <code>predict</code> SPL command using ARIMA; full control over the model parameters</li>
  <li><strong>New Relic Baseline Alerting</strong> - dynamic thresholds that adapt to trends; not full forecasting but close</li>
  <li><strong>AppDynamics Dynamic Baselines</strong> - predictive health rules based on learned performance patterns</li>
</ul>

<div class="callout">
  <div class="callout-title">Next: Level 5 - Expert</div>
  The final level is where the newest work is happening: <strong>eBPF-powered telemetry combined with Large Language Models</strong> for fully automated root cause narration and remediation suggestion. This is where observability is heading in 2026.
</div>
    `
  },

  {
    id: 'ebpf-llms-next-frontier-intelligent-observability-expert',
    bannerImage: '/blog-banners/ebpf.jpg',
    title: 'eBPF + LLMs: The Next Frontier of Intelligent Observability',
    subtitle: 'Level 5 of 5 · Expert. How kernel-level telemetry and large language models are converging to create self-explaining, self-healing observability systems  -  and what you can build today.',
    category: 'AI Observability',
    icon: '🧬',
    bgGradient: 'linear-gradient(135deg, #1a0533 0%, #4c1d95 60%, #7c3aed 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-06-25',
    readTime: 14,
    tags: ['eBPF', 'LLM', 'AI', 'expert', 'observability', 'future'],
    featured: false,
    body: `
<div style="display:inline-flex;align-items:center;gap:8px;background:#f3e8ff;color:#6b21a8;font-size:.8rem;font-weight:800;padding:6px 14px;border-radius:50px;margin-bottom:20px;letter-spacing:.04em">🟣 LEVEL 5 OF 5 - EXPERT</div>

<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>eBPF (extended Berkeley Packet Filter) allows safe kernel-level code execution - capturing telemetry with zero instrumentation overhead.</li>
    <li>LLMs applied to observability data can generate plain-English root cause narratives, runbook suggestions, and code-level hypotheses.</li>
    <li>The combination of eBPF (breadth of context) + LLMs (reasoning over that context) is enabling a new generation of "explain what's wrong" AI.</li>
    <li>This is early but real: Datadog's Bits AI, New Relic's AI assistant, and open-source tools like Coroot already demo this capability.</li>
  </ul>
</div>

<svg viewBox="0 0 780 330" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:12px;margin:28px 0;display:block">
  <rect width="780" height="330" fill="#0f172a" rx="12"/>
  <text x="390" y="28" text-anchor="middle" fill="#f1f5f9" font-family="Inter,sans-serif" font-size="14" font-weight="700">eBPF + LLM Observability Architecture</text>
  <rect x="20" y="44" width="740" height="72" fill="#1e293b" rx="8" stroke="#334155" stroke-width="1"/>
  <text x="390" y="65" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2">KERNEL LAYER - eBPF PROBES</text>
  <rect x="36" y="72" width="130" height="34" fill="#0f172a" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="101" y="89" text-anchor="middle" fill="#60a5fa" font-family="Inter,sans-serif" font-size="11" font-weight="700">🔌 Network</text>
  <text x="101" y="102" text-anchor="middle" fill="#475569" font-family="Inter,sans-serif" font-size="9">TCP/IP packets</text>
  <rect x="186" y="72" width="130" height="34" fill="#0f172a" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="251" y="89" text-anchor="middle" fill="#60a5fa" font-family="Inter,sans-serif" font-size="11" font-weight="700">⚡ CPU / Sched</text>
  <text x="251" y="102" text-anchor="middle" fill="#475569" font-family="Inter,sans-serif" font-size="9">context switches</text>
  <rect x="336" y="72" width="130" height="34" fill="#0f172a" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="401" y="89" text-anchor="middle" fill="#60a5fa" font-family="Inter,sans-serif" font-size="11" font-weight="700">💾 File I/O</text>
  <text x="401" y="102" text-anchor="middle" fill="#475569" font-family="Inter,sans-serif" font-size="9">syscall latency</text>
  <rect x="486" y="72" width="130" height="34" fill="#0f172a" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="551" y="89" text-anchor="middle" fill="#60a5fa" font-family="Inter,sans-serif" font-size="11" font-weight="700">📦 Containers</text>
  <text x="551" y="102" text-anchor="middle" fill="#475569" font-family="Inter,sans-serif" font-size="9">pod/cgroup tracing</text>
  <rect x="636" y="72" width="108" height="34" fill="#0f172a" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="690" y="89" text-anchor="middle" fill="#60a5fa" font-family="Inter,sans-serif" font-size="11" font-weight="700">🔐 Security</text>
  <text x="690" y="102" text-anchor="middle" fill="#475569" font-family="Inter,sans-serif" font-size="9">syscall auditing</text>
  <line x1="390" y1="120" x2="390" y2="140" stroke="#4f46e5" stroke-width="2"/>
  <polygon points="383,140 397,140 390,150" fill="#4f46e5"/>
  <rect x="20" y="154" width="740" height="64" fill="#1e1b4b" rx="8" stroke="#4f46e5" stroke-width="1"/>
  <text x="390" y="172" text-anchor="middle" fill="#a5b4fc" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2">TELEMETRY PIPELINE - OpenTelemetry Collector</text>
  <text x="190" y="198" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="11">Metrics</text>
  <text x="390" y="198" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="11">Traces</text>
  <text x="590" y="198" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-size="11">Logs</text>
  <line x1="190" y1="200" x2="390" y2="200" stroke="#334155" stroke-width="1"/>
  <line x1="390" y1="200" x2="590" y2="200" stroke="#334155" stroke-width="1"/>
  <line x1="390" y1="220" x2="390" y2="242" stroke="#7c3aed" stroke-width="2"/>
  <polygon points="383,242 397,242 390,252" fill="#7c3aed"/>
  <rect x="20" y="256" width="740" height="60" fill="#2e1065" rx="8" stroke="#7c3aed" stroke-width="1"/>
  <text x="390" y="274" text-anchor="middle" fill="#c4b5fd" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="2">AI / LLM REASONING LAYER</text>
  <text x="195" y="298" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="11">Root Cause Narration</text>
  <text x="390" y="298" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="11">Runbook Suggestion</text>
  <text x="585" y="298" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="11">Code Hypothesis</text>
</svg>

<h2>eBPF: Observability Without Instrumentation</h2>
<p>Extended Berkeley Packet Filter (eBPF) is teh most important infrastructure technology of the last decade that most developers have never heard of. It allows you to run sandboxed programs inside the Linux kernel - safely and at near-zero overhead - giving you visibility into everything the kernel does: network packets, system calls, CPU scheduling, file I/O, and more.</p>
<p>The implications for observability are profound. With eBPF, you can capture distributed traces of every HTTP request flowing through your system <em>without adding a single line of instrumentation code to your applications</em>. The kernel sees everything, and eBPF lets you tap into that visibility safely.</p>
<p>This is already production-ready technology. Pixie (New Relic), Cilium (Kubernetes networking), Falco (security), Parca (continuous profiling), and Coroot all use eBPF. Datadog's USM (Universal Service Monitoring) also runs on eBPF.</p>

<h2>What eBPF Captures That Agents Miss</h2>
<p>Traditional APM agents instrument at the application layer - they intercept function calls in your code. eBPF instruments at the kernel layer, capturing:</p>
<ul>
  <li><strong>Full request/response payloads</strong> - not just latency, but actual data flowing across the network</li>
  <li><strong>Lock contention</strong> - wich threads are waiting on which mutexes, and for how long</li>
  <li><strong>CPU scheduling latency</strong> - how long the kernel takes to schedule a thread onto a CPU once it's ready</li>
  <li><strong>Memory allocation patterns</strong> - allocation hotspots and garbage collection pressure at the process level</li>
  <li><strong>Cross-language correlation</strong> - a Python service calling a Go service calling a C++ library, with end-to-end traces and no per-language agent needed</li>
</ul>

<h2>LLMs: Turning Data Into Explanation</h2>
<p>The second half of this frontier is applying Large Language Models to observability data. The challenge LLMs solve is one that no traditional alerting system can: <em>explaining what happened in plain English</em>.</p>
<p>Current state-of-the-art LLM observability assistants can:</p>
<ul>
  <li><strong>Narrate root cause analysis:</strong> "At 14:12 UTC, database connection pool on db-node-03 became saturated because the new checkout service version (v2.4.1) opens 3 connections per request instead of 1. This caused 341 downstream services to queue requests, explaining the latency spike you observed."</li>
  <li><strong>Suggest runbook steps:</strong> Based on the detected incident type, surface the relevant runbook automatically from your internal documentation.</li>
  <li><strong>Generate code hypotheses:</strong> Given a slow trace, identify the specific method call and suggest potential causes - N+1 query patterns, missing indexes, synchronous I/O in async contexts.</li>
  <li><strong>Answer natural language queries:</strong> "Why is checkout slow?" → retrieves relevant traces, metrics, and logs, synthesises the answer.</li>
</ul>

<h2>Production Examples Today</h2>
<table>
  <thead><tr><th>Tool</th><th>eBPF</th><th>LLM Feature</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>Datadog Bits AI</td><td>USM (eBPF)</td><td>Natural language query + RCA narration</td><td>GA 2025</td></tr>
    <tr><td>New Relic AI</td><td>Pixie (eBPF)</td><td>Conversational incident investigation</td><td>GA 2024</td></tr>
    <tr><td>Coroot</td><td>eBPF-native</td><td>Automated RCA with code-level hints</td><td>Open source</td></tr>
    <tr><td>Groundcover</td><td>eBPF-native</td><td>AI-powered query interface</td><td>GA 2025</td></tr>
  </tbody>
</table>

<h2>The Road to Self-Healing Systems</h2>
<p>The convergence of eBPF (unlimited, zero-overhead observability context) + LLMs (human-level reasoning over that context) + remediation automation is pointing toward self-healing infrastructure - systems that detect anomalies, diagnose root causes, and execute remediations without human intervention.</p>
<p>Today, the most advanced teams are implementing human-in-the-loop versions: the AI diagnoses and proposes a fix, a human approves it in one click, and automation executes. The "fully autonomous" version - where the AI both diagnoses and remediates without approval - exists in narrow, well-understood contexts (auto-scaling, circuit breaker triggering) but isn't yet appropriate for production application-layer remediations.</p>

<div class="callout">
  <div class="callout-title">Congratulations - You've Completed the Path!</div>
  You've gone from the basics of AI in observability (Level 1) to the frontier of eBPF + LLMs (Level 5). The practical next step: pick one tool from the table above and run a proof-of-concept on your most critical service. Start with Coroot - it's free, eBPF-native, and deploys in one Helm command. See what the AI shows you that your existing monitoring missed.
</div>
    `
  },
  {
    id: 'langfuse-vs-arize-phoenix-vs-langsmith-vs-agentops-llm-observability-2026',
    bannerImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'Langfuse vs Arize Phoenix vs LangSmith vs AgentOps: The LLM Observability Comparison Engineers Actually Need (2026)',
    subtitle: "Four tools keep showing up when a team goes looking for eyes on their LLM app. They are not the same product, and the marketing pages wont tell you where each one falls down. Here is a practitioner read on what Langfuse, Arize Phoenix, LangSmith and AgentOps really do, and which one to reach for.",
    category: 'AI Observability',
    icon: '🔭',
    bgGradient: 'linear-gradient(135deg, #06121a 0%, #0e3b52 55%, #22c3d6 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-13',
    readTime: 11,
    tags: ['LLM observability', 'Langfuse', 'Arize Phoenix', 'LangSmith', 'AgentOps', 'AI Observability', 'evals', 'tracing'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>All four tools trace LLM calls, run evals, and help you debug a bad output. The real split is <strong>open-source and self-hostable</strong> (Langfuse, Phoenix) versus <strong>SaaS-first</strong> (LangSmith, AgentOps), and how much they lean on one framework.</li>
    <li>Langfuse is the safe default if you want to own your data, run it on your own boxes, and not get married to a single framework. It does tracing, prompt management and evals without much fuss.</li>
    <li>Arize Phoenix is the pick when evaluation and OpenTelemetry are the priority. It is Apache-licensed, runs in a notebook or a container, and its eval library is the strongest of the group.</li>
    <li>LangSmith earns its keep if your whole stack is already LangChain or LangGraph. AgentOps is built for one job, watching multi-step agents run, and it is good at that one job.</li>
    <li>Do not pick on the feature matrix alone. Point all four at the same messy trace from your own app for a week, then keep the one that made a real bug obvious fastest.</li>
  </ul>
</div>

<h2>Why this category exploded</h2>
<p>A year ago most teams shipping an LLM feature had almost no idea what it was doing in production. They could see the API bill and they could see angry users, and not much in between. A normal APM tool shows you a slow endpoint, but it says nothing about why the model returned garbage, which prompt version was live, or how much a single conversation cost in tokens. That gap is the whole reason this category exists. If you want the longer version of that argument, I wrote about it in <a href="/blog/ai-agents-observability-blind-spot">Why Every New AI Agent Is an Observability Blind Spot</a>.</p>
<p>So a handful of tools showed up to fill the hole, and four of them keep landing on the shortlist: Langfuse, Arize Phoenix, LangSmith and AgentOps. They get talked about like competitors, and they overlap, but they were built by different people to solve slightly different problems. Treating them as interchangeable is how teams end up ripping one out three months later. Lets go through what each actually is.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1280&q=80" alt="Eyeglasses in front of a monitor full of code, the code sharp through the lenses" loading="lazy" /><figcaption>LLM observability is not about the slow endpoint. It is about seeing the prompt, the model version, the tokens and the actual output, the stuff a normal APM tool never looks at.</figcaption></figure>

<h2>What all four have in common</h2>
<p>Before the differences, the shared floor. Every one of these gives you tracing, meaning a full record of a request as it moves through your app: the prompt that went in, the model that answered, the tokens burned, the latency, and for an agent, each tool call along the way. Every one of them lets you attach evaluations, so you can score outputs for quality instead of eyeballing them. And every one keeps a history so you can compare last weeks behaviour to today.</p>
<p>That common floor is why they get confused for each other. The differences are not in the checklist of features. They are in what the tool assumes about how you work, where your data lives, and which framework you already bet on. Thats where the choice actually gets made.</p>

<h2>Langfuse: own your data, stay framework-neutral</h2>
<p>Langfuse is the open-source one most people reach for first, and for good reason. The core is on GitHub, you can self-host the whole thing with Docker, and your traces sit in your own Postgres and object storage instead of somebody elses cloud. For a team in a regulated shop, or anyone who just does not want prompts and user data leaving thier network, that alone shortens the list to two names.</p>
<p>It is also framework-neutral in a way that matters. Langfuse does not care if you use the OpenAI SDK raw, LangChain, LlamaIndex, or your own hand-rolled loop. You drop in a decorator or an SDK call and traces show up. On top of tracing it does prompt management, so prompts live in Langfuse with versions instead of hard-coded in your app, and it does datasets and evals for testing changes before they ship. There is a hosted cloud tier too if you do not want to run it, priced on usage.</p>
<p>Where it is less strong: the evaluation library is solid but not as deep as Phoenix, and the self-hosted setup, while not hard, is one more service your team now operates. If nobody wants to own another database, the cloud tier fixes that, but then your back to sending data out.</p>

<h2>Arize Phoenix: evaluation and OpenTelemetry first</h2>
<p>Phoenix comes out of Arize AI, and it shows. This is the tool built by people who think about model evaluation as the main event, not a side feature. It is Apache 2.0 licensed, it runs happily inside a Jupyter notebook for local work or as a container for a shared deployment, and its eval library, the LLM-as-a-judge templates and the retrieval-quality checks, is the most thorough of the four. If your problem is a RAG pipeline returning weak answers, Phoenix is very good at showing you whether retrieval or generation is the weak link.</p>
<p>The other thing Phoenix gets right is standards. It is built on OpenTelemetry through a spec called OpenInference, so the traces it produces are not a proprietary blob, they are OTel spans you can also send elsewhere. That fits the direction the whole field is going, which I got into in <a href="/blog/opentelemetry-table-stakes-what-comes-after">OpenTelemetry Is Now Table Stakes. Here Is What Comes After</a>. If you already run an OTel pipeline, Phoenix slots in without inventing a second one.</p>
<p>The trade is that Phoenix on its own is the open-source, self-managed piece. The bigger production features, long retention, team access controls, alerting at scale, live in Arize's paid platform. Phoenix is genuinely useful free, but a large org usually ends up looking at the commercial tier, so price it in early.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1280&q=80" alt="A hand-drawn line chart on graph paper trending upward, with a ruler and pens" loading="lazy" /><figcaption>Evals are the part most teams skip and later regret. Phoenix treats scoring output quality as the main job, not a checkbox, which is the difference between guessing your model got better and knowing it.</figcaption></figure>

<h2>LangSmith: the payoff for going all-in on LangChain</h2>
<p>LangSmith is from the LangChain team, and that is both the pitch and the catch. If you already build on LangChain or LangGraph, LangSmith is the tightest fit you will find. Traces of a complex LangGraph agent render as a clean step-by-step tree, the prompt hub ties into your chains, and the eval and dataset tooling is well thought out. There is basically zero glue code, it just works because it was built by the same people.</p>
<p>It is not locked to LangChain, to be fair. There is an SDK and OpenTelemetry support, so you can trace a non-LangChain app too. But the reason to choose LangSmith over the others is the LangChain integration, and if you are not using LangChain, a lot of that advantage evaporates and you are left comparing it to tools that are open-source or cheaper.</p>
<p>The bigger thing to weigh is that LangSmith is SaaS-first and closed-source. Self-hosting exists but only on the enterprise plan, so for most teams your data lives in LangChain's cloud. Pricing runs on a mix of seats and trace volume, which is fine at small scale and something to model carefully before a high-traffic app sends your trace count through the roof.</p>

<h2>AgentOps: a specialist for watching agents run</h2>
<p>AgentOps did not try to be a general LLM observability platform, and that focus is the point. It is built for one thing, watching autonomous, multi-step agents do their work, and it is good at it. Session replays show you an agent's whole run as a waterfall: which tool it called, what came back, where it looped, where it burned tokens spinning on a dead end. If you have ever watched a CrewAI or AutoGen agent do something baffling and had no idea why, this is the view you wanted.</p>
<p>It integrates with the popular agent frameworks out of the box, tracks cost and latency per session, and flags failures without much setup. The reason a team picks AgentOps over the broader tools is that agent-specific lens. When your product is an agent, seeing the run as a sequence of steps beats seeing it as a flat list of LLM calls.</p>
<p>The flip side is scope. AgentOps is SaaS, and it is narrower than the other three. If you also need heavy prompt management, deep eval pipelines, or full self-hosting, you will likely run AgentOps next to something else rather than instead of it. For the pure agent-debugging job though, few things beat it. The wider problem of agents breaking normal monitoring is something I covered in <a href="/blog/monitoring-stack-cant-see-ai-agents-otel-genai-conventions">Your Monitoring Stack Cannot See Your AI Agents</a>.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1280&q=80" alt="Two laptops on a desk with a person's hands typing on one of them" loading="lazy" /><figcaption>The matrix will not settle this. Point two or three of these at the same real trace for a week and keep the one that surfaced a genuine bug fastest.</figcaption></figure>

<h2>The comparison, side by side</h2>
<table class="ctable">
  <thead><tr><th>Tool</th><th>Best at</th><th>Open source</th><th>Self-host</th><th>Framework fit</th><th>Watch out for</th></tr></thead>
  <tbody>
    <tr><th>Langfuse</th><td>Owning your data, general tracing + prompt mgmt</td><td>Yes (core)</td><td>Yes, full</td><td>Neutral, works with anything</td><td>Evals less deep than Phoenix; one more service to run</td></tr>
    <tr><th>Arize Phoenix</th><td>Evaluation and OTel-native tracing</td><td>Yes (Apache 2.0)</td><td>Yes</td><td>Neutral, OpenInference</td><td>Big production features sit in the paid Arize tier</td></tr>
    <tr><th>LangSmith</th><td>LangChain / LangGraph apps</td><td>No</td><td>Enterprise plan only</td><td>Best with LangChain</td><td>Closed SaaS; trace-volume pricing at scale</td></tr>
    <tr><th>AgentOps</th><td>Debugging multi-step agents</td><td>Partial</td><td>No (SaaS)</td><td>CrewAI, AutoGen, agent frameworks</td><td>Narrow scope; often runs alongside another tool</td></tr>
  </tbody>
</table>

<h2>So which one</h2>
<p>Skip the "it depends" and here is how I would actually decide. If data ownership or self-hosting is non-negotiable, your really choosing between Langfuse and Phoenix. Between those two, pick Langfuse when you want a well-rounded platform with prompt management built in, and pick Phoenix when evaluation quality and OpenTelemetry are what keep you up at night.</p>
<p>If you have already committed to LangChain or LangGraph and you are fine with SaaS, LangSmith will save you the most glue code and it is the natural fit. And if your product is fundamentally an agent and the thing you keep needing to debug is a weird multi-step run, add AgentOps for that view, on it's own or next to one of the others. Most mature teams I see do not run just one of these. They run a broad tool for tracing and evals and a specialist for the agent piece, and that combination is fine.</p>
<p>Whatever the matrix says, the honest test is your own data. These tools all demo beautifully on a clean example. Instrument one real, messy flow from your app, send it to two or three of them for a week, and watch which one made an actual bug jump out first. That is the tool that earns the license, everything else is a spec sheet.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>There is no single winner here, and anyone selling you one has not used all four. <strong>Langfuse</strong> is the default for teams that want to own their data and stay framework-neutral. <strong>Arize Phoenix</strong> wins on evaluation and OpenTelemetry. <strong>LangSmith</strong> pays off if you live in LangChain. <strong>AgentOps</strong> is the specialist when your problem is an agent misbehaving mid-run. Shortlist by data-ownership needs and framework first, then let a week of your own real traces settle it.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://langfuse.com/docs" target="_blank" rel="noopener">Langfuse documentation</a></li>
  <li><a href="https://docs.arize.com/phoenix" target="_blank" rel="noopener">Arize Phoenix documentation</a></li>
  <li><a href="https://docs.smith.langchain.com/" target="_blank" rel="noopener">LangSmith documentation</a></li>
  <li><a href="https://docs.agentops.ai/" target="_blank" rel="noopener">AgentOps documentation</a></li>
</ul>
    `
  },
  {
    id: 'multi-model-ai-cost-attribution-hard-problem-2026',
    bannerImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=675&q=80',
    title: 'One App, Four Models, No Idea What Anything Costs: Multi-Model Cost Attribution Is the Ugly Problem of 2026',
    subtitle: "GPT-5.6 and Grok 4.5 landed in the same news cycle, and every team I know is now routing one product across three or four models. The invoices arrive per provider. The questions arrive per feature. Nothing in your stack connects the two, and that gap has quietly become a real engineering problem.",
    category: 'AI Observability',
    icon: '🧾',
    bgGradient: 'linear-gradient(135deg, #06140a 0%, #0e5233 55%, #22d68f 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-14',
    readTime: 10,
    tags: ['cost attribution', 'FinOps', 'LLM observability', 'GPT-5.6', 'Grok 4.5', 'multi-model', 'token costs', 'AI Observability'],
    featured: false,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>Most serious AI products now call two, three, four models from different providers. The bill arrives <strong>per provider</strong>, but every question your PM or CFO asks arrives <strong>per feature</strong>. The gap between those two views is the whole problem.</li>
    <li>Token counts are not dollars. Cached input, batch tiers, thinking tokens, retries and a 30x price spread between frontier and flash models mean the same user request costs wildly different money depending on the path it took.</li>
    <li>Attribution is a metadata propagation problem, and engineering already solved that shape once. It is distributed tracing wearing a finance hat. Tag every model call with feature, team and customer, record the served model and token counts, and join against a versioned price table.</li>
    <li>Start with showback, not chargeback. Show each team their number for a quarter before anyone starts sending internal invoices, or the project dies in a political knife fight.</li>
  </ul>
</div>

<h2>The week the bill stopped making sense</h2>
<p>This week alone we got GPT-5.6 and Grok 4.5, and if your company is like most of the ones I talk to, someone has already opened a pull request titled something like "add grok to the router". That is how it goes now. One product, one user-facing feature set, and underneath it a growing pile of models: a frontier model for the hard reasoning, a flash-tier model for the high volume cheap stuff, a coding specialist, and whatever launched this week because somebody wanted to try it.</p>
<p>Then the month ends and finance opens four invoices from four providers, each one a single line that says API usage, and asks a completely reasonable question. What does the summarize button actually cost us? And the room goes quiet, because nobody knows. Not roughly, not directionally. Nobody knows.</p>
<p>A year ago this was an annoyance. With one provider you could squint at the invoice and sort of guess. With four providers, model routing, fallback chains and agents that fan one click out into dozens of calls, guessing is dead. The multi-model world everyone cheered for has a bookkeeping problem, and it is landing on engineering, not finance, because finance does not have the data. Nobody does, unless you build for it.</p>

<h2>Per-provider invoices, per-feature questions</h2>
<p>Here is the mismatch in its simplest form. A provider invoice aggregates by API key, maybe by project if you were disciplined about key hygiene, which most teams are not. Every question anyone actually asks cuts a different way. Which feature is driving spend? Which customer? Did the new prompt version make the RAG pipeline cheaper or did it just feel cheaper? Is the free tier eating our margin?</p>
<p>None of those questions can be answered from the provider side, ever, because the provider does not know your features exist. OpenAI knows you sent tokens. It does not know the tokens belonged to the onboarding flow for your biggest enterprise customer. That mapping lives only in your application, at the moment the call is made, and if you dont capture it right there it is gone. You cannot reconstruct it from the invoice later, believe me, people try every quarter and it always turns into a spreadsheet of lies.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1280&q=80" alt="A fountain pen resting on printed financial statements" loading="lazy" /><figcaption>The provider invoice is one line that says API usage. Every question worth asking, per feature, per customer, per prompt version, has to be answered from data the invoice does not contain.</figcaption></figure>

<h2>Why tokens are not dollars</h2>
<p>The naive fix is to log token counts and multiply by a price. That gets you maybe 60 percent of the way, and the missing 40 percent is where all the surprises live. Cached input is billed at a different rate than fresh input, and a chat app with long system prompts might have most of it's input tokens cached. Batch tiers cost half of interactive. Reasoning models burn thinking tokens that get billed as output you never even see in the response. And the price spread across your router is enormous, a frontier call can cost 30x what a flash-tier call costs for the same token count. I did the budget math on one of those price moves in <a href="/blog/claude-sonnet-5-2-dollar-pricing-enterprise-budget-math">the Sonnet 5 pricing piece</a>, and the spread has only gotten wider since.</p>
<p>Then the routing itself starts lying to you. If a request goes through a fallback chain, the model you asked for and the model that answered are not the same thing, and unless you record the served model per call, your cost model is fiction. Retries double the cost of a request without anyone noticing. Speed changes behaviour too, when a model answers at 750 tokens a second like <a href="/blog/openai-gpt-56-sol-cerebras-750-tokens-second">GPT-5.6 on Cerebras hardware</a>, teams stop being careful with it, and volume quietly triples.</p>
<p>Agents are the worst case of all of this. One user click becomes an agent run, the run becomes forty model calls across three providers, some cached, some retried, one escalated to the expensive model because a tool call failed. What did the click cost? If you are not attributing every call back to the root request, that number simply does not exist anywhere in your company.</p>

<h2>We already solved this shape of problem once</h2>
<p>The good news is that engineering has seen this exact shape before. A request fans out across services, and you want to know what happened to it end to end, so you propagate a context along with the request and every hop records what it did. That is distributed tracing. Cost attribution is the same trick wearing a finance hat. You propagate feature, team, customer and prompt version alongside every model call, the same way you already propagate a trace ID, and each call records the served model, the token counts by type, and the price that was in effect at that moment.</p>
<p>That last part trips people up. Prices change, this year they have changed constantly, so you need a price table that is versioned in your own code, not a rate you look up at query time. A call made in March needs to be costed at March prices or your historical numbers drift into nonsense. It is boring work, it is maybe two hundred lines, and it is the difference between a cost dashboard people trust and one they laugh at.</p>
<p>The standards are catching up too. The OpenTelemetry GenAI semantic conventions already define attributes for model name and token usage per call, so the same spans that power your latency dashboards can power the cost view, one layer of enrichment later. I argued in <a href="/blog/opentelemetry-table-stakes-what-comes-after">the OTel table stakes piece</a> that cost attribution is the least glamorous layer of the new observability stack and the fastest one to pay for itself. Multi-model routing did not changed that. It just raised the stakes.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1280&q=80" alt="Two people working through a plan on a whiteboard" loading="lazy" /><figcaption>The tagging taxonomy is the real design work. Feature, team, customer, prompt version. Get those four propagating on every model call and the dashboard is the easy part.</figcaption></figure>

<h2>What breaks attribution, and the fix for each</h2>
<table class="ctable">
  <thead><tr><th>What breaks it</th><th>How it lies to you</th><th>The fix</th></tr></thead>
  <tbody>
    <tr><th>Model routing and fallbacks</th><td>The model you requested is not the model that answered</td><td>Record the served model on every call, never the requested one</td></tr>
    <tr><th>Cached input</th><td>Raw token counts overstate cost, sometimes badly</td><td>Track cached and uncached input as separate counters</td></tr>
    <tr><th>Thinking tokens</th><td>Output you never see still gets billed</td><td>Use the providers usage object, not the length of the response</td></tr>
    <tr><th>Retries</th><td>One logical request, two or three billed calls</td><td>Attribute every attempt to the root request ID</td></tr>
    <tr><th>Agent fan-out</th><td>One click becomes forty calls across providers</td><td>Propagate the root context through the whole run</td></tr>
    <tr><th>Price changes</th><td>Historical spend recalculated at todays rates drifts into fiction</td><td>Versioned price table, cost each call at time of call</td></tr>
  </tbody>
</table>

<h2>What to actually do this quarter</h2>
<p>You do not need a platform team and a six month roadmap for this. First, make sure every model call records the served model and the full usage object the provider returns. That is the raw material and most teams already have half of it sitting in thier LLM observability tool, the four I compared in <a href="/blog/langfuse-vs-arize-phoenix-vs-langsmith-vs-agentops-llm-observability-2026">the Langfuse, Phoenix, LangSmith and AgentOps piece</a> all capture per-call token usage out of the box.</p>
<p>Second, pick your tags and propagate them. Feature, team, customer, prompt version. Four tags, passed as metadata on every call, the same way trace context already flows. Third, build the versioned price table and cost every call at write time. Fourth, put a dashboard in front of each team showing thier own number, per feature, per week. Thats it. No chargeback, no internal invoicing, just the number where people can see it.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1280&q=80" alt="A glass jar tipped over with coins spilling out" loading="lazy" /><figcaption>Showback first. The first month a team sees its own per-feature number, one of them finds a call pattern nobody meant to ship. Every time.</figcaption></figure>

<h2>Showback before chargeback</h2>
<p>One warning from watching cloud FinOps play this exact game a decade ago. The moment cost data becomes internal billing, it becomes political, and people spend thier energy arguing about the allocation method instead of fixing the spend. So dont start there. Run showback for a quarter, just visibility, no consequences. What happens every single time is that some team sees thier number, goes looking, and finds an agent retry loop or a debug feature flag that has been burning the expensive model on requests where the flash tier would do fine.</p>
<p>The first found-money moment buys you the credibility for everything after. Chargeback, budgets, alerts on cost anomalies per feature, all of that can come later once the data is trusted. But it starts with a per-call record that knows which model actually answered and which feature asked. If GPT-5.6 and Grok 4.5 week is what finally pushes your team to build that, lets be honest, it wont be the worst thing this news cycle produced.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>Multi-model routing broke the last thread connecting your AI bill to your product. Provider invoices answer by API key, real questions cut by feature and customer, and only your application can make that join, at call time, never after. Treat it like tracing: propagate feature, team, customer and prompt version on every call, record the served model and the true usage object, cost it against a versioned price table. Start with showback. The first team that sees its own number will find the money that pays for the whole effort.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/" target="_blank" rel="noopener">OpenTelemetry GenAI semantic conventions</a></li>
  <li><a href="https://platform.openai.com/docs/pricing" target="_blank" rel="noopener">OpenAI API pricing</a></li>
  <li><a href="https://docs.claude.com/en/docs/about-claude/pricing" target="_blank" rel="noopener">Anthropic API pricing</a></li>
  <li><a href="https://www.finops.org/framework/" target="_blank" rel="noopener">FinOps Foundation framework</a></li>
</ul>
    `
  },
  {
    id: 'o11y-bench-grafana-ai-agent-observability-benchmark',
    bannerImage: '/blog-banners/comparison-podium.jpg',
    title: 'o11y-bench: Grafana Just Built the Exam Your AI SRE Agent Will Fail',
    subtitle: "Grafana open sourced a benchmark that puts AI agents in front of a real Prometheus, Loki and Tempo stack and grades them on 63 observability tasks. The top model scores 79.4 percent. On dashboard work it drops to 57. Here is what the numbers actually tell you before you hand an agent your on-call rotation.",
    category: 'AI Observability',
    icon: '🎓',
    bgGradient: 'linear-gradient(135deg, #0d0618 0%, #4a1d6e 55%, #b56ff5 100%)',
    author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',
    date: '2026-07-20',
    readTime: 10,
    tags: ['o11y-bench', 'AI agents', 'Grafana', 'benchmark', 'AI SRE', 'observability', 'MCP', 'AIOps'],
    featured: true,
    body: `
<div class="key-takeaways">
  <h3>What to remember</h3>
  <ul>
    <li>o11y-bench is the first open benchmark that grades AI agents on <strong>real observability work</strong>. Grafana Labs released it at GrafanaCON on 21 April 2026. It spins up an actual Grafana stack in Docker with Prometheus, Loki and Tempo, hands the agent the Grafana MCP server, and scores 63 tasks.</li>
    <li>The headline metric is <strong>Pass^3</strong>, the average score across three runs, not best-of-three. That choice matters more than any single number on the board, because it grades consistency instead of luck.</li>
    <li>Best result so far is Claude Opus 4.7 with thinking <em>off</em> at 79.4 percent Pass^3. Turning reasoning to high made it worse on consistency, 73.0 percent, while raising best-of-three to 90.5. More thinking bought range, not reliability.</li>
    <li>Dashboard tasks are where everything falls apart. The top model manages 57 percent there against 100 percent on plain Grafana API calls. Reading telemetry is close to solved. Changing things safely is not.</li>
  </ul>
</div>

<h2>Somebody finally wrote the test</h2>
<p>Every vendor with a roadmap has shipped an SRE agent in the last eighteen months. AWS has one, Azure has one, Datadog has one, and the demo is always the same: a synthetic outage, a tidy root cause, applause. What nobody could tell you was whether any of it survived contact with a real stack, because there was no shared exam. Each vendor graded its own homework.</p>
<p>Grafana changed that on 21 April, at GrafanaCON, by open sourcing <a href="https://github.com/grafana/o11y-bench" target="_blank" rel="noopener">o11y-bench</a> under AGPL v3. It is a benchmark that stands up a genuine observability environment in Docker, synthetic metrics, logs and traces flowing through Prometheus, Loki and Tempo, then points an agent at it through the Grafana MCP server and asks it to do 63 things a working engineer does.</p>
<p>The framing I like most is that it measures what the agent <em>does in the system</em>, not what it says about the system. A chat transcript that sounds competent scores zero if the PromQL came back wrong. It is built on Harbor, the environment-standardisation framework from the Terminal Bench people, so the plumbing is somebody else's solved problem and the tasks are the contribution.</p>

<h2>What the 63 tasks look like</h2>
<p>They break into five buckets. Prometheus and PromQL. Loki and LogQL. Tempo and TraceQL. Multi-step incident investigations, which is the closest thing here to a real page at 3am. And dashboard editing and repair.</p>
<p>Grading is a mix of deterministic checks and rubric criteria, so a task is not graded purely on vibes, but it is not purely string matching either. You need an Anthropic key for the grading pass plus a key for whatever model you are testing. Runs can be regraded later without re-running the agents, which is a small thing that will save anyone doing serious evaluation a lot of money.</p>
<p>The launch evaluation was not small. 29 model variants, 63 tasks, three attempts each, 5,481 trials in total. That is enough to say something.</p>

<figure class="blog-figure blog-figure-photo"><img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1280&q=80" alt="Rows of labeled wooden card catalog drawers" loading="lazy" /><figcaption>Querying is the drawer-opening part of the job, and agents are genuinely good at it now. 88 percent on metrics, 80 on logs. The trouble starts when they have to put something back in a drawer.</figcaption></figure>

<h2>Pass^3 is the whole story</h2>
<p>Most agent benchmarks quote pass@k, which asks whether the model got there at least once in k attempts. That is a fine number for research and a terrible number for operations. Nobody runs an incident three times and keeps the good one.</p>
<p>o11y-bench leads with <strong>Pass^3</strong> instead, the average score across three runs. Same task, three goes, what did you score on average. It punishes a model that solves something brilliantly on Tuesday and wanders off on Wednesday, which is precisely the failure mode that makes engineers stop trusting an agent. Pass@3 is still reported next to it, and the gap between the two columns is where the interesting reading is.</p>
<table class="ctable">
  <thead><tr><th>Model</th><th>Pass^3</th><th>Pass@3</th><th>Tasks solved</th></tr></thead>
  <tbody>
    <tr><th>Claude Opus 4.7 (thinking off)</th><td>79.4%</td><td>87.3%</td><td>50 / 63</td></tr>
    <tr><th>Claude Opus 4.7 (thinking high)</th><td>73.0%</td><td>90.5%</td><td>46 / 63</td></tr>
    <tr><th>Claude Sonnet 4.6 (thinking high)</th><td>68.3%</td><td>84.1%</td><td>43 / 63</td></tr>
    <tr><th>Claude Opus 4.6 (thinking off)</th><td>66.7%</td><td>90.5%</td><td>42 / 63</td></tr>
    <tr><th>Claude Opus 4.7 (thinking low)</th><td>63.5%</td><td>85.7%</td><td>40 / 63</td></tr>
  </tbody>
</table>
<p>Look at rows one and two. Thinking high solves more distinct problems at least once, 90.5 against 87.3, and yet its average run is six points worse. Look at row four, which is a previous-generation model posting the same 90.5 percent best-of-three as the newest reasoning configuration while sitting nearly thirteen points lower on consistency.</p>
<p>Grafana's own read on this is that high-thinking models sometimes spin their wheels gathering too much information. Which matches what anyone who has watched an agent work a live incident already suspects. Given more room to reason, it goes and reads everything, and sometimes the extra context helps and sometimes it talks itself out of the right answer. Qwen 3.6 Plus was the strongest open-source entry, worth knowing if you are running models yourself.</p>

<h2>The dashboard cliff</h2>
<p>Here is the number I would put on a slide. For the top model, broken out by category:</p>
<ul>
  <li>Grafana API: <strong>100%</strong></li>
  <li>Metrics: <strong>88%</strong></li>
  <li>Logs: <strong>80%</strong></li>
  <li>Traces: <strong>77%</strong></li>
  <li>Investigation: <strong>73%</strong></li>
  <li>Dashboards: <strong>57%</strong></li>
</ul>
<p>That is a clean gradient from "call an API correctly" down to "change a shared artifact without breaking it", and it is not subtle. Forty-three points separate the top and bottom of that list.</p>
<p>Why dashboards are hard is worth sitting with, because the reason generalises. A dashboard task requires holding several things true at once: the state of the object you are editing, the correctness of the query inside the panel, the variable wiring that makes the panel respond to the template selector, and the saved behaviour after you write it back. Get three right and the fourth wrong and you have shipped a dashboard that looks fine and lies to whoever opens it next.</p>
<p>Which is the whole problem with agents doing mutation work. A wrong PromQL query announces itself, you see an empty graph or an absurd number and you fix it. A subtly wrong dashboard is silent, and it stays silent until somebody trusts it during an outage. The failure has a long fuse and lands on a different person than the one which caused it.</p>

<figure class="blog-figure blog-figure-diagram"><img src="/blog-figures/o11y-bench-category-scores.svg" alt="Bar chart of o11y-bench Pass^3 scores by category for Claude Opus 4.7 with thinking off: Grafana API 100 percent, Metrics 88 percent, Logs 80 percent, Traces 77 percent, Investigation 73 percent, Dashboards 57 percent" loading="lazy" /><figcaption>The same model, six categories, a 43-point spread. Dashboards are the only category that falls under the leaderboard's 70 percent line, and they are the one place the agent has to write rather than read.</figcaption></figure>

<h2>What I would actually do with this</h2>
<p>Do not read 79.4 percent as "agents are 79 percent of an SRE". The benchmark is 63 tasks against a synthetic stack that Grafana built, and a synthetic stack is tidier than yours. No half-migrated legacy exporter, no metric that three teams renamed, no dashboard from 2021 that somebody still uses. A real environment is dirtier and the scores would move down, not up.</p>
<p>What the benchmark is genuinely good for is three things. Setting a read/write boundary, comparing models on the axis that matters, and giving you a template for your own evaluation.</p>
<p>The boundary is the easy win. The category breakdown draws a line for you: query and investigation work is in decent shape, mutation work is not. So give the agent broad read access and make every write a proposal a human approves. That is not a permanent state of the world, but at 57 percent it is where the numbers point today, and you can revisit when the leaderboard moves.</p>
<p>On model selection, the lesson is to stop reading best-of-three numbers when you are buying reliability. If you had picked from the Pass@3 column you would have chosen the thinking-high configuration and got a measurably less consistent agent. Also worth noticing that maximum reasoning is not automatically the right setting, cranking it up cost six points of consistency here. Test the setting, do not assume it.</p>
<p>And the third use is the one most teams will skip and shouldn't. The tasks are readable on the <a href="https://o11ybench.ai/tasks/" target="_blank" rel="noopener">tasks explorer</a>, the whole thing is AGPL, and Harbor is designed to be extended. Fork the structure, write twenty tasks against your own stack with your own metric names and your own genuinely cursed dashboard, and now you have a number for <em>your</em> environment. That number is worth ten times the public leaderboard, because it is measured on the mess your agent will actually meet.</p>

<h2>The part this does not measure</h2>
<p>A benchmark grades the agent. It does not tell you what the agent did on the way to the answer, and that gap is the thing I keep writing about. o11y-bench will tell you a model got 73 percent on investigation tasks. It will not tell you that it burned 40 tool calls doing it, or that it queried a production Loki instance eleven times when once would have done.</p>
<p>That is your telemetry problem, not Grafana's, and it is the subject of <a href="/blog/ai-agents-breaking-traditional-monitoring-observability">Observing the Observer</a> and <a href="/blog/ai-agents-observability-blind-spot">the agent observability blind spot</a>. Benchmarks measure whether the agent can do the job. Instrumentation measures what it did to your systems while doing it, and you need both, the tooling for the second half is covered in <a href="/blog/langfuse-vs-arize-phoenix-vs-langsmith-vs-agentops-llm-observability-2026">the Langfuse, Phoenix, LangSmith and AgentOps comparison</a>.</p>
<p>Still, an open, reproducible, vendor-neutral exam is a real gift to this space. It is going to be very hard to sell an autonomous SRE agent now without someone asking what it scored. Which is exactly the pressure the category needed.</p>

<div class="verdict">
  <h3>The bottom line</h3>
  <p>o11y-bench is the first honest scoreboard for AI agents doing observability work, and its most useful decision is grading consistency over best-of-three. The top score of 79.4 percent is respectable and the 57 percent on dashboards is the number to act on: let agents read broadly, make them propose every write. Do not take the leaderboard as your answer. Fork the repo, write tasks against your own stack, and find out what these things score on your mess instead of Grafana's clean one.</p>
</div>

<h3>Sources</h3>
<ul>
  <li><a href="https://grafana.com/blog/o11y-bench-open-benchmark-for-observability-agents/" target="_blank" rel="noopener">Introducing o11y-bench, Grafana Labs</a></li>
  <li><a href="https://github.com/grafana/o11y-bench" target="_blank" rel="noopener">grafana/o11y-bench on GitHub</a></li>
  <li><a href="https://o11ybench.ai/" target="_blank" rel="noopener">o11y-bench leaderboard</a></li>
  <li><a href="https://grafana.com/press/2026/04/21/grafana-labs-targets-the-ai-blind-spot-with-new-observability-tools-announced-at-grafanacon-2026/" target="_blank" rel="noopener">GrafanaCON 2026 announcement</a></li>
</ul>
    `
  }
];
