/* ============================================================
   Glancer.ai — User Comments (local-only)
   Storage: IndexedDB (the right local DB for structured, indexed,
   per-term records), with a localStorage fallback.
   Comments never leave the user's browser.
   ============================================================ */
window.Comments = (function () {
  "use strict";

  var DB_NAME = "observapedia", STORE = "comments", VERSION = 1;
  var dbPromise = null;
  var useFallback = !("indexedDB" in window);

  function openDB() {
    if (useFallback) return Promise.reject("no-idb");
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req;
      try { req = indexedDB.open(DB_NAME, VERSION); }
      catch (e) { useFallback = true; return reject(e); }
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          var s = db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
          s.createIndex("termKey", "termKey", { unique: false });
        }
      };
      req.onsuccess = function (e) { resolve(e.target.result); };
      req.onerror = function (e) { useFallback = true; reject(e.target.error); };
    });
    return dbPromise;
  }

  var keyOf = function (t) { return (t || "").toLowerCase().trim(); };

  /* ---- localStorage fallback ---- */
  var LS_KEY = "observapedia-comments";
  function lsAll() { try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { return {}; } }
  function lsSave(o) { try { localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch (e) {} }

  function add(term, name, text) {
    var rec = { termKey: keyOf(term), term: term, name: (name || "Anonymous").slice(0, 60), text: String(text).slice(0, 2000), ts: Date.now() };
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).add(rec);
        tx.oncomplete = resolve;
        tx.onerror = function (e) { reject(e.target.error); };
      });
    }).catch(function () {
      var all = lsAll(); var k = keyOf(term);
      (all[k] = all[k] || []).push(Object.assign({ id: "ls-" + Date.now() + "-" + Math.round(performance.now()) }, rec));
      lsSave(all);
    });
  }

  function list(term) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readonly");
        var req = tx.objectStore(STORE).index("termKey").getAll(keyOf(term));
        req.onsuccess = function () { resolve((req.result || []).sort(function (a, b) { return b.ts - a.ts; })); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    }).catch(function () {
      var all = lsAll(); return (all[keyOf(term)] || []).slice().sort(function (a, b) { return b.ts - a.ts; });
    });
  }

  function remove(id, term) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = function (e) { reject(e.target.error); };
      });
    }).catch(function () {
      var all = lsAll(), k = keyOf(term);
      all[k] = (all[k] || []).filter(function (c) { return c.id !== id; });
      lsSave(all);
    });
  }

  function count(term) { return list(term).then(function (a) { return a.length; }); }

  /* ---- helpers ---- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function ago(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    var m = Math.floor(s / 60); if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60); if (h < 24) return h + "h ago";
    var d = Math.floor(h / 24); if (d < 30) return d + "d ago";
    return new Date(ts).toLocaleDateString();
  }

  /* ---- UI mount ---- */
  function mount(container, term) {
    if (!container) return;
    container.innerHTML =
      '<div class="cm-head"><h4>💬 Community Notes</h4>' +
      '<span class="cm-count" aria-live="polite"></span></div>' +
      '<p class="cm-note">Comments are stored privately in your own browser (local database) — they are not shared or uploaded.</p>' +
      '<form class="cm-form">' +
        '<input class="cm-name" type="text" maxlength="60" placeholder="Your name (optional)" />' +
        '<textarea class="cm-text" maxlength="2000" required placeholder="Add a note or example for &quot;' + esc(term) + '&quot;…"></textarea>' +
        '<button type="submit" class="cm-submit">Post comment</button>' +
      '</form>' +
      '<div class="cm-list"></div>';

    var listEl = container.querySelector(".cm-list");
    var countEl = container.querySelector(".cm-count");
    var form = container.querySelector(".cm-form");

    function render() {
      list(term).then(function (items) {
        countEl.textContent = items.length ? "(" + items.length + ")" : "";
        if (!items.length) {
          listEl.innerHTML = '<p class="cm-empty">No comments yet. Be the first to add a note.</p>';
          return;
        }
        listEl.innerHTML = items.map(function (c) {
          return '<div class="cm-item">' +
            '<div class="cm-meta"><strong>' + esc(c.name) + '</strong>' +
            '<span class="cm-time">' + ago(c.ts) + '</span>' +
            '<button class="cm-del" data-id="' + esc(c.id) + '" title="Delete this comment">✕</button></div>' +
            '<div class="cm-body">' + esc(c.text) + '</div></div>';
        }).join("");
        listEl.querySelectorAll(".cm-del").forEach(function (b) {
          b.addEventListener("click", function () {
            var id = b.getAttribute("data-id");
            if (!String(id).startsWith("ls-")) id = Number(id);
            remove(id, term).then(render);
          });
        });
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = form.querySelector(".cm-text").value.trim();
      if (!text) return;
      var name = form.querySelector(".cm-name").value.trim();
      add(term, name, text).then(function () {
        form.querySelector(".cm-text").value = "";
        render();
      });
    });

    render();
  }

  return { add: add, list: list, remove: remove, count: count, mount: mount };
})();
