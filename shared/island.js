/* The Starnotch island, drawn in the DOM.
   Sample data is the app's own --sample-data set (Island polish, Grace Hopper, Low Tide Lights),
   so nothing here comes from a real session.

   const isl = Island.mount(el, { assets: '../../assets/' });
   isl.set('peek' | 'compact' | 'notch' | 'panel' | 'approval' | 'question' | 'prompter' | 'capture' | 'dictate' | 'watch' | 'inbox' | 'palette', { tab });
   isl.set('watch', { sneak: { icon | img, tint, title, meta } }) shows a one-line sneak under the notch.
   isl.tab('agents'); isl.effort('max'); isl.character('cat'); isl.mood('happy'); isl.hover(true) grows Tara alone.
   isl.ask({ title, cmd }) -> Promise<'once' | 'session' | 'deny' | 'instead' | 'timeout'>
   isl.question({ title, header, text, options: [[label, detail]] }) -> Promise<label | 'terminal' | 'timeout'>
   isl.inbox({ i, mood, title, text, opts }, pos, total) -> Promise<picked option | 'next' | 'timeout'>
   isl.search(query, rows) types into the palette; isl.askTara(question, answer, sources) floats Tara out.
   isl.prompter(text, alive) reads a script in the band under the notch; isl.cal('calendar', i) picks an event.
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
    alltools: '<svg viewBox="0 0 20 20" fill="currentColor">' + [3.2, 8.2, 13.2].map((y) => [3.2, 8.2, 13.2].map((x) => '<rect x="' + x + '" y="' + y + '" width="3.6" height="3.6" rx="1"/>').join('')).join('') + '</svg>',
    plus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 4.5v11M4.5 10h11"/></svg>',
    shuffle: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h2.6c1.4 0 2.3.6 3 1.7l2.8 4.6c.7 1.1 1.6 1.7 3 1.7H17M3 14h2.6c1.4 0 2.3-.6 3-1.7M11.4 7.7c.7-1.1 1.6-1.7 3-1.7H17M15 4l2 2-2 2M15 12l2 2-2 2"/></svg>',
    repeat: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V8a2.6 2.6 0 0 1 2.6-2.6H16M13.6 3 16 5.4l-2.4 2.4M16 11v1a2.6 2.6 0 0 1-2.6 2.6H4M6.4 17 4 14.6l2.4-2.4"/></svg>',
    star: '<svg viewBox="0 0 20 20"><path d="m10 2.8 2.2 4.5 5 .7-3.6 3.5.9 4.9-4.5-2.3-4.5 2.3.9-4.9L2.8 8l5-.7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    car: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3.4 13.6V10l1.7-4.2c.2-.6.8-1 1.4-1h7c.6 0 1.2.4 1.4 1l1.7 4.2v3.6zM3.4 10h13.2M4.8 13.6v1.6M15.2 13.6v1.6"/></svg>',
    cmd: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7.4 7.4h5.2v5.2H7.4zM7.4 7.4V5.6a1.8 1.8 0 1 0-1.8 1.8h1.8M12.6 7.4V5.6a1.8 1.8 0 1 1 1.8 1.8h-1.8M7.4 12.6v1.8a1.8 1.8 0 1 1-1.8-1.8h1.8M12.6 12.6v1.8a1.8 1.8 0 1 0 1.8-1.8h-1.8"/></svg>',
    bubble: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 4.4h9.6v6.4H7.4L4.6 13v-2.2H3z"/><path d="M14.6 7.6H17v6.2h-1.6V16l-2.8-2.2H8.4v-1"/></svg>',
    video: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="2.6" y="5.4" width="10.4" height="9.2" rx="2"/><path d="m13 9 4.4-2.6v7.2L13 11"/></svg>',
    camera: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="8.4" r="5"/><circle cx="10" cy="8.4" r="1.8"/><path d="M7 16.6h6M10 13.4v3.2"/></svg>',
    plusc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M10 7v6M7 10h6"/></svg>',
    people: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="7.4" cy="7" r="2.6"/><path d="M2.6 16c.4-2.6 2.4-4.2 4.8-4.2s4.4 1.6 4.8 4.2"/><circle cx="13.6" cy="7.6" r="2.1"/><path d="M14 11.8c1.9.2 3.2 1.6 3.5 3.6"/></svg>',
    lines: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3.5 5h13M3.5 8.4h9M3.5 11.8h13M3.5 15.2h7"/></svg>',
    timer: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="11" r="6.2"/><path d="M10 11V7.8M8 2.6h4"/></svg>',
    down: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M10 6.4v7M7.2 10.6 10 13.4l2.8-2.8"/></svg>',
    cup: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.6h9.6v4a4 4 0 0 1-4 4h-1.6a4 4 0 0 1-4-4zM13.6 9h1.2a1.9 1.9 0 0 1 0 3.8h-1.4M7 2.8v2.4M10 2.8v2.4"/></svg>',
    gear: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="2.6"/><path d="M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.8 4.8l1.4 1.4M13.8 13.8l1.4 1.4M4.8 15.2l1.4-1.4M13.8 6.2l1.4-1.4"/></svg>',
    voice: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 8v4M7 5v10M10 7v6M13 4v12M16 8v4"/></svg>',
    close: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m5 5 10 10M15 5 5 15"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4"/></svg>',
    save: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v9M6.6 8.8 10 12.2l3.4-3.4M4 12.6V16h12v-3.4"/></svg>',
    hourglass: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 2.4h8M4 13.6h8M5 2.4c0 3 6 3.4 6 5.6S5 10.6 5 13.6M11 2.4c0 1-1 1.8-3 2.6"/></svg>',
    tools: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="4.4" y="3.8" width="11.2" height="13.4" rx="2.2"/><path d="M7.8 3.8V3.2c0-.6.4-1 1-1h2.4c.6 0 1 .4 1 1v.6M7.4 9h5.2M7.4 12.2h3.4" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.8" cy="8.8" r="5.4"/><path d="m12.8 12.8 4 4"/></svg>',
    inbox: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 11.4 5.2 4.6h9.6l2.2 6.8v4H3z"/><path d="M3 11.4h4.2l1 1.8h3.6l1-1.8H17"/></svg>',
    file: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M4 1.8h5.2L12.4 5v9.2H4z"/><path d="M9 1.8V5.2h3.4"/></svg>',
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
    question: { w: 50,   h: 20.1, r: 2.1, nw: 25.4, nh: 28 },
    prompter: { w: 50,   h: 9.5,  r: 2.1, nw: 25.4, nh: 11 },
    capture:  { w: 33,   h: 6.4,  r: 1.7, nw: 25.4, nh: 8.6 },
    dictate:  { w: 22,   h: 4.8,  r: 1.5 },
    inbox:    { w: 50,   h: 15.4, r: 2.1, nw: 25.4, nh: 21 },
    palette:  { w: 50,   h: 16.6, r: 2.1, nw: 25.4, nh: 19 },
  };
  /* now playing opens the compact panel (520 pt of the large one's 640), as in the app; the clipboard opens the large one */
  const COMPACT = { music: 1 };
  const WIDE = { approval: 1, question: 1, prompter: 1, inbox: 1, palette: 1 };

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
      playing: true, songPos: 51, songLen: 194, output: 0, shuffle: true, repeat: 'all', fav: true,
      calSeg: 'today', calSel: 2, done: { 2: true }, toolTab: 'clipboard', off: new Set(['applenotes', 'meeting', 'downloads']),
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
          '<div class="isl-layer l-question" data-l="question"></div>' +
          '<div class="isl-layer l-prompter" data-l="prompter"></div>' +
          '<div class="isl-layer l-capture" data-l="capture"></div>' +
          '<div class="isl-layer l-dictate" data-l="dictate"></div>' +
          '<div class="isl-layer l-inbox" data-l="inbox"></div>' +
          '<div class="isl-layer l-palette" data-l="palette"></div>' +
        '</div>' +
        (opts.interactive ? '<button class="isl-hit" type="button" aria-label="Open the island"></button>' : '') +
      '</div>' +
      '<div class="isl-float" aria-hidden="true"></div>';
    const body = root.querySelector('.isl-body');
    const float = root.querySelector('.isl-float');
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
    /* every large tab opens at one height, so switching tabs never resizes the island */
    const TAB_H = Object.assign({ agents: [26.6, 35], calendar: [26.6, 40], music: [15.6, 28], system: [26.6, 36], tools: [26.6, 30], alltools: [26.6, 36] }, opts.tabH);
    const SIZES = Object.assign({}, DIMS, opts.dims); // a page may pass the app's real sizes
    function dims(state) {
      const d = SIZES[state];
      const o = S.narrow ? { w: d.nw || d.w, h: d.nh || d.h, r: d.r } : { w: d.w, h: d.h, r: d.r };
      if (state === 'panel' && TAB_H[S.tab]) o.h = TAB_H[S.tab][S.narrow ? 1 : 0];
      if (state === 'panel' && COMPACT[S.tab] && !S.narrow) o.w = +(o.w * 520 / 640).toFixed(3);
      if (L.panel && state === 'panel') L.panel.style.width = S.narrow ? '' : o.w + 'em';
      // the cards take the island's own width, so a page's real sizes never clip their edges
      if (WIDE[state] && L[state]) L[state].style.width = S.narrow ? '' : o.w + 'em';
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
    /* no amber in the notch: a high value is brighter, only a critical one is red */
    function ctxColor(p) { return p >= 85 ? 'var(--crit)' : p >= 70 ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.6)'; }

    function renderCompact() {
      const s = featured();
      L.compact.innerHTML = chImg(s) + '<span class="badge"><span class="mini"><img alt="" src="' + src(base, S.character, 'low', 'idle') + '"></span><b>' + (S.sessions.length - 1) + '</b></span>';
    }
    function renderPeek() {
      const s = S.peek.i != null ? S.sessions[S.peek.i] : featured();
      L.peek.innerHTML = chImg(s, false, S.peek.mood) + '<div class="tx"><div class="t">' + esc(S.peek.title) + '</div><div class="s">' + esc(S.peek.sub) + '</div></div>' +
        '<span class="badge"><span class="mini"><img alt="" src="' + src(base, S.character, 'low', 'idle') + '"></span><b>' + (S.sessions.length - 1) + '</b></span>';
    }
    function renderWatch() {
      const n = S.sneak;
      L.watch.innerHTML = n
        ? '<span class="sn-row"><span class="sn-ic' + (n.img ? ' img' : '') + '" style="--tint:' + n.tint + '">' + (n.img ? '<img alt="" src="' + base + n.img + '">' : I[n.icon] || '') + '</span><b>' + esc(n.title) + '</b>' + (n.meta ? '<span class="meta">' + esc(n.meta) + '</span>' : '') + '</span>'
        : '<span class="dot"></span><span>' + esc(S.watchText || '1 update while you watched') + '</span>';
    }

    /* the app's tab order with its defaults: Today sits in the Calendar tab, All tools is always last */
    const TABS = [
      ['agents', 'Agents', () => S.sessions.length], ['calendar', 'Calendar'], ['music', 'Now playing'], ['system', 'System'], ['dictate', 'Dictate'], ['tools', 'Tools'], ['alltools', 'All tools'],
    ];
    function renderPanel() {
      const tabs = TABS.map(([id, label, n]) =>
        '<button class="p-tab" type="button" role="tab" data-tab="' + id + '" aria-label="' + label + '" aria-selected="' + (S.tab === id) + '">' + I[id === 'dictate' ? 'mic' : id] + (n ? '<span class="n">' + n() + '</span>' : '') + '</button>').join('');
      L.panel.innerHTML =
        '<div class="p-top"><div class="p-tabs" role="tablist" aria-label="Modules">' + tabs + '</div>' +
        '<button class="p-tab p-plus" type="button" data-plus aria-label="Quick capture">' + I.plus + '</button>' +
        '<div class="p-usage" title="Claude: 5-hour limit">' + ring(S.usage, 'u') + '<span class="u-name">Claude</span><span class="u-full num">full 16:40</span><span class="u-pct num">' + S.usage + ' %</span></div></div>' +
        '<div class="p-views">' +
          '<div class="p-view v-agents" data-v="agents"></div>' +
          '<div class="p-view v-cal" data-v="calendar"></div>' +
          '<div class="p-view v-music" data-v="music"></div>' +
          '<div class="p-view v-sys" data-v="system"></div>' +
          '<div class="p-view v-tools" data-v="tools"></div>' +
          '<div class="p-view v-all" data-v="alltools"></div>' +
        '</div>';
      renderAgents(); renderCal(); renderMusic(); renderSys(); renderTools(); renderAll();
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
    /* the calendar tab: Today and Calendar are one switch in its header, Today first */
    const NOW = 13 + 40 / 60;
    const EVENTS = [
      { a: 12.5, b: 13, name: 'Design review', c: '#8f76f6', bg: '#26243f', where: 'Google Meet', call: 1 },
      { a: 13.67, free: 1, name: 'free until 16:00' },
      { a: 16, b: 16.5, name: 'Intro call', c: '#e674a8', bg: '#3a2533', where: 'Zoom', call: 1, meet: 1 },
      { a: 18.5, b: 19.5, name: 'Planning with Alan', c: '#8f76f6', bg: '#26243f' },
      { a: 20, b: 21, name: 'Family dinner', c: '#f3a23f', bg: '#3a2c1b', where: 'Harbour Street 12', leave: '19:42', way: '18 min' },
    ];
    const hm = (h) => String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
    const dur = (h) => h >= 1 ? Math.floor(h) + ' h' + (h % 1 ? ' ' + Math.round((h % 1) * 60) : '') : Math.round(h * 60) + ' min';
    const inT = (h) => { const m = Math.round((h - NOW) * 60); return 'in ' + (m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60) + ' min' : m + ' min'); };
    const TODOS = [['Send the press kit', 'today'], ['Review the pricing copy', 'today'], ['Book the venue', ''], ['Reply to Alan about Friday', 'overdue']];
    function renderCal() {
      const v = L.panel.querySelector('.v-cal'); if (!v) return;
      const today = S.calSeg === 'today';
      const seg = (id, label) => '<button type="button" data-seg="' + id + '" aria-pressed="' + (S.calSeg === id) + '">' + label + '</button>';
      const week = [['M', 19], ['T', 20], ['W', 21], ['T', 22], ['F', 23], ['S', 24], ['S', 25]];
      let html = '<div class="c-head"><div class="c-seg" role="group" aria-label="Today or calendar">' + seg('today', 'Today') + seg('calendar', 'Calendar') + '</div>' +
        '<div class="c-date"><b>Thu 22 Oct</b><span class="num">' + (today ? TODOS.filter((t, k) => !S.done[k]).length + ' to-dos · 14° partly cloudy' : '4 events · free until 16:00') + '</span></div>' +
        (today ? '' : '<span class="c-span" aria-hidden="true"><i class="on">D</i><i>W</i><i>M</i></span><span class="c-week num" aria-hidden="true">' + week.map(([d, n]) => '<i' + (n === 22 ? ' class="on"' : '') + '><small>' + d + '</small><b>' + n + '</b></i>').join('') + '</span>') + '</div>';
      if (today) {
        html += '<div class="card c-todo"><div class="lbl">To-dos <span>from your notes and Reminders</span></div>' + TODOS.map(([t, due], k) =>
          '<button type="button" class="task' + (S.done[k] ? ' done' : '') + '" data-todo="' + k + '" aria-pressed="' + !!S.done[k] + '"><i></i><span>' + t + '</span>' + (due && !S.done[k] ? '<em>' + due + '</em>' : '') + '</button>').join('') + '</div>' +
          '<div class="card c-wx"><div class="wx num"><b>14°</b><span>Partly cloudy</span><em>H 16° L 9°</em></div>' +
          '<div class="hours num">' + [['Now', 14], ['15', 15], ['16', 15], ['17', 13], ['18', 12], ['19', 11]].map(([h, t]) => '<span><small>' + h + '</small>' + t + '°</span>').join('') + '</div>' +
          '<div class="lbl">Work day <span class="num">58 % · until 18:00</span></div><div class="dayp"><i style="--p:.58"></i></div></div>';
        v.classList.add('today'); v.innerHTML = html; return;
      }
      const x = (h) => ((h - 8) / 14 * 100).toFixed(2) + '%';
      const hrs = [8, 10, 12, 14, 16, 18, 20, 22];
      const sel = EVENTS[S.calSel];
      const ev = (e, i) => e.free ? '' : '<span class="ev' + (i === S.calSel ? ' ev-sel' : '') + '" style="left:' + x(e.a) + ';width:calc(' + ((e.b - e.a) / 14 * 100).toFixed(2) + '% - .3em);--evc:' + e.c + ';--ev:' + e.bg + '"></span>';
      html += '<div class="card band"><div class="band-track">' + hrs.map((h) => '<i class="hr" style="left:' + x(h) + '"></i>').join('') +
        '<span class="ev focus" style="left:' + x(9.5) + ';width:calc(' + (1.7 / 14 * 100).toFixed(2) + '% - .3em)"></span>' + EVENTS.map(ev).join('') +
        '<span class="nowline" style="left:' + x(NOW) + '"></span></div>' +
        '<div class="band-hours">' + hrs.map((h) => '<span style="left:' + x(h) + '">' + String(h).padStart(2, '0') + '</span>').join('') + '</div></div>' +
        '<div class="card day"><div class="agenda">' + EVENTS.map((e, i) => e.free
          ? '<div class="ag free now"><span class="tm">' + hm(e.a) + '</span><span class="agb"></span><span class="nm">' + e.name + '</span></div>'
          : '<button type="button" class="ag' + (e.b < NOW ? ' past' : '') + (i === S.calSel ? ' sel' : '') + '" data-ev="' + i + '" style="--evc:' + e.c + '"><span class="tm">' + hm(e.a) + '</span><span class="agb"></span><span class="nm">' + e.name + '</span><span class="du">' + dur(e.b - e.a) + '</span></button>').join('') +
        '</div></div>';
      const range = hm(sel.a) + '–' + hm(sel.b) + (sel.a > NOW ? ' · ' + inT(sel.a) : '') + (sel.where ? ' · ' + sel.where : '');
      html += '<div class="card meet" style="--evc:' + sel.c + '"><div class="t">' + sel.name + '</div><div class="m num">' + range + '</div>' +
        (sel.leave ? '<div class="leave num">' + I.car + '<b>Leave at ' + sel.leave + '</b><span>· ' + sel.way + '</span></div>' : '') + '<hr>' +
        (sel.meet
          ? '<div class="person"><span class="av">GH</span><div><b>Grace Hopper</b> <span>Founder · Compiler Co</span><br><span>Last 02.10. · Intro by mail</span></div></div>' +
            '<div class="waiting"><span class="w">' + I.hourglass.replace('<svg', '<svg width="15" height="15"') + '</span><span style="color:var(--isl-t2)">Waiting</span><span>contract draft</span><em>today</em></div>' +
            '<button class="join" type="button">Join ' + I.ret.replace('<svg', '<svg width="15" height="15"') + '</button>'
          : '<p class="none">No attendees on this event.</p>') + '</div>';
      v.classList.remove('today'); v.innerHTML = html;
    }
    const OUTPUTS = [['MacBook Pro Speakers', 'laptop'], ['AirPods Pro', 'buds'], ['Studio Display', 'display']];
    function renderMusic() {
      const v = L.panel.querySelector('.v-music'); if (!v) return;
      // shuffle, repeat (off, all, one) and favorite show the player's own state, as Music has all three
      const rep = { off: 'Repeat: off', all: 'Repeat: all', one: 'Repeat: one' }[S.repeat];
      v.innerHTML = '<div class="card music"><div class="cover"></div>' +
        '<div class="mu"><div class="mu-top"><div class="mu-t"><div class="t">Low Tide Lights</div><div class="a">Ola Brenn · Harbour Songs</div></div>' +
        '<button type="button" class="fav' + (S.fav ? ' on' : '') + '" aria-pressed="' + S.fav + '" aria-label="Favorite">' + I.star + '</button></div><div class="lyr">and the harbour hums in blue</div>' +
        '<div class="prog"><i style="--p:' + (S.songPos / S.songLen).toFixed(3) + '"></i></div><div class="times num"><span class="t0">0:51</span><span class="t1">-2:23</span></div>' +
        '<div class="ctrls"><button type="button" class="md shuf' + (S.shuffle ? ' on' : '') + '" aria-pressed="' + S.shuffle + '" aria-label="Shuffle">' + I.shuffle + '</button>' +
        '<button type="button" aria-label="Previous">' + I.prev + '</button><button type="button" class="pp" aria-label="Pause">' + (S.playing ? I.pause : I.play) + '</button><button type="button" aria-label="Next">' + I.next + '</button>' +
        '<button type="button" class="md rep' + (S.repeat !== 'off' ? ' on' : '') + '" data-r="' + S.repeat + '" aria-label="' + rep + '">' + I.repeat + (S.repeat === 'one' ? '<small>1</small>' : '') + '</button>' +
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
        '<div class="card apps"><div class="lbl">Top apps</div>' + apps.slice(0, 4).map((a) => '<div class="app"><span class="ic">' + I.app + '</span><span class="n">' + a[0] + (a[1] ? '<small>' + a[1] + '</small>' : '') + '</span><span class="c">' + a[2] + ' %</span><span class="g">' + a[3] + '</span></div>').join('') + '</div>';
    }

    /* tools: Clipboard, Timer and Shelf are tabs of their own inside the tab, as in the app */
    const CLIPS = [['npm run build', 'Terminal', '2 min'], ['github.com', 'Safari', '8 min', 'starnotch/starnotch'], ['Low Tide Lights, Ola Brenn', 'Music', '21 min'], ['Annual plans only, from 1 December', 'Notes', '1 h'], ['git push origin island-polish', 'Terminal', '2 h']];
    function renderTools() {
      const v = L.panel.querySelector('.v-tools'); if (!v) return;
      const tt = [['clipboard', 'Clipboard', 'tools'], ['timer', 'Timer', 'timer'], ['shelf', 'Shelf', 'inbox']];
      const body = {
        clipboard: () => CLIPS.map((c, k) => '<div class="cl"><span>' + (c[3] ? '<b>' + c[0] + '</b> ' + c[3] : c[0]) + '</span><em>' + c[1] + ' · ' + c[2] + '</em><kbd>' + (k + 1) + '</kbd></div>').join(''),
        timer: () => '<div class="timer"><div class="tm-wrap">' + ring(62, 'tm') + '<b class="num">18:42</b></div><span>Focus · 30 min</span></div>',
        shelf: () => '<div class="fl">' + I.file + '<span>contract.pdf</span><em>2.1 MB</em></div><div class="fl">' + I.file + '<span>cover.png</span><em>840 KB</em></div><div class="fl">' + I.file + '<span>notes.md</span><em>4 KB</em></div>',
      };
      v.innerHTML = '<div class="tt-tabs" role="tablist" aria-label="Tools">' + tt.map(([id, label, ic]) => '<button type="button" role="tab" data-tt="' + id + '" aria-selected="' + (S.toolTab === id) + '">' + I[ic] + label + '</button>').join('') + '</div>' +
        '<div class="card tt-body">' + body[S.toolTab]() + '</div>';
    }

    /* All tools: every tool as a tile, grouped by area, with its shortcut; a tool that is off says Turn on */
    const TOOLS = [
      ['Agents', [['agents', 'Agents', 'agents'], ['inbox', 'Agents inbox', 'inbox', '⌃⌥A'], ['palette', 'Command palette', 'cmd', '⌃⌥K']]],
      ['Capture and Tara', [['capture', 'Quick capture', 'pencil', '⌃⌥N'], ['capinbox', 'Capture inbox', 'inbox', '⌃⌥I'], ['tara', 'Ask Tara', 'bubble', '⌃⌥T'], ['dictate', 'Dictation', 'mic'], ['notepad', 'Notepad', 'file'], ['applenotes', 'Apple Notes', 'file']]],
      ['Meetings and calendar', [['calendar', 'Calendar', 'calendar'], ['join', 'Join next meeting', 'video', '⌃⌥J'], ['camera', 'Check camera', 'camera'], ['event', 'New event', 'calendar'], ['reminder', 'New reminder', 'plusc'], ['meeting', 'Meeting agent', 'people']]],
      ['Media', [['music', 'Music', 'music'], ['prompter', 'Teleprompter', 'lines']]],
      ['Files and tools', [['clipboard', 'Clipboard', 'tools', '⌃⌥V'], ['timer', 'Timer', 'timer'], ['shelf', 'Shelf', 'inbox'], ['launcher', 'Launcher', 'agents'], ['downloads', 'Downloads', 'down']]],
      ['System', [['system', 'System', 'system'], ['awake', 'Keep awake', 'cup'], ['watch', 'Watch mode', 'play', '⌃⌥W'], ['settings', 'Settings', 'gear']]],
    ];
    const toolName = (id) => { for (const [, ts] of TOOLS) for (const t of ts) if (t[0] === id) return t; return null; };
    function tileHTML([id, name, ic, key]) {
      const off = S.off.has(id);
      return '<button type="button" class="at-t' + (off ? ' off' : '') + '" data-tool="' + id + '"' + (off ? ' aria-label="' + name + ', off: Turn on"' : '') + '><span class="at-i">' + I[ic] + '</span><b>' + name + '</b>' +
        (off ? '<span class="at-on">Turn on</span>' : key ? '<kbd>' + key + '</kbd>' : '') + '</button>';
    }
    function renderAll() {
      const v = L.panel.querySelector('.v-all'); if (!v) return;
      v.innerHTML = TOOLS.map(([g, ts]) => '<div class="at-l">' + g + '</div><div class="at-g">' + ts.map(tileHTML).join('') + '</div>').join('');
    }

    function showTab(id, instant) {
      if (id === 'dictate') { set('dictate'); return; }
      const order = TABS.map((t) => t[0]);
      const prev = S.tab; S.tab = id;
      // the calendar tab opens on Today
      if (id === 'calendar' && prev !== 'calendar' && S.calSeg !== 'today') { S.calSeg = 'today'; renderCal(); }
      L.panel.querySelectorAll('.p-tab[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
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

    let askResolve = null, askTimer = 0, noting = false;
    const apButtons = (q) => '<button class="ap-btn once" type="button" data-a="once">Allow once <kbd>&#8629;</kbd></button>' +
      (q.codex ? '' : '<button class="ap-btn sess" type="button" data-a="session">Allow for session <kbd>&#8984;&#8629;</kbd></button>') +
      '<button class="ap-inst" type="button" data-inst>Instead&hellip;</button>' +
      '<button class="ap-btn deny" type="button" data-a="deny">Deny <kbd>esc</kbd></button>';
    function renderApproval(q) {
      const s = S.sessions[q.i != null ? q.i : S.featured];
      noting = false;
      L.approval.innerHTML = '<div class="card ap">' + chImg(s, true, 'surprised') +
        '<div><div class="t">' + esc(q.title) + ' wants to run</div><pre>' + esc(q.cmd) + '</pre>' +
        '<div class="ap-btns">' + apButtons(q) + '</div>' +
        '<div class="ap-note"><span class="ap-timer"><i></i></span>Unanswered, the terminal asks after 60 s.</div></div></div>';
    }
    /* Instead...: what the agent should do instead, sent with the deny (enter), or back (esc) */
    async function note(on) {
      const row = L.approval.querySelector('.ap-btns'); if (!row || !askResolve) return;
      noting = on;
      row.classList.toggle('noting', on);
      if (!on) { row.innerHTML = apButtons(S.lastAsk); row.querySelector('.ap-inst').focus({ preventScroll: true }); return; }
      row.innerHTML = '<span class="ap-field"><span class="txt"></span><span class="caret"></span></span>' +
        '<button class="ap-btn once" type="button" data-a="instead">Deny and send <kbd>&#8629;</kbd></button><button class="ap-btn deny" type="button" data-back>Back <kbd>esc</kbd></button>';
      row.querySelector('[data-a="instead"]').focus({ preventScroll: true });
      const el = row.querySelector('.txt'), text = S.lastAsk.note || 'Run the tests first';
      for (let i = 1; i <= text.length && noting && el.isConnected; i++) {
        el.textContent = text.slice(0, i);
        if (!REDUCED.matches) await new Promise((r) => setTimeout(r, 32));
      }
    }
    function answer(a) {
      if (!askResolve) return;
      const r = askResolve; askResolve = null; clearTimeout(askTimer); noting = false;
      r(a); emit('answer', a);
    }

    /* Claude Code asks a question with options: pick one (1 to 9), then Send; esc hands it back to the terminal */
    let qResolve = null, qTimer = 0, qPick = -1, qData = null;
    function renderQuestion() {
      const q = qData, s = S.sessions[q.i != null ? q.i : S.featured];
      L.question.innerHTML = '<div class="card ap qa">' + chImg(s, true, 'surprised') +
        '<div><div class="t">' + esc(q.title) + ' asks <span class="q-h">' + esc(q.header) + '</span></div>' +
        '<p class="q-q">' + esc(q.text) + '</p><div class="q-opts" role="radiogroup" aria-label="' + esc(q.text) + '">' +
        q.options.map((o, k) => '<button type="button" class="q-opt" role="radio" aria-checked="' + (k === qPick) + '" data-q="' + k + '"><kbd>' + (k + 1) + '</kbd><b>' + esc(o[0]) + '</b><span>' + esc(o[1]) + '</span></button>').join('') + '</div>' +
        '<div class="q-own">Or type your own answer</div>' +
        '<div class="q-btns"><button type="button" class="ap-btn deny" data-qa="terminal">Answer in terminal <kbd>esc</kbd></button>' +
        '<button type="button" class="ap-btn once" data-qa="send"' + (qPick < 0 ? ' aria-disabled="true"' : '') + '>Send <kbd>&#8629;</kbd></button></div></div></div>';
    }
    function pickQ(k) {
      if (!qResolve || !qData.options[k]) return;
      qPick = k;
      L.question.querySelectorAll('.q-opt').forEach((b, j) => b.setAttribute('aria-checked', String(j === k)));
      L.question.querySelector('[data-qa="send"]').removeAttribute('aria-disabled');
    }
    function answerQ(a) {
      if (!qResolve) return;
      if (a === 'send') { if (qPick < 0) return; a = qData.options[qPick][0]; }
      const r = qResolve; qResolve = null; clearTimeout(qTimer); r(a); emit('answer', a);
    }

    /* the teleprompter: the script in a band under the notch; read words dim, the phrase being read is white */
    const pm = { on: false, paused: false };
    function renderPrompter(words) {
      L.prompter.innerHTML = '<div class="pm-top"><button class="pm-b pm-pp" type="button" aria-label="Pause">' + I.pause + '</button>' +
        '<span class="pm-mode" aria-hidden="true"><i class="on">' + I.voice + '</i><i>' + I.system + '</i></span><span class="pm-st">' + I.voice + '<span>Listening</span></span>' +
        '<span class="pm-r" aria-hidden="true"><span class="pm-lang">EN</span><span class="pm-a s">A</span><span class="pm-a">A</span></span>' +
        '<button class="pm-b pm-x" type="button" aria-label="Close the teleprompter">' + I.close + '</button></div>' +
        '<div class="pm-view"><div class="pm-text">' + words.map((w) => w === '\n' ? '<br class="pm-p">' : '<span' + (w[0] === '[' ? ' class="sd"' : '') + '>' + esc(w) + '</span> ').join('') + '</div></div>';
    }
    function pmPause(p) {
      pm.paused = p == null ? !pm.paused : p;
      const b = L.prompter.querySelector('.pm-pp'); if (!b) return;
      b.innerHTML = pm.paused ? I.play : I.pause; b.setAttribute('aria-label', pm.paused ? 'Resume' : 'Pause');
      L.prompter.querySelector('.pm-st span').textContent = pm.paused ? 'Paused' : 'Listening';
      L.prompter.classList.toggle('paused', pm.paused);
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
      if (o.peek) S.peek = Object.assign({}, S.peek, { i: null }, o.peek), renderPeek();
      if (o.watch) S.watchText = o.watch, S.sneak = null, renderWatch();
      if (o.sneak) S.sneak = o.sneak, renderWatch();
      if (state !== 'compact') root.classList.remove('hov');
      if (state === S.state && !o.tab) return;
      S.state = state;
      Object.entries(L).forEach(([k, l]) => { l.classList.toggle('on', k === state); l.inert = k !== state; });
      root.classList.toggle('is-open', state === 'panel' || state === 'approval' || state === 'question' || state === 'prompter' || state === 'capture');
      if (state !== 'prompter') pm.on = false;
      if (state !== 'question' && qResolve) answerQ('closed');
      root.dataset.state = state;
      if (state === 'panel' && o.tab) showTab(o.tab);
      if (state !== 'inbox' && inboxResolve) pickInbox('closed');
      shapeTo(dims(state));
      emit('state', state);
    }

    /* events inside the island */
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (t) { showTab(t.dataset.tab); return; }
      const r = e.target.closest('.row[data-i]'); if (r) { S.featured = +r.dataset.i; S.mood = null; renderAgents(); emit('featured', featured()); return; }
      if (e.target.closest('[data-plus]')) { emit('plus'); return; }
      if (e.target.closest('[data-inst]')) { note(true); return; }
      if (e.target.closest('[data-back]')) { note(false); return; }
      const qo = e.target.closest('[data-q]'); if (qo) { pickQ(+qo.dataset.q); return; }
      const qa = e.target.closest('[data-qa]'); if (qa) { answerQ(qa.dataset.qa); return; }
      const a = e.target.closest('.ap-btn'); if (a) { answer(a.dataset.a); return; }
      const sg = e.target.closest('[data-seg]'); if (sg) { S.calSeg = sg.dataset.seg; renderCal(); L.panel.querySelector('[data-seg="' + S.calSeg + '"]').focus({ preventScroll: true }); emit('seg', S.calSeg); return; }
      const td = e.target.closest('[data-todo]'); if (td) { S.done[td.dataset.todo] = !S.done[td.dataset.todo]; renderCal(); L.panel.querySelector('[data-todo="' + td.dataset.todo + '"]').focus({ preventScroll: true }); return; }
      const ce = e.target.closest('.ag[data-ev]'); if (ce) { S.calSel = +ce.dataset.ev; renderCal(); L.panel.querySelector('.ag[data-ev="' + S.calSel + '"]').focus({ preventScroll: true }); emit('event', EVENTS[S.calSel]); return; }
      const tt = e.target.closest('[data-tt]'); if (tt) { S.toolTab = tt.dataset.tt; renderTools(); L.panel.querySelector('[data-tt="' + S.toolTab + '"]').focus({ preventScroll: true }); return; }
      const tl = e.target.closest('[data-tool]');
      if (tl) {
        const id = tl.dataset.tool, was = S.off.has(id);
        if (was) { S.off.delete(id); tl.outerHTML = tileHTML(toolName(id)); L.panel.querySelector('[data-tool="' + id + '"]').focus({ preventScroll: true }); }
        emit('tool', { id, name: toolName(id)[1], key: toolName(id)[3], turnedOn: was });
        return;
      }
      const md = e.target.closest('.md, .fav');
      if (md) {
        if (md.classList.contains('shuf')) S.shuffle = !S.shuffle;
        else if (md.classList.contains('rep')) S.repeat = { off: 'all', all: 'one', one: 'off' }[S.repeat];
        else S.fav = !S.fav;
        const cls = [...md.classList].find((c) => c === 'shuf' || c === 'rep' || c === 'fav');
        renderMusic(); L.panel.querySelector('.' + cls).focus({ preventScroll: true });
        emit('mode', { shuffle: S.shuffle, repeat: S.repeat, fav: S.fav }); return;
      }
      if (e.target.closest('.pm-pp')) { pmPause(); return; }
      if (e.target.closest('.pm-x')) { emit('close'); return; }
      const io = e.target.closest('[data-io]'); if (io) { pickInbox(io.dataset.io); return; }
      const ob = e.target.closest('.out-btn');
      const ol = L.panel.querySelector('.out-list');
      if (ob) { const on = !ol.classList.contains('on'); ol.classList.toggle('on', on); ob.setAttribute('aria-expanded', String(on)); if (on) ol.querySelector('[aria-selected="true"]').focus(); return; }
      const oo = e.target.closest('.out-list [data-o]'); if (oo) { S.output = +oo.dataset.o; renderMusic(); return; }
      if (ol && ol.classList.contains('on')) { ol.classList.remove('on'); }
      const pp = e.target.closest('.pp'); if (pp) { S.playing = !S.playing; pp.innerHTML = S.playing ? I.pause : I.play; pp.setAttribute('aria-label', S.playing ? 'Pause' : 'Play'); return; }
      if (e.target.closest('.isl-hit')) emit('hit');
    });
    root.addEventListener('keydown', (e) => {
      const tabs = [...L.panel.querySelectorAll('.p-tab[data-tab]')];
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
        const up = L.panel.querySelector('.u-pct'); if (up) up.textContent = S.usage + ' %';
        L.panel.querySelectorAll('.row').forEach((r) => {
          const s = S.sessions[+r.dataset.i]; const c = r.querySelector('.ctx');
          setRing(c.querySelector('.ring'), s.ctx); c.style.setProperty('--ctx-c', ctxColor(s.ctx)); c.querySelector('span').textContent = 'ctx ' + s.ctx + ' %';
        });
      }
    }, 1000);

    /* the agents inbox: one card at a time, worked through with keys or a click */
    let inboxResolve = null, inboxTimer = 0;
    function pickInbox(v) {
      if (!inboxResolve) return;
      const r = inboxResolve; inboxResolve = null; clearTimeout(inboxTimer); r(v);
    }
    function renderInbox(q, pos, total) {
      const s = S.sessions[q.i];
      const opts = q.opts ? '<div class="ib-opts">' + q.opts.map((o, k) => '<button type="button" class="ib-opt" data-io="' + esc(o) + '"><kbd>' + (k + 1) + '</kbd>' + esc(o) + '</button>').join('') + '</div>'
        : '<div class="ib-opts"><button type="button" class="ib-opt go" data-io="open">Open <kbd>&#8629;</kbd></button><button type="button" class="ib-opt" data-io="next">Next <kbd>esc</kbd></button></div>';
      L.inbox.innerHTML = '<div class="ib-top"><span>Inbox <em class="num">' + pos + ' of ' + total + '</em></span><span class="keys">' + (q.opts ? '1 to ' + q.opts.length + ' picks' : '&#8984;&#8629; jumps to the session') + '</span></div>' +
        '<div class="card ib">' + chImg(s, true, q.mood || 'thinking') +
        '<div><div class="t">' + esc(q.title) + ' <span class="tool">' + s.tool + '</span></div><p class="ib-q">' + esc(q.text) + '</p>' + opts + '</div></div>';
    }

    /* the command palette: what is typed, then what it finds */
    function renderPalette(rows, sel) {
      const list = (rows || []).map((r, k) => '<div class="pr' + (k === sel ? ' on' : '') + '"><span class="pi' + (r.img ? ' img' : '') + '">' + (r.img ? '<img alt="" src="' + base + r.img + '">' : I[r.icon] || '') + '</span><b>' + esc(r.title) + '</b><em>' + esc(r.meta) + '</em></div>').join('');
      L.palette.querySelector('.pl-rows').innerHTML = list;
    }

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
      noting: () => noting,
      note,
      question(q) {
        if (qResolve) answerQ('replaced');
        qData = q; qPick = -1; renderQuestion(); set('question');
        return new Promise((res) => { qResolve = res; qTimer = setTimeout(() => answerQ('timeout'), q.timeout || 60000); });
      },
      questionOpen: () => !!qResolve,
      pickQ, answerQ,
      hover(on) { root.classList.toggle('hov', !!on && S.state === 'compact'); return api; },
      cal(seg, sel) { S.calSeg = seg; if (sel != null) S.calSel = sel; renderCal(); return api; },
      toolTab(id) { S.toolTab = id; renderTools(); return api; },
      async prompter(text, alive) {
        const words = text.replace(/\n/g, ' \n ').split(/ +/).filter(Boolean);
        renderPrompter(words); pm.on = true; pmPause(false); set('prompter');
        const spans = [...L.prompter.querySelectorAll('.pm-text span')], box = L.prompter.querySelector('.pm-text');
        const ok = () => pm.on && S.state === 'prompter' && (!alive || alive());
        const at = (k) => {
          spans.forEach((s, j) => { s.classList.toggle('r', j < k - 4); s.classList.toggle('c', j >= k - 4 && j <= k); });
          const cur = spans[Math.max(0, Math.min(k, spans.length - 1))];
          const lh = parseFloat(getComputedStyle(box).lineHeight) || 20;
          box.style.transform = 'translateY(' + (-Math.max(0, cur.offsetTop - lh)) + 'px)';
        };
        let k = 6; at(k);
        if (!REDUCED.matches) await new Promise((r) => setTimeout(r, 700));
        while (k < spans.length - 1 && ok()) {
          if (!pm.paused) { k++; if (!REDUCED.matches || k % 3 === 0) at(k); }
          await new Promise((r) => setTimeout(r, spans[k] && spans[k].classList.contains('sd') ? 120 : 290));
        }
        at(k);
        return ok();
      },
      prompterOn: () => pm.on && S.state === 'prompter',
      pmPause,
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
      inbox(q, pos, total) {
        if (inboxResolve) pickInbox('replaced');
        renderInbox(q, pos, total); set('inbox');
        return new Promise((res) => { inboxResolve = res; inboxTimer = setTimeout(() => pickInbox('timeout'), q.timeout || 12000); });
      },
      pickInbox,
      inboxOpen: () => !!inboxResolve,
      async search(query, rows, speed) {
        L.palette.innerHTML = '<div class="pl-in">' + I.search + '<span class="txt"></span><span class="caret"></span></div><div class="pl-rows"></div>';
        set('palette'); if (!REDUCED.matches) await new Promise((r) => setTimeout(r, 380));
        const el = L.palette.querySelector('.txt');
        for (let i = 1; i <= query.length; i++) {
          el.textContent = query.slice(0, i);
          if (i >= 2) renderPalette(rows.slice(0, Math.min(rows.length, i - 1)), 0);
          if (!REDUCED.matches) await new Promise((r) => setTimeout(r, speed || 90));
        }
        renderPalette(rows, 0);
      },
      paletteSelect(k) { L.palette.querySelectorAll('.pr').forEach((r, j) => r.classList.toggle('on', j === k)); },
      async askTara(question, ans, sources, alive) {
        const ok = () => !alive || alive();
        const pause = (ms) => new Promise((r) => setTimeout(r, REDUCED.matches ? 0 : ms));
        float.innerHTML = '<span class="ft-tara"><img alt="" src="' + src(base, S.character, 'medium', 'happy', true) + '"></span>' +
          '<div class="ft-bubble"><div class="ft-ans"></div><div class="ft-field"><span class="ph">Ask Tara&hellip;</span><span class="txt"></span><span class="caret"></span><span class="ft-mic">' + I.mic + '</span></div></div>';
        float.classList.remove('out'); void float.offsetWidth; float.classList.add('on');
        await pause(700); if (!ok()) return;
        const el = float.querySelector('.ft-field .txt'), field = float.querySelector('.ft-field');
        field.classList.add('typing');
        for (let i = 1; i <= question.length; i++) { el.textContent = question.slice(0, i); await pause(42); if (!ok()) return; }
        await pause(450); if (!ok()) return;
        const a = float.querySelector('.ft-ans');
        el.textContent = ''; field.classList.remove('typing');
        a.innerHTML = '<div class="ft-q">' + esc(question) + '</div><div class="ft-think"><i></i><i></i><i></i><span>Thinking</span></div>';
        float.classList.add('asked');
        await pause(1500); if (!ok()) return;
        // the answer card: the question, the answer in large type, its sources (the first one unfolded), Copy and Save to notes
        a.innerHTML = '<div class="ft-q">' + esc(question) + '</div><p>' + esc(ans) + '</p><div class="ft-lbl">Sources</div>' +
          sources.map((s, k) => '<div class="ft-src' + (k === 0 ? ' ft-open' : '') + '">' + I.people + '<b>' + esc(s.title) + '</b><em>' + esc(s.date) + '</em>' + I.chev + '</div>' +
            (k === 0 && s.quote ? '<blockquote>' + esc(s.quote) + '</blockquote>' : '')).join('') +
          '<div class="ft-acts"><span>' + I.tools + 'Copy</span><span>' + I.save + 'Save to notes</span></div>';
        a.classList.add('in');
      },
      dropTara() { float.classList.remove('on', 'asked'); float.classList.add('out'); },
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
