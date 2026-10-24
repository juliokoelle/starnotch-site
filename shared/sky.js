/* A quiet star texture, drawn once into a canvas and handed out as a data URL.
   Seeded, so every load looks the same. */
(function () {
  'use strict';
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
  function texture(w, h, n, seed) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); const r = rng(seed || 7);
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h, big = r() > .965;
      const rad = big ? 1.1 + r() * .7 : .35 + r() * .55;
      const a = big ? .55 + r() * .35 : .12 + r() * .4;
      const hue = r() > .8 ? '200,210,255' : r() > .9 ? '255,220,235' : '255,255,255';
      g.fillStyle = 'rgba(' + hue + ',' + a.toFixed(2) + ')';
      g.beginPath(); g.arc(x, y, rad, 0, 6.283); g.fill();
      if (big) { const gr = g.createRadialGradient(x, y, 0, x, y, rad * 5); gr.addColorStop(0, 'rgba(' + hue + ',.16)'); gr.addColorStop(1, 'rgba(' + hue + ',0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad * 5, 0, 6.283); g.fill(); }
    }
    return c.toDataURL('image/png');
  }
  const url = texture(1400, 900, 520, 11);
  document.documentElement.style.setProperty('--stars', 'url(' + url + ')');
  window.Sky = { texture };
})();
