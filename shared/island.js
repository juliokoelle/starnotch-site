/* The Starnotch island, drawn in the DOM.
   Sample data is the app's own --sample-data set (Island polish, Grace Hopper, Low Tide Lights),
   so nothing here comes from a real session.

   const isl = Island.mount(el, { assets: '../../assets/' });
   isl.set('peek' | 'compact' | 'notch' | 'panel' | 'approval' | 'capture' | 'dictate' | 'watch', { tab });
   isl.set('watch', { sneak: { icon | img, tint, title, meta } }) shows a one-line sneak under the notch.
   isl.tab('agents'); isl.effort('max'); isl.character('cat'); isl.mood('happy');
   isl.ask({ title, cmd }) -> Promise<'once' | 'session' | 'deny' | 'timeout'>
   Island.mount(el, { dims: { peek: { w, h, r } }, tabH: { agents: [h, narrowH] } }) overrides sizes (em).
*/
(function () {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

  const EFFORT = {
    low:    { lv: 'mint',   name: 'Mint',   tint: '#3ED6A0', ink: '#86e8c4' },
    medium: { lv: 'nova',   name: 'Nova',   tint: '#6E7BFF', ink: '#a9b0ff' },
    high:   { lv: 'aurora', name: 'Aurora', tint: '#E46BE0', ink: '#f2a6ee' },
    xhigh:  { lv: 'cosmo',  name: 'Cosmo',  tint: '#6A4FC8', ink: '#b3a2f5' },
    max:    { lv: 'sol',    name: 'Sol',    tint: '#FF9A3C', ink: '#ffc287' },
    ultra:  { lv: 'rose',   name: 'Rosé',   tint: '#FF6FA8', ink: '#ffa6c8' },
  };
  const LEVELS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultra'];
  const XL = {
    nova: 'neutral happy determined thinking surprised sleepy sleep joyful love peek excited confused',
    sol: 'neutral determined happy surprised joyful thinking',
    mint: 'neutral happy determined', aurora: 'neutral determined', cosmo: 'neutral determined', rose: 'neutral determined',
  };
  const ASTRA_MOOD = { working: 'determined', idle: 'neutral', waiting: 'surprised', happy: 'happy', surprised: 'surprised', sleepy: 'sleepy', sleep: 'sleep', thinking: 'thinking', joyful: 'joyful', love: 'love', peek: 'peek', excited: 'excited', confused: 'confused' };
  const CAT_MOOD = { idle: 'level-high', waiting: 'surprised', happy: 'happy', surprised: 'surprised', sleepy: 'sleepy', sleep: 'asleep', confused: 'grumpy', joyful: 'happy', love: 'happy', excited: 'surprised', peek: 'peek-max' };

  function src(base, character, effort, mood, xl) {
    if (character === 'cat') {
      let f = CAT_MOOD[mood];
      if (!f || mood === 'working' || mood === 'thinking') f = 'level-' + effort;
      if (xl && f.startsWith('level-')) return base + 'cat/' + f + '@xl.webp';
      return base + 'cat/' + f + '.webp';
    }
    const lv = EFFORT[effort].lv, st = ASTRA_MOOD[mood] || 'neutral';
    if (xl && XL[lv].split(' ').includes(st)) return base + 'astra/' + lv + '/' + st + '@xl.webp';
    return base + 'astra/' + lv + '/' + st + '.webp';
  }

  const I = {
    agents: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="6" r="2.6"/><circle cx="14" cy="6" r="2.6"/><circle cx="6" cy="14" r="2.6"/><circle cx="14" cy="14" r="2.6"/></svg>',
    today: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="5" cy="6" r="2.3"/><path d="M10 6h7M3.6 14.2l1.2 1.2 2.4-2.6M10 14h7"/></svg>',
    calendar: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.8" y="3.8" width="14.4" height="12.6" rx="2.6"/><path d="M2.8 7.6h14.4" /><path d="M6 10.6h1.4M9.3 10.6h1.4M12.6 10.6H14M6 13.4h1.4M9.3 13.4h1.4" stroke-linecap="round"/></svg>',
    music: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 15.2V4.2l7-1.4v3"/><circle cx="5.6" cy="15.2" r="2.4" fill="currentColor" stroke="none"/></svg>',
    system: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10" cy="10" r="7.2"/><path d="M10 10l3-3.2"/><path d="M6.2 12.6h.01M5.6 9h.01M7.6 6h.01M12.4 13.6h.01" stroke-width="2.2"/></svg>',
    mic: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="7.2" y="2.6" width="5.6" height="9.4" rx="2.8"/><path d="M4.6 9.6a5.4 5.4 0 0 0 10.8 0M10 15v2.4"/></svg>',
    pencil: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l.6-2.8L11 2.8l2.2 2.2-7.4 7.4z"/></svg>',
    term: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M4.6 6.4l2 1.6-2 1.6M8.4 10h3"/></svg>',
    prev: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.6 5.2v9.6L3 10zM17 5.2v9.6L10.4 10z"/></svg>',
    next: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.4 5.2v9.6L17 10zM3 5.2v9.6L9.6 10z"/></svg>',
    pause: '<svg viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="3.8" width="3.4" height="12.4" rx="1"/><rect x="11.6" y="3.8" width="3.4" height="12.4" rx="1"/></svg>',
    play: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 3.8v12.4L16.4 10z"/></svg>',
    laptop: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3.6" y="4.2" width="12.8" height="8.6" rx="1.3"/><path d="M1.8 15.6h16.4"/></svg>',
    buds: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6.6 4.2a2.6 2.6 0 0 0-2.6 2.6c0 1.6 1.2 2.6 2.6 2.6v6.4M13.4 4.2a2.6 2.6 0 0 1 2.6 2.6c0 1.6-1.2 2.6-2.6 2.6v6.4"/></svg>',
    display: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="2.4" y="3.2" width="15.2" height="10.4" rx="1.6"/><path d="M7.6 17h4.8M10 13.6V17"/></svg>',
    app: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10" rx="2.4"/></svg>',
    spotify: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.4" fill="#1ed760"/><path d="M5.6 7.6c3-1 6.6-.7 9 .8M6.2 10.4c2.5-.8 5.4-.5 7.4.7M6.8 13c2-.6 4.2-.4 5.8.6" stroke="#000" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
    hourglass: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 2.4h8M4 13.6h8M5 2.4c0 3 6 3.4 6 5.6S5 10.6 5 13.6M11 2.4c0 1-1 1.8-3 2.6"/></svg>',
    ret: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3.4v4.4a2 2 0 0 1-2 2H3.4M6 7.2 3.4 9.8 6 12.4"/></svg>',
  };

  function ring(pct, cls) {
    const r = 8, c = 2 * Math.PI * r;
    return '<svg class="ring ' + (cls || '') + '" viewBox="0 0 20 20"><circle class="bg" cx="10" cy="10" r="' + r + '"/><circle class="fg" cx="10" cy="10" r="' + r + '" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + (c * (1 - pct / 100)).toFixed(2) + '"/></svg>';
  }
  function setRing(svg, pct) {
    if (!svg) return; const fg = svg.querySelector('.fg'); const c = 2 * Math.PI * 8;
    fg.setAttribute('stroke-dashoffset', (c * (1 - pct / 100)).toFixed(2));
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const fmtMin = (m) => m < 60 ? Math.round(m) + 'm' : Math.floor(m / 60) + 'h ' + Math.round(m % 60) + 'm';

  const DIMS = {
    notch:    { w: 12.4, h: 2.13, r: .62 },
    compact:  { w: 19.5, h: 2.13, r: .62 },
    peek:     { w: 24,   h: 5.4,  r: 1.6, nw: 22 },
    watch:    { w: 23,   h: 4.4,  r: 1.5 },
    panel:    { w: 50,   h: 26.6,   r: 2.1, nw: 25.4, nh: 38 },
    approval: { w: 50,   h: 14.8, r: 2.1, nw: 25.4, nh: 20.5 },
    capture:  { w: 33,   h: 6.4,  r: 1.7, nw: 25.4, nh: 8.6 },
    dictate:  { w: 22,   h: 4.8,  r: 1.5 },
  };

  function sampleSessions() {
    return [
      { id: 's1', title: 'Island polish', project: 'notes', tool: 'C', effort: 'max', state: 'working', min: 6, step: 'Editing AgentsModule.swift', ctx: 41,
        subs: [ { t: 'Rewrite the importer', m: 'Run the tests', st: 'run' }, { t: 'Audit the docs', m: 'All fixed.', st: 'ok' } ] },
      { id: 's2', title: 'Docs refresh', project: 'notes', tool: 'C', effort: 'medium', state: 'working', min: 4, step: 'Reading README.md', ctx: 58 },
      { id: 's3', title: 'Pricing page copy', project: 'site', tool: 'Cx', effort: 'low', state: 'idle', min: 95, step: 'Done', ctx: 22 },
      { id: 's4', title: 'Tasks endpoint', project: 'api-server', tool: 'Cx', effort: 'xhigh', state: 'waiting', min: 3, step: 'Your turn', ctx: 76 },
    ];
  }

  function mount(root, opts) {
    opts = opts || {};
    const base = opts.assets || '../../assets/';
    const S = {
      state: 'notch', tab: 'agents', character: opts.character || 'astra', mood: null,
      sessions: sampleSessions(), featured: 0, usage: 62, usageLeft: 133, narrow: false,
      playing: true, songPos: 51, songLen: 194, output: 0,
      peek: { title: 'Island polish', sub: 'Editing AgentsModule.swift' },
    };
    const listeners = {};
    const emit = (n, d) => (listeners[n] || []).forEach((f) => f(d));

    root.classList.add('isl');
    root.innerHTML =
      '<div class="isl-body">' +
        '<i class="isl-ear l"></i><i class="isl-ear r"></i>' +
        '<div class="isl-fill">' +
          '<div class="isl-layer l-compact" data-l="compact"></div>' +
          '<div class="isl-layer l-peek" data-l="peek"></div>' +
          '<div class="isl-layer l-watch" data-l="watch"></div>' +
          '<div class="isl-layer l-panel" data-l="panel"></div>' +
          '<div class="isl-layer l-approval" data-l="approval"></div>' +
          '<div class="isl-layer l-capture" data-l="capture"></div>' +
          '<div class="isl-layer l-dictate" data-l="dictate"></div>' +
        '</div>' +
        (opts.interactive ? '<button class="isl-hit" type="button" aria-label="Open the island"></button>' : '') +
      '</div>';
    const body = root.querySelector('.isl-body');
    const fill = root.querySelector('.isl-fill');
    const L = {}; root.querySelectorAll('.isl-layer').forEach((l) => { L[l.dataset.l] = l; l.inert = true; });

    /* spring for the shape */
    const cur = { w: 12.4, h: 2.13, r: .62 }, vel = { w: 0, h: 0, r: 0 };
    let tgt = { ...cur }, raf = 0, last = 0;
    function apply() {
      body.style.width = cur.w + 'em'; body.style.height = cur.h + 'em';
      fill.style.setProperty('--isl-r', Math.max(.3, cur.r) + 'em');
    }
    function step(t) {
      const dt = Math.min(1 / 30, (t - last) / 1000 || 1 / 60); last = t;
      let moving = false;
      for (const k of ['w', 'h', 'r']) {
        const k1 = 260, d = 26; // stiffness, damping: a small overshoot, settles in ~450 ms
        const a = -k1 * (cur[k] - tgt[k]) - d * vel[k];
        vel[k] += a * dt; cur[k] += vel[k] * dt;
        if (Math.abs(cur[k] - tgt[k]) > .005 || Math.abs(vel[k]) > .01) moving = true; else { cur[k] = tgt[k]; vel[k] = 0; }
      }
      apply();
      raf = moving ? requestAnimationFrame(step) : 0;
    }
    function shapeTo(d) {
      tgt = { w: d.w, h: d.h, r: d.r };
      if (REDUCED.matches || opts.instant) { Object.assign(cur, tgt); apply(); return; }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    }
    const TAB_H = Object.assign({ agents: [30.4, 35], today: [19, 31], calendar: [26.6, 40], music: [15.6, 26], system: [26.6, 36] }, opts.tabH);
    const SIZES = Object.assign({}, DIMS, opts.dims); // a page may pass the app's real sizes
    function dims(state) {
      const d = SIZES[state];
      const o = S.narrow ? { w: d.nw || d.w, h: d.nh || d.h, r: d.r } : { w: d.w, h: d.h, r: d.r };
      if (state === 'panel' && TAB_H[S.tab]) o.h = TAB_H[S.tab][S.narrow ? 1 : 0];
      if (L.panel) L.panel.style.height = (state === 'panel' ? o.h : (TAB_H[S.tab] || [26.6, 38])[S.narrow ? 1 : 0]) + 'em';
      return o;
    }
    function measure() {
      const fs = parseFloat(getComputedStyle(root).fontSize) || 15;
      const avail = (opts.widthEl || root.parentElement).clientWidth;
      const n = opts.narrow != null ? opts.narrow : avail < 46.5 * fs;
      if (n !== S.narrow) { S.narrow = n; root.classList.toggle('narrow', n); shapeTo(dims(S.state)); render(); }
    }

    /* characters */
    const featured = () => S.sessions[S.featured];
    function moodOf(s) { return s === featured() && S.mood ? S.mood : (s.state === 'idle' && s.min > 60 ? 'sleepy' : s.state); }
    function chImg(s, xl, mood) { return '<span class="ch-wrap"><img class="ch" alt="" src="' + src(base, S.character, s.effort, mood || moodOf(s), xl) + '"></span>'; }
    function swapImg(wrap, url) {
      if (!wrap) return; const img = wrap.querySelector('img');
      if (!img || img.getAttribute('src') === url) return;
      const pre = new Image(); pre.onload = () => { img.src = url; }; pre.src = url;
    }

    function rowMeta(s) {
      const st = s.state === 'working' ? 'working ' + fmtMin(s.min) : s.state === 'waiting' ? 'your turn · ' + fmtMin(s.min) : 'idle ' + fmtMin(s.min);
      return s.project + ' · ' + st + ' · ' + s.effort;
    }
    function ctxColor(p) { return p >= 85 ? 'var(--crit)' : p >= 70 ? 'var(--wait)' : 'rgba(255,255,255,.6)'; }

    function renderCompact() {
      const s = featured();
      L.compact.innerHTML = chImg(s) + '<span class="badge"><span class="mini"><img alt="" src="' + src(base, S.character, 'low', 'idle') + '"></span><b>' + (S.sessions.length - 1) + '</b></span>';
    }
    function renderPeek() {
      const s = featured();
      L.peek.innerHTML = chImg(s, false, S.peek.mood) + '<div class="tx"><div class="t">' + esc(S.peek.title) + '</div><div class="s">' + esc(S.peek.sub) + '</div></div>' +
        '<span class="badge"><span class="mini"><img alt="" src="' + src(base, S.character, 'low', 'idle') + '"></span><b>' + (S.sessions.length - 1) + '</b></span>';
    }
    function renderWatch() {
      const n = S.sneak;
      L.watch.innerHTML = n
        ? '<span class="sn-row"><span class="sn-ic' + (n.img ? ' img' : '') + '" style="--tint:' + n.tint + '">' + (n.img ? '<img alt="" src="' + base + n.img + '">' : I[n.icon] || '') + '</span><b>' + esc(n.title) + '</b>' + (n.meta ? '<span class="meta">' + esc(n.meta) + '</span>' : '') + '</span>'
        : '<span class="dot"></span><span>' + esc(S.watchText || '1 update while you watched') + '</span>';
    }

    const TABS = [
      ['agents', 'Agents', () => S.sessions.length], ['today', 'Today', () => 4], ['calendar', 'Calendar'], ['music', 'Now playing'], ['system', 'System'], ['dictate', 'Dictate'],
    ];
    function renderPanel() {
      const tabs = TABS.map(([id, label, n]) =>
        '<button class="p-tab" type="button" role="tab" data-tab="' + id + '" aria-label="' + label + '" aria-selected="' + (S.tab === id) + '">' + I[id === 'dictate' ? 'mic' : id] + (n ? '<span>' + n() + '</span>' : '') + '</button>').join('');
      L.panel.innerHTML =
        '<div class="p-top"><div class="p-tabs" role="tablist" aria-label="Modules">' + tabs + '</div>' +
        '<div class="p-usage">' + ring(S.usage, 'u') + '<span class="num"><span class="u-pct">5 h ' + S.usage + ' %</span><span class="lbl-long"> · <span class="u-left">' + fmtMin(S.usageLeft).replace('h ', ' h ').replace('m', ' m') + '</span> left</span></span></div></div>' +
        '<div class="p-views">' +
          '<div class="p-view v-agents" data-v="agents"></div>' +
          '<div class="p-view v-today" data-v="today"></div>' +
          '<div class="p-view v-cal" data-v="calendar"></div>' +
          '<div class="p-view v-music" data-v="music"></div>' +
          '<div class="p-view v-sys" data-v="system"></div>' +
        '</div>';
      renderAgents(); renderToday(); renderCal(); renderMusic(); renderSys();
      showTab(S.tab, true);
    }
    function heroHTML() {
      const s = featured(), e = EFFORT[s.effort];
      const subs = s.subs ? '<div class="sub">' + s.subs.length + ' subagents · ' + s.subs.filter((x) => x.st === 'run').length + ' running</div>' : '';
      return '<span class="glow"></span>' + chImg(s, true) +
        '<div class="tx"><div class="t">' + esc(s.title) + ' <span class="tool">' + s.tool + '</span></div>' +
        '<div class="m num">' + rowMeta(s) + '</div>' + subs +
        '<div class="step">' + (s.state === 'working' ? I.pencil : I.term) + '<span>' + esc(s.step) + '</span></div></div>';
    }
    function renderAgents() {
      const v = L.panel.querySelector('.v-agents'); if (!v) return;
      const rows = S.sessions.map((s, i) => {
        if (i === S.featured) return '';
        const e = EFFORT[s.effort];
        return '<button class="row" type="button" data-i="' + i + '" style="--row-bg:' + e.tint + '1f;--row-ink:' + e.ink + '">' + chImg(s) +
          '<span class="tx"><span class="t">' + esc(s.title) + ' <span class="tool">' + s.tool + '</span></span><span class="m">' + rowMeta(s) + '</span></span>' +
          '<span class="ctx" style="--ctx-c:' + ctxColor(s.ctx) + '">' + ring(s.ctx) + '<span>ctx ' + s.ctx + ' %</span></span></button>';
      }).join('');
      const f = featured();
      const subs = f.subs ? f.subs.map((x) => '<div class="sub-row"><span class="br"></span>' + chImg(f, false, x.st === 'ok' ? 'happy' : 'working') +
        '<span class="tx"><div class="t">' + esc(x.t) + '<small>subagent</small></div><div class="m">' + esc(x.m) + '</div></span><span class="st ' + (x.st === 'ok' ? 'ok' : '') + '">' + (x.st === 'ok' ? '&#10003;' : '&bull;&bull;&bull;') + '</span></div>').join('') : '';
      v.innerHTML = '<div class="card a-hero" style="--tint-glow:' + EFFORT[f.effort].tint + '55">' + heroHTML() + '</div>' +
        '<div class="card a-list">' + (S.narrow ? '' : subs) + rows +
        '<div class="loops"><span>Loops</span><i class="lp run"></i><i class="lp"></i><i class="lp"></i><i class="lp"></i><span class="next num">next 15:00</span></div></div>';
    }
    function renderToday() {
      const v = L.panel.querySelector('.v-today'); if (!v) return;
      v.innerHTML = '<div class="card"><div class="lbl">Up next</div>' +
        '<div class="task"><i></i><span>Send the press kit</span><em>today</em></div>' +
        '<div class="task"><i></i><span>Review the pricing copy</span></div>' +
        '<div class="task done"><i></i><span>Book the venue</span></div>' +
        '<div class="task"><i></i><span>Reply to Alan about Friday</span></div></div>' +
        '<div class="card"><div class="lbl">Brief</div><p class="brief">Two agents are working, one waits for you. Intro call with Grace at 16:00; she still owes the contract draft.</p></div>';
    }
    function renderCal() {
      const v = L.panel.querySelector('.v-cal'); if (!v) return;
      const x = (h) => ((h - 8) / 14 * 100).toFixed(2) + '%';
      const hrs = [8, 10, 12, 14, 16, 18, 20, 22];
      const ev = (a, b, cls, c, bg, label) => '<span class="ev ' + cls + '" style="left:' + x(a) + ';width:calc(' + ((b - a) / 14 * 100).toFixed(2) + '% - .3em);--evc:' + c + ';--ev:' + bg + '">' + (label ? '<span class="ev-l" style="top:-1.25em">' + label + '</span>' : '') + '</span>';
      v.innerHTML = '<div class="card band"><div class="band-track">' + hrs.map((h) => '<i class="hr" style="left:' + x(h) + '"></i>').join('') +
        ev(9.5, 11.2, 'focus', '', '', '') + ev(12.5, 13, '', '#8f76f6', '#26243f', '') + ev(16, 16.5, 'next', '#e674a8', '#3a2533', 'Intro call') + ev(18.5, 19.6, '', '#8f76f6', '#26243f', '') + ev(20, 20.8, '', '#f3a23f', '#3a2c1b', '') +
        '<span class="nowline" style="left:' + x(13.67) + '"></span></div>' +
        '<div class="band-hours">' + hrs.map((h) => '<span style="left:' + x(h) + '">' + String(h).padStart(2, '0') + '</span>').join('') + '</div></div>' +
        '<div class="card day"><div class="dh">Thursday<span>22 October</span></div><div class="agenda">' +
          '<div class="ag"><span class="tm">12:30</span><span class="agb"></span><span class="nm">Design review</span></div>' +
          '<div class="ag free"><span class="tm">13:40</span><span class="agb"></span><span class="nm">free until 16:00</span></div>' +
          '<div class="ag sel" style="--evc:#e674a8"><span class="tm">16:00</span><span class="agb"></span><span class="nm">Intro call</span></div>' +
          '<div class="ag"><span class="tm">18:30</span><span class="agb"></span><span class="nm">Planning with Alan</span></div>' +
          '<div class="ag" style="--evc:#f3a23f"><span class="tm">20:00</span><span class="agb"></span><span class="nm">Family dinner</span></div>' +
        '</div></div>' +
        '<div class="card meet"><div class="t">Intro call</div><div class="m">16:00–16:30 · in 2 h 20 min · Zoom</div><hr>' +
          '<div class="person"><span class="av">GH</span><div><b>Grace Hopper</b> <span>Founder · Compiler Co</span><br><span>Last 02.10. · Intro by mail</span></div></div>' +
          '<div class="waiting"><span class="w">' + I.hourglass.replace('<svg', '<svg width="15" height="15"') + '</span><span style="color:var(--isl-t2)">Waiting</span><span>contract draft</span><em>today</em></div>' +
          '<button class="join" type="button">Join ' + I.ret.replace('<svg', '<svg width="15" height="15"') + '</button></div>';
    }
    const OUTPUTS = [['MacBook Pro Speakers', 'laptop'], ['AirPods Pro', 'buds'], ['Studio Display', 'display']];
    function renderMusic() {
      const v = L.panel.querySelector('.v-music'); if (!v) return;
      v.innerHTML = '<div class="card music"><div style="position:relative"><div class="cover"></div><span class="src">' + I.spotify.replace('<svg', '<svg width="20" height="20"') + '</span></div>' +
        '<div><div class="t">Low Tide Lights</div><div class="a">Ola Brenn</div>' +
        '<div class="prog"><i style="--p:' + (S.songPos / S.songLen).toFixed(3) + '"></i></div><div class="times num"><span class="t0">0:51</span><span class="t1">-2:23</span></div>' +
        '<div class="ctrls"><button type="button" aria-label="Previous">' + I.prev + '</button><button type="button" class="pp" aria-label="Pause">' + (S.playing ? I.pause : I.play) + '</button><button type="button" aria-label="Next">' + I.next + '</button>' +
        '<span class="vol" aria-hidden="true"><i></i><b></b></span>' +
        '<span class="out"><button type="button" class="out-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Output: ' + OUTPUTS[S.output][0] + '">' + I[OUTPUTS[S.output][1]] + '</button>' +
        '<div class="out-list" role="listbox" aria-label="Output">' + OUTPUTS.map((o, i) => '<button type="button" role="option" data-o="' + i + '" aria-selected="' + (i === S.output) + '">' + I[o[1]] + '<span>' + o[0] + '</span></button>').join('') + '</div></span>' +
        '</div></div></div>';
    }
    function spark(seed, n) {
      let p = 'M0 ' + (20 - seed[0]); for (let i = 1; i < n; i++) p += ' L' + (i * 100 / (n - 1)).toFixed(1) + ' ' + (20 - seed[i % seed.length]).toFixed(1); return p;
    }
    let cpuHist = [6, 7, 8, 7, 6, 6, 7, 9, 8, 7, 7, 14, 13, 12, 11, 11, 12, 11];
    function renderSys() {
      const v = L.panel.querySelector('.v-sys'); if (!v) return;
      const apps = [['Xcode', 3, 42, '3.2 GB'], ['Claude Code', 4, 31, '1.2 GB'], ['Safari', 9, 12, '2.1 GB'], ['Music', 0, 4, '380 MB'], ['WindowServer', 0, 3, '900 MB']];
      v.innerHTML = '<div class="card gauge"><div class="lbl">CPU <span>12 cores</span></div><div class="v num g-cpu">45 %</div><svg class="spark" viewBox="0 0 100 20" preserveAspectRatio="none"><path class="sp-cpu" d="' + spark(cpuHist, cpuHist.length) + '"/></svg></div>' +
        '<div class="card gauge"><div class="lbl">GPU</div><div class="v num">10 %</div><svg class="spark" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="' + spark([4, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4], 12) + '"/></svg></div>' +
        '<div class="card gauge"><div class="lbl">Memory <span style="color:var(--ok)">Normal</span></div><div class="v num">15 GB <small>of 24 GB</small></div></div>' +
        '<div class="card apps"><div class="lbl">Top apps</div>' + apps.slice(0, S.narrow ? 4 : 5).map((a) => '<div class="app"><span class="ic">' + I.app + '</span><span class="n">' + a[0] + (a[1] ? '<small>' + a[1] + '</small>' : '') + '</span><span class="c">' + a[2] + ' %</span><span class="g">' + a[3] + '</span></div>').join('') + '</div>';
    }

    function showTab(id, instant) {
      if (id === 'dictate') { set('dictate'); return; }
      const order = TABS.map((t) => t[0]);
      const prev = S.tab; S.tab = id;
      L.panel.querySelectorAll('.p-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
      L.panel.querySelectorAll('.p-view').forEach((v) => {
        const on = v.dataset.v === id;
        // direction-aware: new view slides in from the side of travel
        if (on && !instant) v.style.setProperty('--dx', (order.indexOf(id) >= order.indexOf(prev) ? 1 : -1) * .8 + 'em');
        else if (!on) v.style.setProperty('--dx', (order.indexOf(v.dataset.v) > order.indexOf(id) ? 1 : -1) * .8 + 'em');
        v.classList.toggle('on', on);
      });
      if (S.state === 'panel') shapeTo(dims('panel'));
      emit('tab', id);
    }

    let askResolve = null, askTimer = 0;
    function renderApproval(q) {
      const s = S.sessions[q.i != null ? q.i : S.featured];
      L.approval.innerHTML = '<div class="card ap">' + chImg(s, true, 'surprised') +
        '<div><div class="t">' + esc(q.title) + ' wants to run</div><pre>' + esc(q.cmd) + '</pre>' +
        '<div class="ap-btns"><button class="ap-btn once" type="button" data-a="once">Allow once <kbd>&#8629;</kbd></button>' +
        (q.codex ? '' : '<button class="ap-btn sess" type="button" data-a="session">Allow for session <kbd>&#8984;&#8629;</kbd></button>') +
        '<button class="ap-btn deny" type="button" data-a="deny">Deny <kbd>esc</kbd></button></div>' +
        '<div class="ap-note"><span class="ap-timer"><i></i></span>Unanswered, the terminal asks after 60 s.</div></div></div>';
    }
    function answer(a) {
      if (!askResolve) return;
      const r = askResolve; askResolve = null; clearTimeout(askTimer);
      r(a); emit('answer', a);
    }

    function renderCapture() {
      L.capture.innerHTML = '<div class="cap"><span class="txt"></span><span class="k"><kbd class="k">&#8963;</kbd> <kbd class="k">&#8997;</kbd> <kbd class="k">N</kbd></span></div>';
    }
    function renderDictate() {
      const hs = [.5, .9, .65, 1, .7, .45, .85, .6, .95, .5, .75, .4];
      L.dictate.innerHTML = '<span class="wave">' + hs.map((h, i) => '<i style="--h:' + h + ';animation-delay:' + (i * 70) + 'ms"></i>').join('') + '</span><span class="t">Listening</span><span class="s">Wispr Flow</span>';
    }

    function render() {
      renderCompact(); renderPeek(); renderWatch(); renderPanel(); renderCapture(); renderDictate();
      if (S.lastAsk) renderApproval(S.lastAsk);
    }

    function set(state, o) {
      o = o || {};
      if (o.peek) S.peek = Object.assign({}, S.peek, o.peek), renderPeek();
      if (o.watch) S.watchText = o.watch, S.sneak = null, renderWatch();
      if (o.sneak) S.sneak = o.sneak, renderWatch();
      if (state === S.state && !o.tab) return;
      S.state = state;
      Object.entries(L).forEach(([k, l]) => { l.classList.toggle('on', k === state); l.inert = k !== state; });
      root.classList.toggle('is-open', state === 'panel' || state === 'approval' || state === 'capture');
      root.dataset.state = state;
      if (state === 'panel' && o.tab) showTab(o.tab);
      shapeTo(dims(state));
      emit('state', state);
    }

    /* events inside the island */
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (t) { showTab(t.dataset.tab); return; }
      const r = e.target.closest('.row[data-i]'); if (r) { S.featured = +r.dataset.i; S.mood = null; renderAgents(); emit('featured', featured()); return; }
      const a = e.target.closest('.ap-btn'); if (a) { answer(a.dataset.a); return; }
      const ob = e.target.closest('.out-btn');
      const ol = L.panel.querySelector('.out-list');
      if (ob) { const on = !ol.classList.contains('on'); ol.classList.toggle('on', on); ob.setAttribute('aria-expanded', String(on)); if (on) ol.querySelector('[aria-selected="true"]').focus(); return; }
      const oo = e.target.closest('.out-list [data-o]'); if (oo) { S.output = +oo.dataset.o; renderMusic(); return; }
      if (ol && ol.classList.contains('on')) { ol.classList.remove('on'); }
      const pp = e.target.closest('.pp'); if (pp) { S.playing = !S.playing; pp.innerHTML = S.playing ? I.pause : I.play; pp.setAttribute('aria-label', S.playing ? 'Pause' : 'Play'); return; }
      if (e.target.closest('.isl-hit')) emit('hit');
    });
    root.addEventListener('keydown', (e) => {
      const tabs = [...L.panel.querySelectorAll('.p-tab')];
      const i = tabs.indexOf(document.activeElement);
      if (i >= 0 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault(); const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click();
      }
      if (e.key === 'Escape') { const ol = L.panel.querySelector('.out-list.on'); if (ol) { ol.classList.remove('on'); e.stopPropagation(); } }
    });

    /* live ticking */
    let tickN = 0;
    const tick = setInterval(() => {
      if (document.hidden) return;
      tickN++;
      S.songPos = S.playing ? (S.songPos + 1) % S.songLen : S.songPos;
      const pr = L.panel.querySelector('.prog i');
      if (pr) { pr.style.setProperty('--p', (S.songPos / S.songLen).toFixed(3)); const t0 = L.panel.querySelector('.t0'), t1 = L.panel.querySelector('.t1'); const f = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); t0.textContent = f(S.songPos); t1.textContent = '-' + f(S.songLen - S.songPos); }
      if (tickN % 4 === 0) {
        cpuHist = cpuHist.slice(1).concat([Math.max(3, Math.min(17, cpuHist[cpuHist.length - 1] + (Math.random() * 4 - 2)))]);
        const sp = L.panel.querySelector('.sp-cpu'); if (sp) sp.setAttribute('d', spark(cpuHist, cpuHist.length));
        const g = L.panel.querySelector('.g-cpu'); if (g) g.textContent = Math.round(cpuHist[cpuHist.length - 1] * 3.2) + ' %';
      }
      if (tickN % 6 === 0) {
        S.sessions.forEach((s) => { if (s.state === 'working') s.ctx = Math.min(96, s.ctx + 1); });
        if (S.usage < 88) S.usage += 1;
        setRing(L.panel.querySelector('.p-usage .ring'), S.usage);
        const up = L.panel.querySelector('.u-pct'); if (up) up.textContent = '5 h ' + S.usage + ' %';
        L.panel.querySelectorAll('.row').forEach((r) => {
          const s = S.sessions[+r.dataset.i]; const c = r.querySelector('.ctx');
          setRing(c.querySelector('.ring'), s.ctx); c.style.setProperty('--ctx-c', ctxColor(s.ctx)); c.querySelector('span').textContent = 'ctx ' + s.ctx + ' %';
        });
      }
    }, 1000);

    const api = {
      el: root, S, EFFORT, LEVELS,
      set,
      tab: (t) => { if (S.state !== 'panel') set('panel', { tab: t }); else showTab(t); },
      on: (n, f) => ((listeners[n] = listeners[n] || []).push(f), api),
      mood(m) {
        S.mood = m;
        const s = featured();
        root.querySelectorAll('.l-compact .ch-wrap, .l-peek .ch-wrap').forEach((w) => swapImg(w, src(base, S.character, s.effort, m || moodOf(s))));
        swapImg(root.querySelector('.a-hero .ch-wrap'), src(base, S.character, s.effort, m || moodOf(s), true));
        return api;
      },
      effort(lv, i) {
        const s = S.sessions[i == null ? S.featured : i]; s.effort = lv;
        renderCompact(); renderPeek(); renderAgents(); emit('effort', lv); return api;
      },
      character(c) { S.character = c; render(); Object.entries(L).forEach(([k, l]) => l.classList.toggle('on', k === S.state)); emit('character', c); return api; },
      featured: (i) => { S.featured = i; renderAgents(); renderCompact(); renderPeek(); return api; },
      ask(q) {
        S.lastAsk = q; renderApproval(q); set('approval');
        if (askResolve) answer('replaced');
        return new Promise((res) => {
          askResolve = res;
          const bar = L.approval.querySelector('.ap-timer i');
          const ms = q.timeout || 60000;
          if (bar && !REDUCED.matches) bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: ms, easing: 'linear', fill: 'forwards' });
          askTimer = setTimeout(() => answer('timeout'), ms);
        });
      },
      answer,
      asking: () => !!askResolve,
      async type(text, marks, speed) {
        const el = L.capture.querySelector('.txt'); el.innerHTML = '';
        const caret = '<span class="caret"></span>';
        for (let i = 1; i <= text.length; i++) {
          let s = esc(text.slice(0, i));
          (marks || []).forEach(([w, cls]) => { if (text.slice(0, i).includes(w)) s = s.replace(esc(w), '<span class="tok ' + cls + '">' + esc(w) + '</span>'); });
          el.innerHTML = s + caret;
          if (!REDUCED.matches) await new Promise((r) => setTimeout(r, speed || 42));
        }
      },
      measure,
      destroy() { clearInterval(tick); cancelAnimationFrame(raf); },
    };

    render();
    measure();
    addEventListener('resize', measure);
    set(opts.state || 'notch');
    return api;
  }

  window.Island = { mount, EFFORT, LEVELS, src };
})();
