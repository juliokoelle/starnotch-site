/* Variant D. Three parts:
   1. the intro: a night sky drawn in a canvas, flown through as you scroll; the wordmark rides along
      and lands in the bar's top-left corner when the page proper arrives,
   2. the MacBook: the one live notch on the page, with hints that grow as you play,
   3. small things: theme switch, tiles, copy, questions. */
(function () {
  'use strict';
  const BASE = 'assets/';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOVER = matchMedia('(hover: hover)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const bell = (v, a, b, c, d) => smooth(a, b, v) * (1 - smooth(c, d, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const light = () => document.documentElement.dataset.theme === 'light';

  /* ---------- theme switch ---------- */
  const themeBtn = $('#theme');
  let sky = null;
  function syncTheme() {
    const dark = !light();
    themeBtn.setAttribute('aria-checked', String(dark));
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#07080c' : '#f5f6f8');
  }
  themeBtn.addEventListener('click', () => {
    const next = light() ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('starnotch-theme', next); } catch (e) { /* private mode: not remembered */ }
    syncTheme();
    if (sky) sky.redraw();
  });
  syncTheme();

  /* ---------- 1. the sky ---------- */
  function makeSky(canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    const N = innerWidth < 720 ? 700 : 1400;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const X = new Float32Array(N), Y = new Float32Array(N), Z = new Float32Array(N), PH = new Float32Array(N), SP = new Float32Array(N), SZ = new Float32Array(N), TI = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      X[i] = (rnd() * 2 - 1) * 1.7; Y[i] = (rnd() * 2 - 1) * 1.05; Z[i] = rnd();
      PH[i] = rnd() * 6.283; SP[i] = .5 + rnd() * 1.6; SZ[i] = .55 + rnd() * .9;
      const h = rnd(); TI[i] = h < .7 ? 0 : h < .84 ? 1 : h < .93 ? 2 : 3;
    }
    const DARK = ['#ffffff', '#c6ceff', '#ffd6ec', '#bdf7e2'];
    const LIGHT = ['#2e3e78', '#4650aa', '#8a4682', '#2a7864'];
    const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
    { const g = sprite.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.16, 'rgba(255,255,255,.5)'); gr.addColorStop(.45, 'rgba(200,210,255,.1)'); gr.addColorStop(1, 'rgba(200,210,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }
    function nebula(lt) {
      /* clouds built from many small soft blobs, so they have structure instead of a flat wash */
      const c = document.createElement('canvas'); c.width = 1400; c.height = 880; const n = c.getContext('2d');
      let sd = 3; const rr = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
      const clouds = [[.24, .3, .2, '110,123,255', .075], [.33, .38, .12, '106,79,200', .07], [.76, .26, .17, '228,107,224', .055], [.7, .7, .2, '106,79,200', .05], [.14, .78, .13, '62,214,160', .04], [.9, .6, .1, '255,111,168', .04]];
      for (const [x, y, spread, col, a] of clouds) {
        for (let k = 0; k < 26; k++) {
          const bx = (x + (rr() - .5) * spread * 1.6) * 1400, by = (y + (rr() - .5) * spread) * 880, br = (.04 + rr() * .11) * 1400;
          const gg = n.createRadialGradient(bx, by, 0, bx, by, br);
          const al = (lt ? a * .8 : a) * (.5 + rr());
          gg.addColorStop(0, 'rgba(' + col + ',' + al.toFixed(3) + ')'); gg.addColorStop(1, 'rgba(' + col + ',0)');
          n.fillStyle = gg; n.fillRect(bx - br, by - br, br * 2, br * 2);
        }
      }
      return c;
    }
    /* far dust: many tiny points that only drift, for depth behind the flying stars */
    const M = innerWidth < 720 ? 900 : 2000, DX = new Float32Array(M), DY = new Float32Array(M), DA = new Float32Array(M);
    for (let i = 0; i < M; i++) { DX[i] = rnd(); DY[i] = rnd(); DA[i] = .12 + rnd() * .42; }
    const neb = { d: nebula(false), l: nebula(true) };
    let W = 0, H = 0, D = 1, lastArgs = [0, 0, 0];
    function resize() {
      D = Math.min(devicePixelRatio || 1, 2); W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * D); canvas.height = Math.round(H * D);
    }
    function draw(travel, vel, t) {
      lastArgs = [travel, vel, t];
      const lt = light();
      ctx.setTransform(D, 0, 0, D, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      if (lt) { bg.addColorStop(0, '#c9d5ef'); bg.addColorStop(.55, '#e2e7f6'); bg.addColorStop(1, '#f7edef'); }
      else { bg.addColorStop(0, '#020309'); bg.addColorStop(.6, '#05060f'); bg.addColorStop(1, '#090a18'); }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      if (lt) { const hz = ctx.createRadialGradient(W / 2, H * 1.15, 0, W / 2, H * 1.15, Math.max(W, H) * .75); hz.addColorStop(0, 'rgba(255,196,170,.55)'); hz.addColorStop(1, 'rgba(255,196,170,0)'); ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H); }
      const zoom = (1.12 + travel * .16) * Math.max(W / 1400, H / 880) * 1.1, nw = 1400 * zoom, nh = 880 * zoom;
      ctx.drawImage(lt ? neb.l : neb.d, (W - nw) / 2, (H - nh) / 2 - travel * 24, nw, nh);
      { const dz = 1 + travel * .07, ox = W / 2, oy = H * .42; ctx.fillStyle = lt ? '#33417a' : '#dfe4ff';
        for (let i = 0; i < M; i++) { const x = ox + (DX[i] * W - ox) * dz, y = oy + (DY[i] * H - oy) * dz; if (x < 0 || x > W || y < 0 || y > H) continue; ctx.globalAlpha = DA[i] * (lt ? .55 : .8) * (.8 + .2 * Math.sin(t * .9 + i)); ctx.fillRect(x, y, .8, .8); }
        ctx.globalAlpha = 1; }
      const cx = W / 2, cy = H * .42, F = Math.max(W, H) * .36;
      const cols = lt ? LIGHT : DARK;
      if (!lt) ctx.globalCompositeOperation = 'lighter';
      const trail = Math.min(.045, Math.abs(vel) * 4);
      for (let i = 0; i < N; i++) {
        let z = Z[i] - travel * .5; z -= Math.floor(z); z = .025 + z * .975;
        const sx = cx + X[i] * F / z, sy = cy + Y[i] * F / z;
        if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) continue;
        const near = 1 - z;
        let a = (.38 + near * .9) * smooth(.025, .09, z) * smooth(1, .93, z);
        a *= .72 + .28 * Math.sin(t * SP[i] + PH[i]);
        if (lt) a *= .78;
        if (a < .02) continue;
        const size = (.4 + near * near * 2.6) * SZ[i];
        ctx.fillStyle = cols[TI[i]]; ctx.strokeStyle = cols[TI[i]];
        if (trail > .002 && near > .25) {
          const z2 = Math.min(1, z + trail);
          ctx.globalAlpha = a * .5; ctx.lineWidth = size * .8; ctx.beginPath();
          ctx.moveTo(cx + X[i] * F / z2, cy + Y[i] * F / z2); ctx.lineTo(sx, sy); ctx.stroke();
        }
        if (!lt && size > 1.3) { ctx.globalAlpha = a * .55; const g = size * 7; ctx.drawImage(sprite, sx - g / 2, sy - g / 2, g, g); }
        ctx.globalAlpha = a;
        if (size < 1.2) ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        else { ctx.beginPath(); ctx.arc(sx, sy, size / 2, 0, 6.2832); ctx.fill(); }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    resize();
    return { draw, resize, redraw: () => draw(...lastArgs) };
  }

  const intro = $('#intro'), canvas = $('#sky'), fly = $('#fly'), mark = $('#mark'), bar = $('#bar');
  const l1 = $('#l1'), l2 = $('#l2'), cue = $('#cue');
  sky = makeSky(canvas);
  addEventListener('resize', () => { sky.resize(); sky.redraw(); });

  if (REDUCED) {
    /* A still sky, the logo already in its place. */
    intro.classList.add('static');
    intro.parentNode.insertBefore(bar, intro);
    fly.hidden = true;
    sky.resize(); sky.draw(.35, 0, 0);
  } else {
    mark.classList.add('pending');
    const cur = { p1: 0, p2: 0 }; let last = performance.now(), prevTravel = 0, raf = 0, landed = false;
    function targets() {
      const vh = innerHeight, pin = intro.offsetHeight - vh, y = scrollY;
      return { p1: clamp(y / pin, 0, 1), p2: clamp((y - pin) / vh, 0, 1), y, end: intro.offsetHeight };
    }
    /* Tara doesn't just glide into the bar, she rides it like a coaster. Over two screens of
       scrolling (f, from one screen before the intro lets go until the logo lands) she sweeps out
       to the right edge and down, flies one wide round with her body along the track, swings
       back under it and climbs to the bar; the last stretch adds a hop with a turn on the Y axis,
       then a squash, a wobble and a settle as she lands. The track is in screen px around her own
       spot in the wordmark, divided by the fly's scale; the speeds match where the pieces join.
       Every extra is zero at both ends, so scrubbing back reverses it and the hand-off to the
       bar's logo is pixel exact. Transforms only. */
    const star = fly.querySelector('img');
    const bez2 = (a, c, b, q) => (1 - q) * (1 - q) * a + 2 * (1 - q) * q * c + q * q * b;
    const bez3 = (a, c, d, b, q) => { const r = 1 - q; return r * r * r * a + 3 * r * r * q * c + 3 * r * q * q * d + q * q * q * b; };
    function placeStar(p2, f, s, bx, by, size) {
      const vw = document.documentElement.clientWidth, vh = innerHeight, half = size / 2;
      const R = Math.max(40, Math.min(vh * .33, (vw - 32 - size) / 2, (vh - 40 - size) / 2));
      const cx = Math.min(vw / 2 + R * .9, vw - 16 - half - R), cy = vh * .5;
      const ax = cx + R, ay = cy, k = R * .55;
      let px = bx, py = by, turn = 0, rush = 0;
      if (f > 0 && f < .16) { const q = (f / .16) ** 2; px = bez2(bx, ax, ax, q); py = bez2(by, Math.min(by, cy) - vh * .12, ay, q); }
      else if (f >= .16 && f < .62) { const w = (f - .16) / .46, ph = 2 * Math.PI * w; px = cx + R * Math.cos(ph); py = cy + R * Math.sin(ph); turn = w * 360; rush = Math.sin(Math.PI * w); }
      else if (f >= .62 && f < .86) { const t = (f - .62) / .24, q = 1 - (1 - t) ** 2; px = bez3(ax, ax, lerp(ax, bx, .55), bx, q); py = bez3(ay, ay + k, ay + k, by, q); }
      const u = clamp((p2 - .5) / .24, 0, 1), arc = Math.sin(Math.PI * u);
      const v = clamp((p2 - .72) / .265, 0, 1), land = v > 0 && v < 1 ? (1 - v) * (1 - v) * Math.sin(v * 3 * Math.PI) : 0;
      const spin = (360 * ease(u)) % 360;
      const dx = (px - bx) / s, dy = (py - by - 12 * arc * s) / s + 4 * land;
      const tilt = turn - 9 * arc + 13 * (v > 0 && v < 1 ? (1 - v) * (1 - v) * Math.sin(v * 4 * Math.PI) : 0);
      const st = Math.max(arc, .6 * rush);
      const sx = 1 - .1 * st + .2 * land, sy = 1 + .16 * st - .24 * land;
      star.style.transform = (f <= 0 || p2 >= .985) ? '' :
        'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) perspective(140px) rotateZ(' + tilt.toFixed(2) + 'deg) rotateY(' + spin.toFixed(2) + 'deg) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')';
    }
    function placeFly(p1, p2, f) {
      const m = mark.getBoundingClientRect(), fw = fly.offsetWidth, fh = fly.offsetHeight;
      const vw = document.documentElement.clientWidth, vh = innerHeight;
      const S = clamp((vw * .58) / fw, 2, 4.6) * (1 + .05 * p1);
      const sx = (vw - fw * S) / 2, sy = vh * .4 - (fh * S) / 2;
      const t = ease(p2);
      const x = lerp(sx, m.left, t), y = lerp(sy, m.top + (m.height - fh) / 2, t), s = lerp(S, 1, t);
      fly.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';
      const size = star.offsetWidth * s;
      placeStar(p2, f, s, x + size / 2, y + (fh / 2) * s, size);
      const done = p2 > .995;
      if (done !== landed) { landed = done; fly.style.opacity = done ? '0' : '1'; mark.classList.toggle('pending', !done); }
    }
    function tick(now) {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const tg = targets();
      const k = 1 - Math.exp(-dt * 8);
      cur.p1 += (tg.p1 - cur.p1) * k; cur.p2 += (tg.p2 - cur.p2) * k;
      if (Math.abs(tg.p1 - cur.p1) < .0005) cur.p1 = tg.p1;
      if (Math.abs(tg.p2 - cur.p2) < .0005) cur.p2 = tg.p2;
      const travel = cur.p1 * 1.7 + cur.p2 * .5 + now / 1000 * .006;
      const vel = (travel - prevTravel) / Math.max(dt * 60, .001); prevTravel = travel;
      const onScreen = tg.y < tg.end;
      if (onScreen) {
        sky.draw(travel, vel, now / 1000);
        l1.style.opacity = bell(cur.p1, .06, .18, .4, .5).toFixed(3);
        l1.style.transform = 'translateY(' + (10 * (1 - smooth(.06, .18, cur.p1))).toFixed(1) + 'px)';
        l2.style.opacity = (smooth(.55, .68, cur.p1) * (1 - smooth(0, .4, cur.p2))).toFixed(3);
        l2.style.transform = 'translateY(' + (10 * (1 - smooth(.55, .68, cur.p1))).toFixed(1) + 'px)';
        cue.style.opacity = (1 - smooth(0, .05, cur.p1)).toFixed(3);
      }
      const vh = innerHeight, pin = intro.offsetHeight - vh;
      placeFly(cur.p1, cur.p2, clamp((cur.p1 * pin + cur.p2 * vh - (pin - vh)) / (2 * vh), 0, 1));
      const settled = cur.p2 === tg.p2 && cur.p1 === tg.p1;
      raf = (onScreen || !settled) ? requestAnimationFrame(tick) : 0;
    }
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    kick();
  }

  /* ---------- 2. the display: a 14-inch MacBook Pro screen at true scale ----------
     Measured on a 14" MacBook Pro with NSScreen: 1512 x 982 pt, notch 185 x 32 pt
     (safeAreaInsets.top 32, auxiliary areas end at 663.5 and start at 848.5 pt).
     Island sizes are the app's (NotchModel.swift, NotchLayout), in em of 14.92 pt, so the
     notch's 185 pt is 12.4 em: closed 185 x 32, compact 233 x 32, peek 227 x 72, sneak 227 x 68,
     panel 640 wide and 52 pt plus the module's body tall, approval 640 x 202, capture 520 x 131. */
  const PT_EM = 14.92;
  const em = (pt) => +(pt / PT_EM).toFixed(3);
  const REAL = {
    notch: { w: em(185), h: em(32), r: em(9) },
    compact: { w: em(233), h: em(32), r: em(11) },
    peek: { w: em(227), h: em(72), r: em(17) },
    watch: { w: em(227), h: em(68), r: em(17) },
    dictate: { w: em(227), h: em(68), r: em(17) },
    panel: { w: em(640), h: em(352), r: em(30) },
    approval: { w: em(640), h: em(202), r: em(30) },
    capture: { w: em(520), h: em(131), r: em(24) },
  };
  /* body heights per module from the app: agents 300 (three sessions, two subagents), today 330,
     calendar 400 (band and cards), now playing 156, system 356; plus 52 pt of notch and margins */
  const TABS = { agents: [em(352), 35], today: [em(382), 31], calendar: [em(452), 40], music: [em(208), 26], system: [em(408), 36] };
  const deskView = $('#deskView'), desk = $('#desk'), screen = $('#screen'), dim = $('#dim'), wall = $('#wall');
  function sizeDesk() {
    const vw = document.documentElement.clientWidth, vh = innerHeight;
    const crop = vw < 720;
    // on a phone the display stays wider than the view, so the open panel (640 pt) just fits
    // on a laptop the display leaves room for the hint and the sneaks below it, all in one view
    const sw = crop ? Math.round((vw - 40) / (640 / 1512)) : Math.round(Math.min(1180, vw - 140, (vh - 270) / (982 / 1512 + .045)));
    const lid = sw * 1.033;
    deskView.style.setProperty('--sw', sw + 'px');
    deskView.classList.toggle('crop', crop);
    if (crop) {
      const viewW = vw - 32;
      deskView.style.width = viewW + 'px';
      desk.style.setProperty('--off', ((viewW - lid) / 2).toFixed(1) + 'px');
      deskView.style.height = Math.round(Math.min(sw * (982 / 1512) + sw * .0165, vh * .64)) + 'px';
    } else { deskView.style.width = ''; deskView.style.height = ''; desk.style.setProperty('--off', '0px'); }
    screen.style.setProperty('--isl-fs', (sw / 1512 * PT_EM).toFixed(3) + 'px');
  }

  /* our wallpaper: a night valley under Tara's sky (dusk in the light theme), painted once */
  function paintWall() {
    const r = wall.getBoundingClientRect(); if (!r.width) return;
    const D = Math.min(devicePixelRatio || 1, 2), W = r.width, H = r.height;
    wall.width = Math.round(W * D); wall.height = Math.round(H * D);
    const g = wall.getContext('2d'); g.setTransform(D, 0, 0, D, 0, 0);
    const lt = light(); let sd = 11; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
    const sky = g.createLinearGradient(0, 0, 0, H * .8);
    (lt ? [[0, '#7d95d4'], [.42, '#b4aadf'], [.72, '#eebcc6'], [1, '#ffd9b6']] : [[0, '#03051a'], [.42, '#121543'], [.74, '#36286a'], [1, '#86508a']]).forEach(([o, c]) => sky.addColorStop(o, c));
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(W * .62, H * .74, 0, W * .62, H * .74, W * .62);
    glow.addColorStop(0, lt ? 'rgba(255,220,176,.95)' : 'rgba(236,124,164,.5)'); glow.addColorStop(1, 'rgba(255,200,170,0)');
    g.fillStyle = glow; g.fillRect(0, 0, W, H);
    // the band of the galaxy
    g.save(); g.translate(W * .46, H * .3); g.rotate(-.34);
    const tints = ['110,123,255', '228,107,224', '106,79,200', '62,214,160'];
    for (let k = 0; k < 70; k++) {
      const x = (rnd() - .5) * W * 1.5, y = (rnd() - .5) * H * .13, rad = W * (.025 + rnd() * .06);
      const gg = g.createRadialGradient(x, y, 0, x, y, rad);
      gg.addColorStop(0, 'rgba(' + tints[k % 4] + ',' + (lt ? .07 : .085) + ')'); gg.addColorStop(1, 'rgba(' + tints[k % 4] + ',0)');
      g.fillStyle = gg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    for (let k = 0; k < 1400; k++) {
      const x = (rnd() - .5) * W * 1.5, y = (rnd() + rnd() + rnd() - 1.5) * H * .07, s = .35 + rnd() * .8;
      g.globalAlpha = (lt ? .25 : .35) + rnd() * (lt ? .3 : .55); g.fillStyle = lt ? '#2b3770' : '#e9ecff'; g.fillRect(x, y, s, s);
    }
    g.restore(); g.globalAlpha = 1;
    for (let k = 0; k < 520; k++) {
      const y = Math.pow(rnd(), 1.6) * H * .7, x = rnd() * W, s = .4 + rnd() * (rnd() > .94 ? 1.8 : .9);
      g.globalAlpha = (1 - y / (H * .75)) * ((lt ? .35 : .55) + rnd() * .45); g.fillStyle = lt ? '#2b3770' : '#ffffff';
      g.beginPath(); g.arc(x, y, s / 2, 0, 6.283); g.fill();
    }
    g.globalAlpha = 1;
    // Tara, the bright one
    { const x = W * .79, y = H * .17, R = W * .05, h = g.createRadialGradient(x, y, 0, x, y, R);
      h.addColorStop(0, lt ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,1)'); h.addColorStop(.08, lt ? 'rgba(220,214,255,.6)' : 'rgba(190,200,255,.55)'); h.addColorStop(1, 'rgba(160,170,255,0)');
      g.fillStyle = h; g.fillRect(x - R, y - R, R * 2, R * 2);
      g.strokeStyle = lt ? 'rgba(255,255,255,.8)' : 'rgba(220,226,255,.75)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x - R * .7, y); g.lineTo(x + R * .7, y); g.moveTo(x, y - R * .7); g.lineTo(x, y + R * .7); g.stroke(); }
    // ridges, far to near, with haze between
    const ridges = lt
      ? [[.62, .06, '#a3a6dc'], [.69, .07, '#8487c6'], [.78, .06, '#6466a8'], [.88, .05, '#46477f']]
      : [[.62, .06, '#2b2a68'], [.69, .07, '#1e1c4c'], [.78, .06, '#120f31'], [.88, .05, '#07061a']];
    ridges.forEach(([base, amp, col], i) => {
      const ph = [rnd() * 6, rnd() * 6, rnd() * 6], f = [1.6 + i * .5, 4.2 + i, 11 + i * 3];
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 4; x += 4) {
        const u = x / W, n = Math.sin(u * f[0] * 3.1 + ph[0]) * .55 + Math.sin(u * f[1] * 3.1 + ph[1]) * .3 + Math.sin(u * f[2] * 3.1 + ph[2]) * .12;
        g.lineTo(x, H * (base - amp * n));
      }
      g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill();
      if (i < 3) { const m = g.createLinearGradient(0, H * (base - amp), 0, H * (base + .1)); m.addColorStop(0, lt ? 'rgba(255,236,230,0)' : 'rgba(150,120,200,0)'); m.addColorStop(1, lt ? 'rgba(255,236,230,.22)' : 'rgba(150,120,200,.12)'); g.fillStyle = m; g.fillRect(0, H * (base - amp), W, H); }
      if (i === 2 && !lt) for (let k = 0; k < 9; k++) { g.globalAlpha = .5 + rnd() * .5; g.fillStyle = '#ffc78a'; g.fillRect(W * (.12 + rnd() * .76), H * (base + .02 + rnd() * .05), 1.3, 1.3); }
      g.globalAlpha = 1;
    });
    // the tiles show crops of the top of this same screen
    try { document.querySelector('.tiles').style.setProperty('--wall', 'url(' + wall.toDataURL('image/jpeg', .82) + ')'); } catch (e) { /* tiles keep their gradient */ }
  }

  sizeDesk();
  const isl = Island.mount($('#island'), { assets: BASE, interactive: true, widthEl: screen, dims: REAL, tabH: TABS });
  paintWall();
  addEventListener('resize', () => { sizeDesk(); isl.measure(); paintWall(); });
  themeBtn.addEventListener('click', paintWall);
  const el = isl.el;

  let token = 0; const take = () => ++token; const alive = (t) => t === token;
  let hoverPeek = false;
  const hintEl = $('#hint'), chips = $('#chips'), knobs = $('#knobs');
  const did = new Set(); let events = 0;
  const say = (html) => { hintEl.innerHTML = html; };
  function revealKnobs() { if (knobs.hidden) { knobs.hidden = false; knobs.classList.add('new'); placeSegs(); } }
  function counted() {
    events++;
    if (events >= 2) revealKnobs();
  }
  const peekOf = (i) => { const s = isl.S.sessions[i == null ? isl.S.featured : i]; return { title: s.title, sub: s.step, mood: null }; };

  isl.on('state', (st) => { dim.classList.toggle('on', st === 'panel' || st === 'capture'); });
  function rest() { take(); $$('.sn.is-live').forEach((c) => c.classList.remove('is-live')); isl.featured(0); isl.mood(null); isl.set('compact'); }
  dim.addEventListener('click', () => { if (!isl.asking()) rest(); });

  if (HOVER) {
    el.addEventListener('mouseenter', () => {
      if (isl.S.state !== 'compact' && isl.S.state !== 'notch' && !(isl.S.state === 'watch' && cyc.showing)) return;
      if (cyc.showing) stopCycle();
      hoverPeek = true; take(); isl.set('peek', { peek: peekOf() });
      if (!did.has('peek')) { did.add('peek'); say('That\'s a peek. <b>Click</b> the notch to open it.'); }
    });
    el.addEventListener('mouseleave', () => { if (hoverPeek && isl.S.state === 'peek') isl.set('compact'); hoverPeek = false; });
  }
  isl.on('hit', () => {
    hoverPeek = false; take(); isl.set('panel', { tab: 'agents' });
    if (!did.has('open')) { did.add('open'); say('Every session with its last step, context and plan limits. Switch tabs up top, or try one below.'); }
  });
  const TAB_HINT = {
    agents: 'Sessions, subagents, context per session, plan limits up top.',
    today: 'Your Reminders, and with a connector your tasks and a brief.',
    calendar: 'Your day, the next meeting, and Join with one key.',
    music: 'Spotify or Music, with the output device.',
    system: 'CPU, GPU, memory, and the apps behind them.',
  };
  isl.on('tab', (t) => { if (did.has('open') && TAB_HINT[t] && isl.S.state === 'panel') say(TAB_HINT[t]); });

  const KEYS = '<kbd class="k">&#8629;</kbd> once, <kbd class="k">&#8984;</kbd><kbd class="k">&#8629;</kbd> session, <kbd class="k">esc</kbd> deny.';
  const SCENES = {
    async ask(t) {
      isl.featured(1);
      say('<b>Docs refresh</b> wants to run a build. ' + KEYS);
      const a = await isl.ask({ title: 'Docs refresh', cmd: 'npm run build', i: 1 });
      if (a === 'replaced' || !alive(t)) return;
      const out = { once: ['Allowed once', 'joyful', 'Allowed once. The build runs.'], session: ['Allowed for this session', 'love', 'Allowed for the session. It won\'t ask again.'], deny: ['Denied', 'confused', 'Denied. The agent hears no and moves on.'], timeout: ['The terminal asks now', 'thinking', 'No answer in 60 s, so the terminal asks.'] }[a];
      say(out[2] + (events < 1 ? ' New ideas below.' : ''));
      counted();
      isl.set('peek', { peek: { title: 'Docs refresh', sub: out[0], mood: out[1] } });
      await wait(2600); if (alive(t)) rest();
    },
    async meeting(t) {
      say('Five minutes before a meeting, the notch reminds you.');
      isl.set('peek', { peek: { title: 'Intro call in 5 min', sub: 'Grace Hopper · Zoom', mood: 'happy' } });
      await wait(2300); if (!alive(t)) return;
      isl.set('panel', { tab: 'calendar' });
      say('Who you\'re meeting, what you\'re waiting for, and Join.');
      counted();
    },
    async music() { isl.set('panel', { tab: 'music' }); say('Cover, controls, volume and the output device.'); counted(); },
    async capture(t) {
      say('<kbd class="k">&#8963;</kbd><kbd class="k">&#8997;</kbd><kbd class="k">N</kbd>: one line out of the notch. Names and dates are picked up.');
      isl.set('capture'); await wait(REDUCED ? 0 : 380);
      await isl.type('Send Grace the contract draft Friday 10:00', [['Grace', 'person'], ['Friday 10:00', 'date']], 38);
      await wait(1000); if (!alive(t)) return;
      counted();
      isl.set('peek', { peek: { title: 'Saved as an event', sub: 'Friday 10:00 · Grace Hopper', mood: 'happy' } });
      await wait(2400); if (alive(t)) rest();
    },
    async watch(t) {
      say('A video plays fullscreen. Watch mode: the notch goes quiet.');
      isl.set('notch'); await wait(2200); if (!alive(t)) return;
      say('An agent finished meanwhile. Not urgent, so it waits.');
      await wait(2000); if (!alive(t)) return;
      isl.set('watch', { watch: '1 update while you watched' }); say('Video over: one line says what you missed.');
      counted();
      await wait(3000); if (alive(t)) rest();
    },
  };
  $$('[data-ev]', chips).forEach((b) => b.addEventListener('click', () => {
    if (isl.asking()) isl.answer('replaced');
    $$('.sn.is-live').forEach((c) => c.classList.remove('is-live'));
    stopCycle(); scene = true;
    b.classList.add('is-live'); b.classList.remove('new');
    const t = take();
    Promise.resolve(SCENES[b.dataset.ev](t)).finally(() => { scene = false; if (alive(t) && isl.S.state !== 'panel') b.classList.remove('is-live'); });
  }));

  /* Idle, the display's notch plays the sneaks in turn: one line for a few seconds, back to the
     notch, the next. The live one is marked below the display with a timer in its tint. Hover or
     focus one to hold it; it never runs over something you started, and not at all with reduced
     motion (hover and focus still show a sneak, without the timer). */
  const SNEAKS = {
    ask: { img: 'astra/sol/surprised.webp', tint: 'var(--wait)', title: 'An agent needs you' },
    meeting: { icon: 'calendar', tint: '#e674a8', title: 'Intro call', meta: 'in 5 min' },
    music: { icon: 'music', tint: '#1ed760', title: 'Low Tide Lights' },
    capture: { icon: 'pencil', tint: '#8f76f6', title: 'Saved for Friday', meta: '10:00' },
    watch: { icon: 'play', tint: '#a4a8b6', title: '1 update while you watched' },
  };
  const ORDER = ['ask', 'meeting', 'music', 'capture', 'watch'], SHOW = 3400, GAP = 800;
  const cyc = { i: -1, showing: false, held: false, calm: 0, t: 0, inView: false, ready: false };
  let scene = false;
  chips.style.setProperty('--cyc', (SHOW + GAP) + 'ms');
  const idle = () => !scene && !hoverPeek && !isl.asking() && (isl.S.state === 'compact' || isl.S.state === 'notch' || (isl.S.state === 'watch' && cyc.showing));
  function markSneak(name) {
    $$('.sn', chips).forEach((b) => { const on = b.dataset.ev === name; if (on && b.classList.contains('on')) { b.classList.remove('on'); void b.offsetWidth; } b.classList.toggle('on', on); });
  }
  function preview(name) { markSneak(name); cyc.showing = true; isl.set('watch', { sneak: SNEAKS[name] }); }
  function stopCycle() { clearTimeout(cyc.t); cyc.showing = false; chips.classList.remove('cycling'); markSneak(null); }
  function cycle() {
    clearTimeout(cyc.t);
    const now = performance.now();
    if (cyc.held) return;
    if (!cyc.ready || !cyc.inView || document.hidden || !idle()) {
      if (cyc.showing && !scene && isl.S.state === 'watch' && !cyc.inView) isl.set('compact');
      if (cyc.showing || chips.classList.contains('cycling')) stopCycle();
      cyc.calm = now; cyc.t = setTimeout(cycle, 600); return;
    }
    if (now - cyc.calm < 2400) { cyc.t = setTimeout(cycle, 600); return; }
    if (cyc.showing) { cyc.showing = false; isl.set('compact'); cyc.t = setTimeout(cycle, GAP); return; }
    cyc.i = (cyc.i + 1) % ORDER.length;
    chips.classList.add('cycling'); preview(ORDER[cyc.i]);
    cyc.t = setTimeout(cycle, SHOW);
  }
  function hold(b) {
    if (!b || b.hidden || !(idle() || isl.S.state === 'watch' && !scene)) return;
    clearTimeout(cyc.t); cyc.held = true; chips.classList.add('held');
    const i = ORDER.indexOf(b.dataset.ev); if (i >= 0) cyc.i = i;
    preview(b.dataset.ev);
  }
  function release() {
    if (!cyc.held) return;
    cyc.held = false; chips.classList.remove('held');
    if (!REDUCED) { cyc.calm = performance.now() - 2400 + SHOW; cyc.t = setTimeout(cycle, SHOW); }
    else { cyc.t = setTimeout(() => { if (!scene && isl.S.state === 'watch') { stopCycle(); isl.set('compact'); } }, SHOW); }
  }
  if (HOVER) {
    chips.addEventListener('pointerover', (e) => { const b = e.target.closest('.sn'); if (b && (!cyc.held || !b.classList.contains('on'))) hold(b); });
    chips.addEventListener('pointerleave', () => { if (!chips.contains(document.activeElement)) release(); });
  }
  chips.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) hold(e.target.closest('.sn')); });
  chips.addEventListener('focusout', (e) => { if (!chips.contains(e.relatedTarget)) release(); });
  new IntersectionObserver((en) => { cyc.inView = en[0].isIntersecting; if (!REDUCED) cycle(); }, { threshold: .4 }).observe(deskView);
  document.addEventListener('visibilitychange', () => { if (!REDUCED && !document.hidden) cycle(); });

  /* effort and character */
  const segs = [];
  function seg(group, items, onPick) {
    const ind = group.querySelector('.seg-ind');
    if (items) group.insertAdjacentHTML('beforeend', items.map(([v, label, c, on]) => '<button type="button" role="radio" aria-checked="' + !!on + '" data-v="' + v + '">' + (c ? '<i style="--c:' + c + '"></i>' : '') + label + '</button>').join(''));
    const btns = $$('button', group);
    const cur = () => btns.find((b) => b.getAttribute('aria-checked') === 'true');
    function place(b, instant) {
      if (!b || !b.offsetWidth) return;
      if (instant) ind.style.transition = 'none';
      ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)';
      if (instant) { void ind.offsetWidth; ind.style.transition = ''; }
    }
    function pick(b, focus) {
      btns.forEach((x) => { x.setAttribute('aria-checked', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
      place(b); if (focus) b.focus(); onPick(b.dataset.v);
    }
    btns.forEach((b) => b.addEventListener('click', () => pick(b)));
    group.addEventListener('keydown', (e) => {
      const i = btns.indexOf(document.activeElement); if (i < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(btns[(i + 1) % btns.length], true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(btns[(i + btns.length - 1) % btns.length], true); }
    });
    btns.forEach((x) => (x.tabIndex = x === cur() ? 0 : -1));
    segs.push(() => place(cur(), true));
  }
  function placeSegs() { requestAnimationFrame(() => segs.forEach((f) => f())); }
  addEventListener('resize', placeSegs);
  function flash() {
    const t = take(); isl.featured(0);
    isl.set('peek', { peek: peekOf(0) });
    setTimeout(() => { if (alive(t)) rest(); }, 1900);
  }
  seg($('#effort'), Island.LEVELS.map((l) => [l, l, Island.EFFORT[l].tint, l === 'max']), (lv) => {
    isl.effort(lv, 0); flash();
    say(isl.S.character === 'cat' ? 'The cat shows <b>' + lv + '</b> effort in its eyes.' : 'At <b>' + lv + '</b> effort, Tara turns ' + Island.EFFORT[lv].name + '.');
  });
  seg($('#chars'), null, (c) => { isl.character(c); flash(); say(c === 'cat' ? 'The cat. Its eyes show the effort.' : 'Tara, the star in your notch.'); });

  /* keys, only while the MacBook is on screen */
  function macInView() { const r = deskView.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
  addEventListener('keydown', (e) => {
    if (!macInView() || (e.target.closest && e.target.closest('input, textarea'))) return;
    if (isl.asking()) {
      if (e.key === 'Enter') { e.preventDefault(); isl.answer(e.metaKey ? 'session' : 'once'); return; }
      if (e.key === 'Escape') { e.preventDefault(); isl.answer('deny'); return; }
    }
    if (e.key === 'Escape' && (isl.S.state === 'panel' || isl.S.state === 'capture')) rest();
  });

  /* the first time the MacBook comes into view: an ear, then one peek */
  if (!HOVER) say('Tap the notch.');
  let greeted = false;
  new IntersectionObserver((en, ob) => {
    if (!en[0].isIntersecting || greeted) return;
    greeted = true; ob.disconnect();
    (async () => {
      const t = take();
      await wait(REDUCED ? 0 : 500); if (!alive(t)) return;
      isl.set('compact');
      await wait(REDUCED ? 200 : 900); if (!alive(t)) return;
      isl.set('peek', { peek: peekOf() });
      await wait(2600); if (alive(t) && isl.S.state === 'peek') isl.set('compact');
    })().finally(() => { cyc.ready = true; cyc.calm = performance.now() - 1200; if (!REDUCED) cycle(); });
  }, { threshold: .55 }).observe(deskView);

  /* ---------- 3. tiles, copy, questions ---------- */
  const tilesEl = $('.tiles');
  function scaleTiles() { const v = $('.viz', tilesEl); if (v) tilesEl.style.setProperty('--k', (v.clientWidth / 260).toFixed(4)); }
  scaleTiles(); addEventListener('resize', scaleTiles);
  $('#built-sub').textContent = HOVER ? 'Hover a tile.' : 'Each tile is a moment from the notch.';
  if (!HOVER && !REDUCED) {
    const io = new IntersectionObserver((en) => en.forEach((x) => x.target.classList.toggle('run', x.isIntersecting)), { threshold: .6 });
    $$('.tile').forEach((tile) => io.observe(tile));
  }

  const copy = $('#copy');
  copy.addEventListener('click', async () => {
    const text = $('#cmds').textContent;
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const r = document.createRange(); r.selectNodeContents($('#cmds')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    const label = $('span', copy); label.textContent = 'Copied';
    setTimeout(() => { label.textContent = 'Copy'; }, 1600);
  });
  /* questions: the whole summary row toggles open and closed (keyboard too, it is a summary);
     the height glides, as on the Margin Lab site */
  $$('.q').forEach((d) => {
    const summary = $('summary', d), answer = $('.a', d); let anim = null;
    summary.addEventListener('click', (e) => {
      if (REDUCED || !d.animate) return;
      e.preventDefault();
      const start = d.offsetHeight, closing = d.open && !(anim && anim.closing);
      if (anim) anim.cancel();
      d.style.overflow = 'hidden';
      if (!closing) d.open = true;
      const end = closing ? summary.offsetHeight : summary.offsetHeight + answer.offsetHeight;
      anim = d.animate({ height: [start + 'px', end + 'px'] }, { duration: closing ? 300 : 420, easing: closing ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'cubic-bezier(0.22, 1, 0.36, 1)' });
      anim.closing = closing;
      answer.animate({ opacity: closing ? [1, 0] : [0, 1] }, { duration: closing ? 200 : 320, easing: 'ease', fill: 'both' });
      anim.onfinish = () => { if (closing) d.open = false; d.style.overflow = ''; anim = null; };
      anim.oncancel = () => { d.style.overflow = ''; };
    });
  });
})();
