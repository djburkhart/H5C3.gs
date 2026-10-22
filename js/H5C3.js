/*
  H5C3.gs 2.0
  Measures each grid, publishes the column count, and applies optional
  area templates. Layout itself stays in CSS.
*/
(function (global) {
  "use strict";

  var VERSION = "2.0.0";
  var GRID = ".grid, .subgrid";
  var GAP_TOKENS = { none: true, xs: true, sm: true, md: true, lg: true, xl: true };
  var MIN_TOKENS = { xs: true, sm: true, md: true, lg: true, xl: true };
  var SPAN_CLASS = /^span-(?:all|\d+)$/;
  var OFFSET_CLASS = /^offset-\d+$/;

  var observer = null;
  var mutations = null;
  var observed = new WeakSet();
  var templateCols = new WeakMap();
  var debugOn = false;
  var started = false;

  function cssEscape(value) {
    if (global.CSS && typeof global.CSS.escape === "function") {
      return global.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function features() {
    var css = global.CSS && typeof global.CSS.supports === "function"
      ? global.CSS.supports.bind(global.CSS)
      : null;

    return {
      grid: css ? css("display", "grid") : false,
      subgrid: css ? css("grid-template-columns", "subgrid") : false,
      containerQueries: css ? css("container-type", "inline-size") : false,
      resizeObserver: "ResizeObserver" in global
    };
  }

  function trackCount(el) {
    var value = global.getComputedStyle(el).gridTemplateColumns;
    if (!value || value === "none") return 1;

    var parts = value.trim().split(/\s+/);
    var count = 0;
    for (var i = 0; i < parts.length; i += 1) {
      var size = parseFloat(parts[i]);
      if (size >= 1) count += 1;
    }
    return Math.max(1, count);
  }

  function applyAuthorProps(el) {
    var cols = Number(el.dataset.cols);
    if (!el.style.getPropertyValue("--cols") && Number.isFinite(cols) && cols >= 1) {
      el.style.setProperty("--cols", String(Math.floor(cols)));
    }

    if (el.dataset.min && !MIN_TOKENS[el.dataset.min] && /\d/.test(el.dataset.min)) {
      el.style.setProperty("--min", el.dataset.min.trim());
    }

    if (el.dataset.gap && !GAP_TOKENS[el.dataset.gap] && /\d/.test(el.dataset.gap)) {
      el.style.setProperty("--gap", el.dataset.gap.trim());
    }
  }

  function templateFor(el, cols) {
    var exact = el.getAttribute("data-template-" + cols);
    if (exact) return exact;
    if (cols === 1 && el.dataset.template) return el.dataset.template;
    return "";
  }

  function applyTemplate(el, cols) {
    if (templateCols.get(el) === cols) return;
    templateCols.set(el, cols);

    var chosen = templateFor(el, cols);
    var items = el.querySelectorAll(":scope > [data-area]");

    if (!chosen) {
      if (el.dataset.templated) {
        el.style.removeProperty("grid-template-areas");
        for (var i = 0; i < items.length; i += 1) {
          items[i].style.removeProperty("grid-area");
        }
        delete el.dataset.templated;
      }
      return;
    }

    var rows = chosen.split("|");
    var areas = [];
    for (var r = 0; r < rows.length; r += 1) {
      var row = rows[r].trim();
      if (row) areas.push('"' + row + '"');
    }

    el.style.gridTemplateAreas = areas.join(" ");
    for (var n = 0; n < items.length; n += 1) {
      items[n].style.gridArea = items[n].dataset.area;
    }
    el.dataset.templated = "true";
  }

  function reflect(el) {
    if (!el.id) return;
    var nodes = document.querySelectorAll('[data-reflect="' + cssEscape(el.id) + '"]');
    for (var i = 0; i < nodes.length; i += 1) {
      nodes[i].textContent = el.dataset.currentCols;
    }
  }

  function label(el) {
    var children = el.children;
    for (var i = 0; i < children.length; i += 1) {
      var child = children[i];
      var column = global.getComputedStyle(child).gridColumn.replace(/\s+/g, " ").trim();
      child.dataset.place = column || "auto";
    }
  }

  function clearLabels(el) {
    var marked = el.querySelectorAll(":scope > [data-place]");
    for (var i = 0; i < marked.length; i += 1) {
      delete marked[i].dataset.place;
    }
  }

  function measure(el) {
    var cols = trackCount(el);
    var next = String(cols);
    el.dataset.measured = "true";

    if (el.dataset.currentCols !== next) {
      el.dataset.currentCols = next;
      el.style.setProperty("--current-cols", next);
      templateCols.delete(el);
    }

    applyTemplate(el, cols);
    reflect(el);
    if (debugOn) label(el);
  }

  function ensureObserver() {
    if (observer || !("ResizeObserver" in global)) return;
    observer = new global.ResizeObserver(function (entries) {
      for (var i = 0; i < entries.length; i += 1) {
        measure(entries[i].target);
      }
    });
  }

  function watch(el) {
    if (!el || el.nodeType !== 1 || !el.matches(GRID)) return;
    applyAuthorProps(el);
    if (!observed.has(el)) {
      observed.add(el);
      ensureObserver();
      if (observer) observer.observe(el);
    }
    measure(el);
    if (debugOn) {
      el.dataset.debug = "true";
    }
  }

  function mount(root) {
    var scope = root || document;
    if (scope.nodeType === 1 && scope.matches && scope.matches(GRID)) {
      watch(scope);
    }
    if (!scope.querySelectorAll) return api;
    var nodes = scope.querySelectorAll(GRID);
    for (var i = 0; i < nodes.length; i += 1) watch(nodes[i]);
    return api;
  }

  function refresh(root) {
    var scope = root || document;
    templateCols = new WeakMap();
    if (scope.nodeType === 1 && scope.matches && scope.matches(GRID)) {
      templateCols.delete(scope);
      measure(scope);
    }
    if (!scope.querySelectorAll) return api;
    var nodes = scope.querySelectorAll(GRID);
    for (var i = 0; i < nodes.length; i += 1) {
      templateCols.delete(nodes[i]);
      measure(nodes[i]);
    }
    return api;
  }

  function setColumns(el, count) {
    var cols = Math.max(1, Math.floor(Number(count)));
    el.dataset.cols = String(cols);
    el.style.setProperty("--cols", String(cols));
    templateCols.delete(el);
    measure(el);
    return api;
  }

  function setMin(el, min) {
    var value = String(min);
    el.dataset.min = value;
    if (MIN_TOKENS[value]) el.style.removeProperty("--min");
    else el.style.setProperty("--min", value);
    templateCols.delete(el);
    measure(el);
    return api;
  }

  function setGap(el, gap) {
    var value = String(gap);
    el.dataset.gap = value;
    if (GAP_TOKENS[value]) el.style.removeProperty("--gap");
    else el.style.setProperty("--gap", value);
    return api;
  }

  function stripClass(el, pattern) {
    var names = el.className.split(/\s+/);
    for (var i = 0; i < names.length; i += 1) {
      if (pattern.test(names[i])) el.classList.remove(names[i]);
    }
  }

  function setSpan(el, span) {
    stripClass(el, SPAN_CLASS);
    el.style.removeProperty("--span");
    if (span === "all" || span === "full") {
      el.classList.add("span-all");
    } else {
      var n = Math.max(1, Math.min(12, Math.floor(Number(span))));
      el.classList.add("span-" + n);
    }
    var grid = el.closest(GRID);
    if (grid) measure(grid);
    return api;
  }

  function setOffset(el, offset) {
    stripClass(el, OFFSET_CLASS);
    el.style.removeProperty("--off");
    var n = Math.floor(Number(offset));
    if (n > 0) el.classList.add("offset-" + Math.min(11, n));
    var grid = el.closest(GRID);
    if (grid) measure(grid);
    return api;
  }

  function areas(el, template) {
    var rows = Array.isArray(template) ? template.slice() : String(template).split("|");
    var lines = [];
    for (var i = 0; i < rows.length; i += 1) {
      var row = String(rows[i]).trim();
      if (row) lines.push('"' + row + '"');
    }
    el.style.gridTemplateAreas = lines.join(" ");
    var items = el.querySelectorAll(":scope > [data-area]");
    for (var n = 0; n < items.length; n += 1) {
      items[n].style.gridArea = items[n].dataset.area;
    }
    el.dataset.templated = "true";
    templateCols.set(el, Number(el.dataset.currentCols || 0));
    return api;
  }

  function syncToggles() {
    var buttons = document.querySelectorAll("[data-debug-toggle]");
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute("aria-pressed", debugOn ? "true" : "false");
      buttons[i].textContent = debugOn ? "Hide grid lines" : "Show grid lines";
    }
  }

  function debug(enabled, root) {
    debugOn = !!enabled;
    document.documentElement.classList.toggle("debug", debugOn);
    var scope = root || document;
    var nodes = scope.querySelectorAll ? scope.querySelectorAll(GRID) : [];
    for (var i = 0; i < nodes.length; i += 1) {
      if (debugOn) {
        nodes[i].dataset.debug = "true";
        label(nodes[i]);
      } else {
        delete nodes[i].dataset.debug;
        clearLabels(nodes[i]);
      }
    }
    syncToggles();
    return api;
  }

  function bindToggles() {
    var buttons = document.querySelectorAll("[data-debug-toggle]");
    for (var i = 0; i < buttons.length; i += 1) {
      if (buttons[i].dataset.bound) continue;
      buttons[i].dataset.bound = "true";
      buttons[i].addEventListener("click", function () {
        debug(!debugOn);
      });
    }
    syncToggles();
  }

  function watchNewNodes(records) {
    for (var i = 0; i < records.length; i += 1) {
      var added = records[i].addedNodes;
      for (var n = 0; n < added.length; n += 1) {
        mount(added[n]);
      }
    }
  }

  function announceUnsupported() {
    if (!document.body || document.querySelector(".h5c3-support")) return;
    document.documentElement.classList.add("h5c3-no-grid");
    var note = document.createElement("p");
    note.className = "h5c3-support";
    note.setAttribute("role", "status");
    note.textContent = "This browser does not support CSS grid. Content is shown in a single column.";
    document.body.insertBefore(note, document.body.firstChild);
  }

  var api = {
    version: VERSION,
    features: features(),
    mount: mount,
    refresh: refresh,
    columns: function (el) {
      return Number(el.dataset.currentCols || trackCount(el));
    },
    setColumns: setColumns,
    setMin: setMin,
    setGap: setGap,
    setSpan: setSpan,
    setOffset: setOffset,
    areas: areas,
    debug: debug
  };

  function start() {
    if (started) return;
    started = true;

    if (!api.features.grid) announceUnsupported();

    var params = new URLSearchParams(global.location.search);
    if (params.has("debug") || document.documentElement.classList.contains("debug")) {
      debugOn = true;
    }

    mount(document);
    bindToggles();

    if (!observer) {
      global.addEventListener("resize", function () { refresh(document); }, { passive: true });
    }

    if ("MutationObserver" in global && document.body) {
      mutations = new global.MutationObserver(watchNewNodes);
      mutations.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  global.H5C3 = api;
})(window);
