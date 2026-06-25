/* ============================================================
   ObservaPedia — Application Logic
   ============================================================ */
(function () {
  "use strict";

  const TERMS = (window.OBSERVA_TERMS || []).slice().sort((a, b) =>
    a.term.toLowerCase().localeCompare(b.term.toLowerCase())
  );

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const slug = (s) => norm(s).replace(/\s+/g, "-");
  const esc = (s) => (s || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function findExact(q) {
    const n = norm(q);
    return TERMS.find((t) =>
      norm(t.term) === n ||
      norm(t.abbr) === n ||
      slug(t.term) === slug(q)
    );
  }

  // Levenshtein for "did you mean"
  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
    return d[m][n];
  }

  // ranked search: exact > startsWith > word-boundary > substring > definition > fuzzy
  function search(q, limit) {
    const n = norm(q);
    if (!n) return [];
    const scored = [];
    for (const t of TERMS) {
      const term = norm(t.term), abbr = norm(t.abbr), def = norm(t.definition);
      let score = -1;
      if (term === n || abbr === n) score = 100;
      else if (term.startsWith(n) || abbr.startsWith(n)) score = 80;
      else if (new RegExp("\\b" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(term)) score = 65;
      else if (term.includes(n)) score = 50;
      else if (abbr.includes(n)) score = 45;
      else if ((t.related || []).some((r) => norm(r).includes(n))) score = 30;
      else if (def.includes(n)) score = 20;
      else {
        const dist = lev(n, term.slice(0, n.length + 2));
        if (n.length >= 4 && dist <= 2) score = 10 - dist;
      }
      if (score >= 0) scored.push({ t, score });
    }
    scored.sort((a, b) => b.score - a.score || a.t.term.localeCompare(b.t.term));
    return (limit ? scored.slice(0, limit) : scored).map((s) => s.t);
  }

  function nearest(q) {
    const n = norm(q);
    let best = null, bd = Infinity;
    for (const t of TERMS) {
      const d = lev(n, norm(t.term));
      if (d < bd) { bd = d; best = t; }
    }
    return bd <= Math.max(3, n.length / 2) ? best : null;
  }

  /* ---------- theme ---------- */
  function initTheme() {
    const saved = localStorage.getItem("op-theme");
    const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (sysDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateToggle(theme);
  }
  function updateToggle(theme) {
    const btn = $("#themeToggle");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("op-theme", next);
    updateToggle(next);
  }

  /* ---------- mobile nav, scroll-top ---------- */
  function initChrome() {
    const t = $("#themeToggle"); if (t) t.addEventListener("click", toggleTheme);
    const mb = $("#menuBtn"), nl = $("#navLinks");
    if (mb && nl) mb.addEventListener("click", () => nl.classList.toggle("open"));
    const st = $("#scrollTop");
    if (st) {
      st.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
      window.addEventListener("scroll", () => st.classList.toggle("show", window.scrollY > 600));
    }
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- render a definition card ---------- */
  function cardHTML(t) {
    const rel = (t.related || []).map((r) =>
      `<span class="rel-tag" data-term="${esc(r)}">${esc(r)}</span>`).join("");
    const ven = (t.vendors || []).map((v) =>
      `<span class="vendor-tag">${esc(v)}</span>`).join("");
    return `
      <div class="definition-card" id="def-${slug(t.term)}">
        <div class="dc-head">
          <h2>${esc(t.term)}</h2>
          ${t.abbr ? `<span class="abbr">${esc(t.abbr)}</span>` : ""}
          <span class="badge">${esc(t.category)}</span>
        </div>
        <p class="dc-body">${esc(t.definition)}</p>
        ${rel ? `<div class="dc-meta"><h4>Related terms</h4><div class="tag-list">${rel}</div></div>` : ""}
        ${ven ? `<div class="dc-meta"><h4>Seen in platforms</h4><div class="tag-list">${ven}</div></div>` : ""}
        <div class="comment-section" data-term="${esc(t.term)}"></div>
      </div>`;
  }

  /* ============================================================
     HOME PAGE search
     ============================================================ */
  function initHome() {
    const input = $("#searchInput");
    if (!input) return;
    const sugg = $("#suggestions");
    const panel = $("#resultPanel");
    const clearBtn = $("#clearBtn");
    let activeIdx = -1, currentSugg = [];

    // stat count
    const sc = $("#statTerms"); if (sc) sc.textContent = TERMS.length + "+";
    const scCat = $("#statCats");
    if (scCat) scCat.textContent = new Set(TERMS.map((t) => t.category)).size;

    function renderResult(t) {
      panel.innerHTML = cardHTML(t);
      panel.classList.remove("hidden");
      bindRelTags(panel);
      if (window.Comments) {
        const cm = panel.querySelector(".comment-section");
        if (cm) Comments.mount(cm, t.term);
      }
      history.replaceState(null, "", "#" + slug(t.term));
    }
    function renderMiss(q) {
      const near = nearest(q);
      panel.innerHTML = `
        <div class="definition-card no-result">
          <div class="big">🔍</div>
          <h2>No exact match for "${esc(q)}"</h2>
          <p>We couldn't find that term in our glossary yet.</p>
          ${near ? `<p class="near">Did you mean
            <a href="#" class="rel-tag" data-term="${esc(near.term)}">${esc(near.term)}</a>?</p>` : ""}
          <p class="muted">Browse the full <a href="glossary.html">A–Z glossary</a> or
          <a href="contact.html">suggest this term</a>.</p>
        </div>`;
      panel.classList.remove("hidden");
      bindRelTags(panel);
    }

    function showSuggestions(q) {
      currentSugg = search(q, 8);
      activeIdx = -1;
      if (!currentSugg.length || !q) { sugg.classList.remove("show"); return; }
      sugg.innerHTML = currentSugg.map((t, i) => `
        <div class="suggestion" data-i="${i}" data-term="${esc(t.term)}">
          <span class="s-term">${esc(t.term)}</span>
          ${t.abbr ? `<span class="abbr">${esc(t.abbr)}</span>` : ""}
          <span class="s-cat">${esc(t.category)}</span>
        </div>`).join("");
      sugg.classList.add("show");
      $$(".suggestion", sugg).forEach((el) => {
        el.addEventListener("click", () => { go(el.dataset.term); });
      });
    }

    function go(q) {
      q = (q || input.value).trim();
      if (!q) return;
      sugg.classList.remove("show");
      input.value = q;
      const t = findExact(q) || search(q, 1)[0];
      if (t) renderResult(t); else renderMiss(q);
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    window.__opGo = go;

    input.addEventListener("input", () => {
      const v = input.value.trim();
      clearBtn.classList.toggle("show", !!v);
      showSuggestions(v);
    });
    input.addEventListener("keydown", (e) => {
      const items = $$(".suggestion", sugg);
      if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
      else if (e.key === "Enter") {
        if (activeIdx >= 0 && items[activeIdx]) go(items[activeIdx].dataset.term);
        else go();
        return;
      } else if (e.key === "Escape") { sugg.classList.remove("show"); return; }
      items.forEach((el, i) => el.classList.toggle("active", i === activeIdx));
    });
    $("#goBtn").addEventListener("click", () => go());
    clearBtn.addEventListener("click", () => {
      input.value = ""; clearBtn.classList.remove("show");
      sugg.classList.remove("show"); panel.classList.add("hidden");
      history.replaceState(null, "", location.pathname); input.focus();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) sugg.classList.remove("show");
    });

    // example chips
    $$(".chip").forEach((c) => c.addEventListener("click", () => go(c.dataset.term)));

    // category cards -> glossary filtered
    $$(".cat-card").forEach((c) => c.addEventListener("click", () => {
      location.href = "glossary.html?cat=" + encodeURIComponent(c.dataset.cat);
    }));

    // deep link via hash
    if (location.hash.length > 1) {
      const q = decodeURIComponent(location.hash.slice(1)).replace(/-/g, " ");
      const t = findExact(q);
      if (t) { input.value = t.term; clearBtn.classList.add("show"); renderResult(t); }
    }

    renderCategoryGrid("catGrid", { limit: 12 });
  }

  /* ---------- data-driven category grid ---------- */
  const CATEGORY_ICONS = {
    "Fundamentals": "🧭", "Metrics": "📈", "Logging": "📝", "Tracing": "🧵",
    "APM": "⚙️", "AIOps": "🤖", "Reliability": "🛡️", "Incident": "🚨",
    "Digital Experience": "👤", "Infrastructure": "🖥️", "Standards & Tools": "🧰",
    "Visualization": "📊", "Cloud Native": "☁️", "Containers": "📦", "Kubernetes": "☸️",
    "Service Mesh": "🕸️", "DevOps & CI/CD": "🔁", "Networking": "🌐", "Databases": "🗄️",
    "Data & Streaming": "🌊", "Security & SIEM": "🔐", "Cloud Providers": "🏢",
    "Distributed Systems": "🔗", "Architecture": "🏗️", "Compute & Runtime": "🧮",
    "IT Operations": "🛠️", "Data Formats": "🔤"
  };
  const CATEGORY_BLURBS = {
    "Fundamentals": "Observability, telemetry, instrumentation and the core ideas.",
    "Metrics": "Counters, gauges, histograms, percentiles and golden signals.",
    "Logging": "Structured logs, parsing, retention and aggregation.",
    "Tracing": "Spans, traces, context propagation and sampling.",
    "APM": "Transactions, code-level visibility, Apdex and profiling.",
    "AIOps": "Anomaly detection, correlation, RCA, auto-remediation and AI/LLM observability.",
    "Reliability": "SLI, SLO, error budgets, MTTR, resilience and DR.",
    "Incident": "Monitors, on-call, escalation, runbooks and postmortems.",
    "Digital Experience": "RUM, synthetics, Core Web Vitals and session replay.",
    "Infrastructure": "Hosts, storage, IOPS, GPU and cloud monitoring.",
    "Standards & Tools": "OpenTelemetry, Prometheus, Grafana, vendors and pipelines.",
    "Visualization": "Dashboards, correlation, tags, latency and topology.",
    "Cloud Native": "Microservices, serverless, GitOps and the CNCF landscape.",
    "Containers": "Docker, images, runtimes, cgroups and sidecars.",
    "Kubernetes": "Pods, deployments, services, operators and autoscaling.",
    "Service Mesh": "Envoy, Istio, proxies, mTLS and the data plane.",
    "DevOps & CI/CD": "Pipelines, deployments, IaC, GitOps and DORA metrics.",
    "Networking": "DNS, CDN, load balancing, TLS, HTTP and protocols.",
    "Databases": "SQL, NoSQL, replication, sharding, TSDBs and storage.",
    "Data & Streaming": "Kafka, pipelines, ETL, data observability and lakehouses.",
    "Security & SIEM": "SIEM, SOAR, threat detection, IAM and AppSec.",
    "Cloud Providers": "AWS, Azure, GCP services, FinOps and DR.",
    "Distributed Systems": "Consensus, consistency, scaling and resilience patterns.",
    "Architecture": "EDA, CQRS, event sourcing and data mesh.",
    "Compute & Runtime": "Runtimes, GC, threads, memory and OS internals.",
    "IT Operations": "ITSM, ITIL, CMDB, NOC and service management.",
    "Data Formats": "JSON, YAML, Protobuf, encoding and serialization."
  };

  function renderCategoryGrid(containerId, opts) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    opts = opts || {};
    const counts = {};
    TERMS.forEach((t) => counts[t.category] = (counts[t.category] || 0) + 1);
    let cats = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
    if (opts.limit) cats = cats.slice(0, opts.limit);
    wrap.innerHTML = cats.map((c) => `
      <a class="cat-card" href="glossary.html?cat=${encodeURIComponent(c)}">
        <div class="c-icon">${CATEGORY_ICONS[c] || "📚"}</div>
        <h3>${esc(c)}</h3>
        <p>${esc(CATEGORY_BLURBS[c] || "Key terms and concepts in this area.")}</p>
        <div class="count">${counts[c]} terms</div>
      </a>`).join("");
  }
  window.OBSERVA = { renderCategoryGrid };

  function bindRelTags(scope) {
    $$(".rel-tag", scope).forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.__opGo) window.__opGo(el.dataset.term);
        else location.href = "index.html#" + slug(el.dataset.term);
      }));
  }

  function bindCommentToggles(scope) {
    $$(".cm-toggle", scope).forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = btn.nextElementSibling;
        if (!sec) return;
        const collapsed = sec.classList.toggle("cm-collapsed");
        if (!collapsed && !sec.dataset.mounted && window.Comments) {
          Comments.mount(sec, btn.dataset.term);
          sec.dataset.mounted = "1";
        }
        btn.classList.toggle("cm-open", !collapsed);
      });
      // show a live count next to the toggle
      if (window.Comments) {
        Comments.count(btn.dataset.term).then((n) => {
          if (n > 0) btn.textContent = "💬 Community notes (" + n + ")";
        });
      }
    });
  }

  function renderCategoryCounts() {
    const counts = {};
    TERMS.forEach((t) => counts[t.category] = (counts[t.category] || 0) + 1);
    $$(".cat-card").forEach((c) => {
      const el = $(".count", c);
      if (el) el.textContent = (counts[c.dataset.cat] || 0) + " terms";
    });
  }

  /* ============================================================
     GLOSSARY PAGE
     ============================================================ */
  function initGlossary() {
    const wrap = $("#glossaryContent");
    if (!wrap) return;
    const searchEl = $("#gSearch");
    const catEl = $("#gCategory");
    const countEl = $("#termCount");
    const alphaNav = $("#alphaNav");

    // populate category dropdown
    const cats = Array.from(new Set(TERMS.map((t) => t.category))).sort();
    cats.forEach((c) => {
      const o = document.createElement("option"); o.value = c; o.textContent = c;
      catEl.appendChild(o);
    });

    // preselect from URL
    const params = new URLSearchParams(location.search);
    if (params.get("cat")) catEl.value = params.get("cat");

    function highlight(text, q) {
      if (!q) return esc(text);
      const n = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return esc(text).replace(new RegExp("(" + n + ")", "ig"), "<mark>$1</mark>");
    }

    function render() {
      const q = searchEl.value.trim();
      const cat = catEl.value;
      let list = TERMS;
      if (cat) list = list.filter((t) => t.category === cat);
      if (q) {
        const ids = new Set(search(q).map((t) => t.term));
        list = list.filter((t) => ids.has(t.term));
      }
      countEl.textContent = list.length + (list.length === 1 ? " term" : " terms");

      // group by first letter
      const groups = {};
      list.forEach((t) => {
        const L = t.term[0].toUpperCase();
        (groups[L] = groups[L] || []).push(t);
      });
      const letters = Object.keys(groups).sort();

      // alpha nav
      const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      alphaNav.innerHTML = allLetters.map((L) =>
        groups[L]
          ? `<a href="#letter-${L}">${L}</a>`
          : `<a class="disabled">${L}</a>`).join("");

      if (!list.length) {
        wrap.innerHTML = `<div class="no-result"><div class="big">📭</div>
          <h2>No terms match your filters</h2>
          <p class="muted">Try a different keyword or category.</p></div>`;
        return;
      }

      wrap.innerHTML = letters.map((L) => `
        <div class="letter-group" id="letter-${L}">
          <h2 class="letter-head">${L}</h2>
          <div class="glossary-grid">
            ${groups[L].map((t) => `
              <div class="term-card" id="g-${slug(t.term)}">
                <div class="tc-head">
                  <h3>${highlight(t.term, q)}</h3>
                  ${t.abbr ? `<span class="tc-abbr">${esc(t.abbr)}</span>` : ""}
                  <span class="tc-cat">${esc(t.category)}</span>
                </div>
                <p>${highlight(t.definition, q)}</p>
                ${(t.vendors && t.vendors.length)
                  ? `<div class="tc-vendors">${t.vendors.map((v) => `<span>${esc(v)}</span>`).join("")}</div>`
                  : ""}
                ${(t.related && t.related.length)
                  ? `<div class="tc-vendors">${t.related.slice(0,4).map((r) =>
                      `<span class="rel-tag" data-term="${esc(r)}">↗ ${esc(r)}</span>`).join("")}</div>`
                  : ""}
                <button class="cm-toggle" data-term="${esc(t.term)}">💬 Community notes</button>
                <div class="comment-section cm-collapsed" data-term="${esc(t.term)}"></div>
              </div>`).join("")}
          </div>
        </div>`).join("");
      bindRelTags(wrap);
      bindCommentToggles(wrap);
    }

    searchEl.addEventListener("input", render);
    catEl.addEventListener("change", render);
    render();
  }

  /* ---------- nav profile button ---------- */
  function initNavProfile() {
    var navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    if (location.pathname.indexOf('admin.html') !== -1) return;

    var profile = {};
    try { profile = JSON.parse(localStorage.getItem('observapedia_profile') || 'null') || {}; } catch (e) {}
    var posts = [];
    try { posts = JSON.parse(localStorage.getItem('observapedia_blog_posts') || '[]'); } catch (e) {}

    var name = profile.name || localStorage.getItem('observapedia_blog_username') || '';
    var avatar = profile.avatar || '✍️';
    var pendingCount = posts.filter(function (p) { return p.status === 'pending'; }).length;

    var btn = document.createElement('a');
    btn.href = 'profile.html';
    btn.className = 'nav-profile-btn';
    btn.title = name ? name + "’s profile" : "My Profile";

    var avatarSpan = document.createElement('span');
    avatarSpan.className = 'nav-profile-avatar';
    avatarSpan.textContent = avatar;
    btn.appendChild(avatarSpan);

    var nameSpan = document.createElement('span');
    nameSpan.className = 'nav-profile-name';
    nameSpan.textContent = name || 'My Profile';
    btn.appendChild(nameSpan);

    if (pendingCount > 0) {
      var badge = document.createElement('span');
      badge.className = 'nav-profile-badge';
      badge.textContent = pendingCount;
      btn.appendChild(badge);
    }

    if (location.pathname.indexOf('profile.html') !== -1) {
      btn.classList.add('active');
    }

    var themeBtn = navLinks.querySelector('#themeToggle');
    if (themeBtn) navLinks.insertBefore(btn, themeBtn);
    else navLinks.appendChild(btn);
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initChrome();
    initNavProfile();
    initHome();
    initGlossary();
  });
})();
