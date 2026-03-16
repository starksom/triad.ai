/**
 * Triad Dashboard — Vanilla JS frontend.
 */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────────────────
  let ws = null;
  let reconnectTimer = null;

  // ── Graph Layout (manual positions for 6 nodes) ─────────────────────────
  const NODE_POSITIONS = {
    PLANNING:       { x: 100, y: 200 },
    DEVELOPMENT:    { x: 250, y: 200 },
    VALIDATION:     { x: 400, y: 200 },
    CONSOLIDATION:  { x: 550, y: 200 },
    RELEASE_AUDIT:  { x: 550, y: 80 },
    USER_DECISION:  { x: 700, y: 80 },
  };

  // ── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    fetchAll();
    connectWebSocket();
  });

  async function fetchAll() {
    await Promise.all([
      fetchState(),
      fetchGraph(),
      fetchTimeline(),
      fetchDecisions(),
    ]);
  }

  // ── API Fetchers ─────────────────────────────────────────────────────────
  async function fetchState() {
    try {
      const res = await fetch('/api/state');
      const ctx = await res.json();
      renderState(ctx);
    } catch { /* ignore */ }
  }

  async function fetchGraph() {
    try {
      const res = await fetch('/api/graph');
      const data = await res.json();
      renderGraph(data.graph, data.activeState);
    } catch { /* ignore */ }
  }

  async function fetchTimeline() {
    try {
      const res = await fetch('/api/timeline');
      const entries = await res.json();
      renderTimeline(entries);
    } catch { /* ignore */ }
  }

  async function fetchDecisions() {
    try {
      const res = await fetch('/api/agents');
      const entries = await res.json();
      renderDecisions(entries);
    } catch { /* ignore */ }
  }

  // ── Renderers ────────────────────────────────────────────────────────────
  function renderState(ctx) {
    setText('state-phase', ctx.phase);
    setText('state-assignee', ctx.assignee);
    setText('state-task', ctx.task);
    setText('state-story', ctx.story.current + ' / ' + ctx.story.total);
    setText('state-retry', ctx.retryCount + ' / ' + ctx.maxRetries);
    setText('state-signal', ctx.completionSignal);
  }

  function renderGraph(graph, activeState) {
    const svg = document.getElementById('graph-svg');
    svg.innerHTML = '';

    // Arrowhead marker
    const defs = svgEl('defs');
    const marker = svgEl('marker', {
      id: 'arrowhead', markerWidth: '10', markerHeight: '7',
      refX: '10', refY: '3.5', orient: 'auto',
    });
    marker.appendChild(svgEl('polygon', { points: '0 0, 10 3.5, 0 7', fill: '#6c757d' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    const states = Object.keys(graph.states);

    // Draw edges
    for (const stateName of states) {
      const state = graph.states[stateName];
      const from = NODE_POSITIONS[stateName];
      if (!from) continue;

      for (const [, edge] of Object.entries(state.transitions)) {
        const to = NODE_POSITIONS[edge.target];
        if (!to) continue;

        const isActive = stateName === activeState;
        const path = svgEl('line', {
          x1: from.x, y1: from.y,
          x2: to.x, y2: to.y,
          class: 'graph-edge' + (isActive ? ' active' : ''),
        });
        svg.appendChild(path);
      }
    }

    // Draw nodes
    for (const stateName of states) {
      const pos = NODE_POSITIONS[stateName];
      if (!pos) continue;
      const isActive = stateName === activeState;

      const group = svgEl('g', {
        class: 'graph-node' + (isActive ? ' active' : ''),
        transform: 'translate(' + pos.x + ',' + pos.y + ')',
      });

      group.appendChild(svgEl('circle', { r: '30', cx: '0', cy: '0' }));

      const label = svgEl('text', { y: '4' });
      label.textContent = stateName.length > 10
        ? stateName.substring(0, 8) + '..'
        : stateName;
      group.appendChild(label);

      svg.appendChild(group);
    }
  }

  function renderTimeline(entries) {
    const container = document.getElementById('timeline-list');
    if (!entries || entries.length === 0) {
      container.innerHTML = '<div class="empty-state">No timeline entries yet.</div>';
      return;
    }

    container.innerHTML = entries.map(function (e) {
      return '<div class="timeline-entry">' +
        '<span class="timeline-timestamp">' + e.timestamp + '</span> ' +
        '<span class="timeline-action">' + e.phase + '</span> ' +
        e.action + ' - ' + e.agent +
        '</div>';
    }).join('');
  }

  function renderDecisions(entries) {
    const container = document.getElementById('decisions-list');
    if (!entries || entries.length === 0) {
      container.innerHTML = '<div class="empty-state">No decisions recorded yet.</div>';
      return;
    }

    container.innerHTML = entries.map(function (e) {
      return '<div class="decision-entry">' +
        '<span class="decision-timestamp">' + e.timestamp + '</span> ' +
        '<strong>' + e.agent + '</strong> (' + e.phase + ')<br>' +
        'Decided: ' + e.decided +
        (e.pillar ? '<br>Pillar: ' + e.pillar : '') +
        '</div>';
    }).join('');
  }

  // ── WebSocket ────────────────────────────────────────────────────────────
  function connectWebSocket() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(protocol + '//' + location.host);

    ws.onopen = function () {
      setConnectionStatus(true);
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    ws.onmessage = function (evt) {
      try {
        var msg = JSON.parse(evt.data);
        if (msg.event === 'state-changed') {
          fetchState();
          fetchGraph();
        } else if (msg.event === 'checkpoint-created') {
          fetchTimeline();
        }
      } catch { /* ignore */ }
    };

    ws.onclose = function () {
      setConnectionStatus(false);
      reconnectTimer = setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = function () {
      ws.close();
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text || '--';
  }

  function setConnectionStatus(connected) {
    var dot = document.getElementById('connection-status');
    if (dot) {
      dot.className = 'status-dot ' + (connected ? 'connected' : 'disconnected');
      dot.title = connected ? 'WebSocket connected' : 'WebSocket disconnected';
    }
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    }
    return el;
  }
})();
