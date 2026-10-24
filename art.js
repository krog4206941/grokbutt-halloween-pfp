'use strict';
/* GROKBUTT Halloween PFP Maker - shared helpers. All art is vector canvas drawing on top of Blender renders of GrokButt. */
const TAU = Math.PI * 2;
function seeded(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function mk(w, h) { const k = document.createElement('canvas'); k.width = Math.max(1, Math.round(w)); k.height = Math.max(1, Math.round(h || w)); return k; }
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const f = v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, f(v))).toString(16).padStart(2, '0')).join(''); }
function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rad(c, x, y, r0, r1, stops, x1, y1) { const g = c.createRadialGradient(x, y, r0, x1 ?? x, y1 ?? y, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rr(c, x, y, w, h, r) { r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function pillPath(c, x, y, w, h, rot) { c.save(); c.translate(x, y); c.rotate(rot - Math.PI / 2); rr(c, -w / 2, -h / 2, w, h, w / 2); c.restore(); }
function star(c, x, y, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } c.closePath(); c.fill(); }
const HEAD = '"Cinzel",Georgia,serif';
const UI_FONT = '"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
const BONE = '#e6d6b4', EMBER = '#ff8a1f', PLUM = '#4a2466', GOLD = '#e7b24a', BLOOD = '#8e1b1b', TOXIC = '#8fe36b';
const SPR = {};
function loadSprites() {
  return Promise.all(Object.keys(GB_META).map(k => new Promise((res, rej) => { const im = new Image(); im.onload = () => { SPR[k] = im; res(); }; im.onerror = rej; im.src = `assets/gb_${k}.png`; })));
}
const SWATCH = [['Ember', '#ff8a1f'], ['Pumpkin', '#e2621b'], ['Gold', '#e7b24a'], ['Blood', '#a3202a'], ['Plum', '#7a3fa0'], ['Violet', '#9b7bff'], ['Moss', '#6f9a3a'], ['Toxic', '#8fe36b'], ['Teal', '#2fb7a9'], ['Moon', '#9fb4d8'], ['Bone', '#e6d6b4'], ['Obsidian', '#3a2c48']];
// shared shapes
function tomb(c, x, y, w, h, col) { c.fillStyle = col; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h + w / 2); c.arc(x, y - h + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, y); c.closePath(); c.fill(); }
function tree(c, x, y, h, rand, col, w0 = 18) {
  c.strokeStyle = col; c.lineCap = 'round';
  const br = (x, y, a, len, w, d) => { if (d > 6 || len < 8) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo((x + x2) / 2 + (rand() - 0.5) * len * 0.4, (y + y2) / 2, x2, y2); c.stroke(); const n = 2 + (rand() < 0.4 ? 1 : 0); for (let i = 0; i < n; i++) br(x2, y2, a + (rand() - 0.5) * 1.5, len * (0.62 + rand() * 0.15), w * 0.62, d + 1); };
  br(x, y, -Math.PI / 2 + (rand() - 0.5) * 0.2, h * 0.38, w0, 0);
}
function batShape(c, x, y, s, rot = 0, col = '#0b0710') {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = col; c.beginPath();
  c.moveTo(0, -4); c.quadraticCurveTo(6, -14, 18, -12); c.quadraticCurveTo(28, -14, 40, -4); c.quadraticCurveTo(32, -4, 30, 4); c.quadraticCurveTo(24, -2, 18, 5);
  c.quadraticCurveTo(12, 0, 6, 8); c.quadraticCurveTo(3, 3, 0, 6); c.quadraticCurveTo(-3, 3, -6, 8); c.quadraticCurveTo(-12, 0, -18, 5); c.quadraticCurveTo(-24, -2, -30, 4);
  c.quadraticCurveTo(-32, -4, -40, -4); c.quadraticCurveTo(-28, -14, -18, -12); c.quadraticCurveTo(-6, -14, 0, -4); c.fill();
  c.beginPath(); c.moveTo(-4, -6); c.lineTo(-6, -12); c.lineTo(-1, -8); c.lineTo(1, -8); c.lineTo(6, -12); c.lineTo(4, -6); c.fill(); c.restore();
}
function moon(c, x, y, r, col = '#ffc27a', glow = 0.5) {
  c.fillStyle = rad(c, x, y, r * 0.8, r * 3.2, [[0, hexA(col, glow * 0.55)], [1, hexA(col, 0)]]); c.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
  c.fillStyle = rad(c, x - r * 0.3, y - r * 0.3, r * 0.1, r, [[0, shade(col, 0.25)], [1, shade(col, -0.12)]]); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  c.fillStyle = hexA(shade(col, -0.35), 0.35); [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.22], [-0.1, 0.4, 0.12], [0.35, -0.35, 0.1]].forEach(([a, b, s]) => { c.beginPath(); c.arc(x + a * r, y + b * r, s * r, 0, TAU); c.fill(); });
}
function stars(c, rand, n, maxY, col = '#e9dcc0') { for (let i = 0; i < n; i++) { c.globalAlpha = 0.2 + rand() * 0.6; c.fillStyle = col; const s = rand() * 2.2 + 0.6; c.fillRect(rand() * 1000, rand() * maxY, s, s); } c.globalAlpha = 1; }
function pumpkinShape(c, x, y, rx, ry, col = '#e2621b', lit = false) {
  c.save(); c.translate(x, y);
  const body = lin(c, 0, -ry, 0, ry, [[0, shade(col, 0.15)], [1, shade(col, -0.45)]]);
  for (const [ox, w] of [[-0.55, 0.55], [0.55, 0.55], [-0.25, 0.6], [0.25, 0.6], [0, 0.55]]) { c.fillStyle = body; c.beginPath(); c.ellipse(ox * rx, 0, rx * w, ry, 0, 0, TAU); c.fill(); c.strokeStyle = hexA(shade(col, -0.6), 0.5); c.lineWidth = rx * 0.03; c.stroke(); }
  c.fillStyle = '#4b5d23'; c.beginPath(); c.moveTo(-rx * 0.08, -ry * 0.85); c.quadraticCurveTo(-rx * 0.05, -ry * 1.35, rx * 0.15, -ry * 1.45); c.lineTo(rx * 0.12, -ry * 0.85); c.fill();
  if (lit) {
    c.fillStyle = '#ffd36a'; c.shadowColor = '#ffb23a'; c.shadowBlur = rx * 0.4;
    c.beginPath(); c.moveTo(-rx * 0.45, -ry * 0.2); c.lineTo(-rx * 0.2, -ry * 0.2); c.lineTo(-rx * 0.32, -ry * 0.5); c.fill();
    c.beginPath(); c.moveTo(rx * 0.45, -ry * 0.2); c.lineTo(rx * 0.2, -ry * 0.2); c.lineTo(rx * 0.32, -ry * 0.5); c.fill();
    c.beginPath(); c.moveTo(-rx * 0.55, ry * 0.15); c.quadraticCurveTo(0, ry * 0.75, rx * 0.55, ry * 0.15); c.quadraticCurveTo(rx * 0.3, ry * 0.32, rx * 0.15, ry * 0.25); c.lineTo(rx * 0.05, ry * 0.4); c.lineTo(-rx * 0.08, ry * 0.27); c.lineTo(-rx * 0.22, ry * 0.4); c.lineTo(-rx * 0.3, ry * 0.27); c.quadraticCurveTo(-rx * 0.45, ry * 0.3, -rx * 0.55, ry * 0.15); c.fill();
    c.shadowBlur = 0;
  }
  c.restore();
}
function fogBand(c, rand, y, h, col, n = 14, alpha = 0.22) { for (let i = 0; i < n; i++) { const x = rand() * 1000, w = 180 + rand() * 320, yy = y + (rand() - 0.5) * h; c.save(); c.translate(x, yy); c.scale(1, 0.32); c.fillStyle = rad(c, 0, 0, 0, w, [[0, hexA(col, alpha)], [1, hexA(col, 0)]]); c.fillRect(-w, -w, w * 2, w * 2); c.restore(); } }
function drawWeb(c, cx, cy, R, spokes, col, lw, r) {
  c.strokeStyle = col; c.lineWidth = lw; const angs = []; for (let i = 0; i < spokes; i++) angs.push(i / spokes * TAU + (r ? (r() - 0.5) * 0.15 : 0));
  c.beginPath(); angs.forEach(a => { c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); }); c.stroke();
  for (let k = 1; k <= 9; k++) { const q = R * k / 9; c.beginPath(); angs.forEach((a, i) => { const b = i + 1 === spokes ? angs[0] + TAU : angs[i + 1]; const m = (a + b) / 2, sag = q * 0.86; if (i === 0) c.moveTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q); c.quadraticCurveTo(cx + Math.cos(m) * sag, cy + Math.sin(m) * sag, cx + Math.cos(b) * q, cy + Math.sin(b) * q); }); c.stroke(); }
}
function dotBlob(c, x, y, R, col) { const r = seeded(Math.round(R * 1000) + col.length); c.save(); c.translate(x, y); c.fillStyle = rad(c, -R * 0.35, -R * 0.4, R * 0.1, R * 1.05, [[0, shade(col, 0.5)], [0.25, col], [1, shade(col, -0.45)]], 0, 0); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill(); c.lineWidth = R * 0.05; c.lineCap = 'round'; for (let i = 0; i < 90; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R; c.strokeStyle = r() < 0.5 ? shade(col, 0.35) : shade(col, -0.3); c.beginPath(); c.moveTo(Math.cos(a) * d, Math.sin(a) * d); c.lineTo(Math.cos(a) * (d + R * 0.15), Math.sin(a) * (d + R * 0.15)); c.stroke(); }
  for (const s of [-1, 1]) { c.fillStyle = '#f3efe6'; c.beginPath(); c.ellipse(s * R * 0.3, -R * 0.08, R * 0.2, R * 0.24, 0, 0, TAU); c.fill(); c.fillStyle = '#120a18'; c.beginPath(); c.arc(s * R * 0.3 + R * 0.04, -R * 0.04, R * 0.11, 0, TAU); c.fill(); } c.restore(); }
function spiderShape(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#0b070e'; c.lineWidth = 5; c.lineCap = 'round'; for (const k of [-1, 1]) for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(0, -4 + i * 6); c.lineTo(k * 24, -18 + i * 10); c.lineTo(k * 34, 4 + i * 10); c.stroke(); } c.fillStyle = '#0b070e'; c.beginPath(); c.ellipse(0, 4, 16, 20, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(0, -16, 10, 0, TAU); c.fill(); c.fillStyle = '#a3202a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(5, 7); c.lineTo(0, 14); c.lineTo(-5, 7); c.fill(); c.restore(); }
'use strict';
/* Backgrounds: 17 procedurally drawn dark Halloween scenes at 1000x1000 */
const BGS = [
  { id: 'graveyard', name: 'Graveyard Moon', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#120a24'], [0.6, '#2c1846'], [1, '#100818']]); c.fillRect(0, 0, 1000, 1000);
    stars(c, r, 140, 600); moon(c, 760, 230, 95);
    c.fillStyle = '#0d0716'; c.beginPath(); c.moveTo(0, 780); c.quadraticCurveTo(300, 700, 560, 760); c.quadraticCurveTo(820, 820, 1000, 740); c.lineTo(1000, 1000); c.lineTo(0, 1000); c.fill();
    [[110, 800, 90, 150], [260, 770, 70, 120], [820, 800, 100, 170], [940, 780, 60, 100], [700, 810, 60, 95]].forEach(([x, y, w, h]) => tomb(c, x, y + 30, w, h, '#1d1428'));
    c.fillStyle = '#1d1428'; c.fillRect(395, 640, 14, 120); c.fillRect(362, 672, 80, 14);
    tree(c, 70, 790, 520, r, '#0b0613', 16); fogBand(c, r, 830, 80, '#8f7bb8', 16, 0.18);
  } },
  { id: 'patch', name: 'Pumpkin Patch', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#1a0c1e'], [0.45, '#5a1f1c'], [0.62, '#b4521e'], [0.66, '#2a1410'], [1, '#120806']]); c.fillRect(0, 0, 1000, 1000);
    stars(c, r, 60, 300); moon(c, 220, 260, 70, '#ffb35c', 0.6);
    c.fillStyle = '#1b0e0b'; c.beginPath(); c.moveTo(0, 690); c.quadraticCurveTo(500, 600, 1000, 690); c.lineTo(1000, 1000); c.lineTo(0, 1000); c.fill();
    c.strokeStyle = '#2b3a14'; c.lineWidth = 5; c.beginPath(); for (let i = 0; i < 6; i++) { c.moveTo(r() * 1000, 720 + r() * 250); c.bezierCurveTo(r() * 1000, 700 + r() * 300, r() * 1000, 700 + r() * 300, r() * 1000, 720 + r() * 250); } c.stroke();
    for (let i = 0; i < 9; i++) pumpkinShape(c, 60 + i * 115 + r() * 30, 790 + r() * 120, 46 + r() * 30, 34 + r() * 18, '#d9601c', r() < 0.5);
  } },
  { id: 'mansion', name: 'Haunted Mansion', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#0b1024'], [0.7, '#24305a'], [1, '#0a0d1a']]); c.fillRect(0, 0, 1000, 1000); stars(c, r, 160, 650, '#cfd8f0'); moon(c, 190, 200, 80, '#e9c98a', 0.45);
    c.fillStyle = '#080a14'; c.beginPath(); c.moveTo(560, 760); c.lineTo(560, 470); c.lineTo(640, 400); c.lineTo(640, 330); c.lineTo(670, 260); c.lineTo(700, 330); c.lineTo(700, 400); c.lineTo(790, 360); c.lineTo(900, 450); c.lineTo(900, 380); c.lineTo(930, 330); c.lineTo(960, 380); c.lineTo(960, 760); c.fill();
    c.fillStyle = '#ffb347'; c.shadowColor = '#ff9a2e'; c.shadowBlur = 18; [[600, 520], [660, 520], [790, 470], [840, 470], [790, 600], [905, 560], [665, 370]].forEach(([x, y]) => { if (r() < 0.8) c.fillRect(x, y, 22, 34); }); c.shadowBlur = 0;
    c.fillStyle = '#070810'; c.fillRect(0, 760, 1000, 240); tree(c, 120, 780, 600, r, '#06070d', 18); fogBand(c, r, 780, 60, '#7d8cc0', 14, 0.2);
  } },
  { id: 'forest', name: "Witch's Wood", draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#06110f'], [0.5, '#143029'], [1, '#050b09']]); c.fillRect(0, 0, 1000, 1000);
    c.fillStyle = rad(c, 500, 380, 0, 520, [[0, 'rgba(120,200,150,0.18)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, 1000, 1000);
    for (let i = 0; i < 7; i++) tree(c, r() * 1000, 1000, 700 + r() * 400, r, i < 4 ? '#0c1d18' : '#040908', 14 + r() * 14);
    fogBand(c, r, 820, 120, '#9ad0b4', 20, 0.16); for (let i = 0; i < 26; i++) { const x = r() * 1000, y = 300 + r() * 650; c.fillStyle = rad(c, x, y, 0, 9, [[0, 'rgba(210,255,140,0.9)'], [1, 'rgba(210,255,140,0)']]); c.fillRect(x - 9, y - 9, 18, 18); }
  } },
  { id: 'crypt', name: 'Candle Crypt', draw(c, r) {
    c.fillStyle = '#140d10'; c.fillRect(0, 0, 1000, 1000);
    for (let y = 0; y < 1000; y += 62) for (let x = -((y / 62) % 2) * 60; x < 1000; x += 120) { c.fillStyle = `hsl(${15 + r() * 15},${12 + r() * 8}%,${9 + r() * 6}%)`; rr(c, x + 3, y + 3, 114, 56, 6); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(0, 0, 1000, 1000);
    [[120, 820], [200, 860], [830, 820], [900, 870], [760, 880], [270, 900]].forEach(([x, y]) => { const h = 70 + r() * 90; c.fillStyle = lin(c, x - 14, 0, x + 14, 0, [[0, '#8f7b5c'], [0.5, '#d8c49a'], [1, '#6e5c44']]); c.fillRect(x - 13, y - h, 26, h + 120);
      c.fillStyle = rad(c, x, y - h - 18, 0, 160, [[0, 'rgba(255,170,70,0.45)'], [1, 'rgba(255,140,40,0)']]); c.fillRect(x - 160, y - h - 178, 320, 320);
      c.fillStyle = '#ffd27a'; c.beginPath(); c.ellipse(x, y - h - 16, 8, 18, 0, 0, TAU); c.fill(); c.fillStyle = '#ffe9b0'; c.beginPath(); c.ellipse(x, y - h - 12, 3.5, 8, 0, 0, TAU); c.fill(); });
  } },
  { id: 'web', name: 'Spider Web', draw(c, r) { c.fillStyle = rad(c, 500, 450, 0, 760, [[0, '#3a1b4a'], [1, '#0b0610']]); c.fillRect(0, 0, 1000, 1000); drawWeb(c, 500, 430, 700, 14, 'rgba(210,190,230,0.22)', 2, r); } },
  { id: 'batsky', name: 'Bat Sky', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#0c0508'], [0.55, '#4a0f16'], [0.8, '#a2361d'], [1, '#1b0807']]); c.fillRect(0, 0, 1000, 1000); moon(c, 500, 520, 170, '#ff9a4a', 0.5);
    for (let i = 0; i < 40; i++) batShape(c, r() * 1000, r() * 700, 0.4 + r() * 1.1, (r() - 0.5) * 0.6, '#0a0406');
    c.fillStyle = '#0a0406'; c.beginPath(); c.moveTo(0, 860); for (let x = 0; x <= 1000; x += 50) c.lineTo(x, 840 + r() * 40); c.lineTo(1000, 1000); c.lineTo(0, 1000); c.fill();
  } },
  { id: 'swamp', name: 'Misty Swamp', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#071419'], [0.6, '#16363a'], [1, '#081315']]); c.fillRect(0, 0, 1000, 1000); moon(c, 820, 180, 60, '#d9e3b0', 0.4);
    c.fillStyle = '#0a1d1f'; c.fillRect(0, 760, 1000, 240); c.strokeStyle = '#06100f'; c.lineCap = 'round';
    for (let i = 0; i < 60; i++) { const x = r() * 1000; c.lineWidth = 3 + r() * 4; c.beginPath(); c.moveTo(x, 1000); c.quadraticCurveTo(x + (r() - 0.5) * 60, 860, x + (r() - 0.5) * 90, 660 + r() * 180); c.stroke(); }
    fogBand(c, r, 760, 120, '#a8d8c8', 24, 0.2); fogBand(c, r, 920, 60, '#a8d8c8', 14, 0.25);
  } },
  { id: 'server', name: 'Haunted Server Room', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#07090d'], [1, '#121820']]); c.fillRect(0, 0, 1000, 1000);
    for (const [x, w, s] of [[30, 170, 0.9], [230, 120, 0.7], [650, 120, 0.7], [800, 170, 0.9]]) { const top = 500 - 420 * s, h = 840 * s; c.fillStyle = '#0d1219'; rr(c, x, top, w, h, 6); c.fill(); c.strokeStyle = '#1d2733'; c.lineWidth = 2; c.stroke();
      for (let y = top + 20; y < top + h - 20; y += 26 * s) { c.fillStyle = '#151d27'; c.fillRect(x + 10, y, w - 20, 18 * s); for (let k = 0; k < 4; k++) if (r() < 0.55) { c.fillStyle = r() < 0.75 ? '#ff9a2e' : TOXIC; c.fillRect(x + w - 24 - k * 11, y + 6 * s, 5, 5); } } }
    c.fillStyle = rad(c, 500, 600, 0, 420, [[0, 'rgba(255,140,50,0.14)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, 1000, 1000); fogBand(c, r, 920, 60, '#6b7b90', 14, 0.2);
  } },
  { id: 'bloodmoon', name: 'Blood Moon', draw(c, r) {
    c.fillStyle = rad(c, 500, 380, 0, 760, [[0, '#3d0a10'], [1, '#080204']]); c.fillRect(0, 0, 1000, 1000); stars(c, r, 90, 1000, '#d9a0a0'); moon(c, 500, 360, 230, '#b0262c', 0.55);
    c.fillStyle = '#080204'; c.beginPath(); c.moveTo(0, 880); c.quadraticCurveTo(500, 800, 1000, 880); c.lineTo(1000, 1000); c.lineTo(0, 1000); c.fill();
  } },
  { id: 'starry', name: 'Starry Void', draw(c, r) {
    c.fillStyle = rad(c, 500, 500, 0, 720, [[0, '#18204a'], [0.6, '#0b0f26'], [1, '#05060f']]); c.fillRect(0, 0, 1000, 1000); stars(c, r, 380, 1000, '#d8def5');
    c.globalCompositeOperation = 'lighter'; c.fillStyle = rad(c, 300, 300, 0, 400, [[0, 'rgba(130,80,200,0.18)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, 1000, 1000); c.fillStyle = rad(c, 760, 720, 0, 380, [[0, 'rgba(40,140,170,0.15)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, 1000, 1000); c.globalCompositeOperation = 'source-over';
  } },
  { id: 'lab', name: 'Cauldron Lab', draw(c, r) {
    c.fillStyle = lin(c, 0, 0, 0, 1000, [[0, '#0a120a'], [1, '#132410']]); c.fillRect(0, 0, 1000, 1000);
    c.fillStyle = '#1a2416'; c.fillRect(0, 300, 1000, 16); c.fillRect(0, 560, 1000, 16);
    for (let i = 0; i < 12; i++) { const x = 40 + i * 82 + r() * 20, y = i % 2 ? 300 : 560, h = 60 + r() * 70, w = 30 + r() * 30, col = [TOXIC, '#b07cff', EMBER, '#2fb7a9'][i % 4];
      c.fillStyle = rad(c, x + w / 2, y - h / 2, 0, 90, [[0, hexA(col, 0.25)], [1, hexA(col, 0)]]); c.fillRect(x - 90, y - h - 90, 220, 220);
      c.fillStyle = hexA(col, 0.6); rr(c, x, y - h, w, h, 10); c.fill(); c.fillStyle = 'rgba(217,232,208,0.15)'; c.fillRect(x + 4, y - h + 6, 4, h - 14); c.fillStyle = '#3a2a1a'; c.fillRect(x + w / 2 - 6, y - h - 14, 12, 14); }
    c.fillStyle = rad(c, 500, 1000, 0, 500, [[0, 'rgba(143,227,107,0.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, 1000, 1000);
  } },
  { id: 'ember', name: 'Ember Glow', draw(c, r) { c.fillStyle = rad(c, 500, 560, 0, 720, [[0, '#7a2a0c'], [0.5, '#2a0d08'], [1, '#090303']]); c.fillRect(0, 0, 1000, 1000); for (let i = 0; i < 70; i++) { const x = r() * 1000, y = r() * 1000, s = 1 + r() * 3; c.fillStyle = hexA('#ffb35c', 0.3 + r() * 0.5); c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill(); } } },
  { id: 'plum', name: 'Midnight Plum', draw(c) { c.fillStyle = rad(c, 500, 420, 0, 760, [[0, '#4a2466'], [1, '#0e0614']]); c.fillRect(0, 0, 1000, 1000); } },
  { id: 'obsidian', name: 'Obsidian', draw(c) { c.fillStyle = rad(c, 500, 420, 0, 760, [[0, '#2a2433'], [1, '#050407']]); c.fillRect(0, 0, 1000, 1000); } },
  { id: 'teal', name: 'Spectral Teal', draw(c) { c.fillStyle = rad(c, 500, 420, 0, 760, [[0, '#145a5a'], [1, '#04100f']]); c.fillRect(0, 0, 1000, 1000); } },
  { id: 'spice', name: 'Pumpkin Spice', draw(c) { c.fillStyle = rad(c, 500, 420, 0, 760, [[0, '#a2461a'], [0.55, '#40150a'], [1, '#100504']]); c.fillRect(0, 0, 1000, 1000); } },
];
const bgCache = {};
function bgCanvas(id) { if (bgCache[id]) return bgCache[id]; const k = mk(1000, 1000), c = k.getContext('2d'); const b = BGS.find(b => b.id === id) || BGS[0]; b.draw(c, seeded(b.id.length * 97 + b.id.charCodeAt(0))); return (bgCache[id] = k); }
'use strict';
/* Hats & head gear, drawn in GrokButt ball units: head centre (0,0), radius 1. o = pose info, a = accent colour */
function fabric(c, y0, y1, col) { return lin(c, -1, y0, 1, y1, [[0, shade(col, 0.12)], [0.5, col], [1, shade(col, -0.5)]]); }
const HATS = [
  { id: 'none', name: 'None', draw() {} },
  { id: 'witch', name: 'Witch Hat', draw(c, o, a) { c.save(); c.translate(0.05, -0.78); c.rotate(0.12);
    c.fillStyle = fabric(c, 0, 0, '#21142d'); c.beginPath(); c.ellipse(0, 0.05, 1.05, 0.2, 0, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(-0.55, 0.02); c.quadraticCurveTo(-0.3, -0.6, 0.05, -1.05); c.quadraticCurveTo(0.35, -1.25, 0.7, -1.05); c.quadraticCurveTo(0.35, -0.95, 0.3, -0.6); c.quadraticCurveTo(0.45, -0.25, 0.55, 0.02); c.closePath(); c.fill();
    c.fillStyle = a; c.beginPath(); c.moveTo(-0.53, -0.06); c.quadraticCurveTo(0, -0.02, 0.53, -0.06); c.lineTo(0.5, -0.2); c.quadraticCurveTo(0, -0.17, -0.48, -0.2); c.fill();
    c.strokeStyle = GOLD; c.lineWidth = 0.035; c.strokeRect(-0.1, -0.19, 0.2, 0.15); c.restore(); } },
  { id: 'tophat', name: 'Top Hat', draw(c, o, a) { c.save(); c.translate(0, -0.86); c.rotate(-0.08); c.fillStyle = fabric(c, 0, 0, '#16121c'); c.beginPath(); c.ellipse(0, 0.06, 0.75, 0.13, 0, 0, TAU); c.fill(); rr(c, -0.42, -0.85, 0.84, 0.9, 0.06); c.fill(); c.fillStyle = a; c.fillRect(-0.42, -0.18, 0.84, 0.16); c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(-0.3, -0.8, 0.07, 0.6); c.restore(); } },
  { id: 'horns', name: 'Devil Horns', draw(c, o, a) { for (const s of [-1, 1]) { c.save(); c.translate(s * 0.5, -0.78); c.scale(s, 1); c.fillStyle = lin(c, 0, 0.1, 0.3, -0.5, [[0, shade(a, -0.4)], [1, shade(a, 0.25)]]); c.beginPath(); c.moveTo(-0.18, 0.12); c.quadraticCurveTo(-0.12, -0.35, 0.25, -0.55); c.quadraticCurveTo(0.05, -0.2, 0.18, 0.1); c.closePath(); c.fill(); c.restore(); } } },
  { id: 'catears', name: 'Cat Ears', draw(c, o, a) { for (const s of [-1, 1]) { c.save(); c.translate(s * 0.55, -0.72); c.rotate(s * 0.35); c.fillStyle = '#17121c'; c.beginPath(); c.moveTo(-0.28, 0.12); c.lineTo(0, -0.48); c.lineTo(0.28, 0.12); c.fill(); c.fillStyle = shade(a, -0.1); c.beginPath(); c.moveTo(-0.14, 0.05); c.lineTo(0, -0.28); c.lineTo(0.14, 0.05); c.fill(); c.restore(); } } },
  { id: 'wolfears', name: 'Wolf Ears', draw(c) { for (const s of [-1, 1]) { c.save(); c.translate(s * 0.55, -0.7); c.rotate(s * 0.4); c.fillStyle = '#4d4038'; c.beginPath(); c.moveTo(-0.3, 0.15); c.lineTo(-0.05, -0.55); c.lineTo(0.3, 0.15); c.fill(); c.strokeStyle = '#6e5e52'; c.lineWidth = 0.025; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-0.25 + i * 0.1, 0.12); c.lineTo(-0.2 + i * 0.09, -0.1); c.stroke(); } c.fillStyle = '#2a201c'; c.beginPath(); c.moveTo(-0.13, 0.08); c.lineTo(-0.04, -0.3); c.lineTo(0.13, 0.08); c.fill(); c.restore(); } } },
  { id: 'batears', name: 'Bat Ears', draw(c, o, a) { for (const s of [-1, 1]) { c.save(); c.translate(s * 0.5, -0.75); c.scale(s, 1); c.fillStyle = '#120c16'; c.beginPath(); c.moveTo(-0.25, 0.15); c.quadraticCurveTo(-0.2, -0.4, 0.25, -0.6); c.quadraticCurveTo(0.15, -0.2, 0.3, 0.1); c.fill(); c.fillStyle = hexA(a, 0.6); c.beginPath(); c.moveTo(-0.12, 0.08); c.quadraticCurveTo(-0.08, -0.25, 0.15, -0.4); c.quadraticCurveTo(0.08, -0.15, 0.16, 0.06); c.fill(); c.restore(); } } },
  { id: 'pumpkin', name: 'Pumpkin Helm', draw(c) { c.save(); c.translate(0, -0.9); pumpkinShape(c, 0, 0, 0.62, 0.36, '#e2621b', false); c.restore(); } },
  { id: 'stem', name: 'Pumpkin Stem', draw(c) { c.fillStyle = '#4b5d23'; c.beginPath(); c.moveTo(-0.1, -0.97); c.quadraticCurveTo(-0.08, -1.3, 0.12, -1.38); c.lineTo(0.14, -1.28); c.quadraticCurveTo(0.06, -1.22, 0.08, -0.97); c.fill(); c.strokeStyle = '#5f7a2a'; c.lineWidth = 0.035; c.beginPath(); c.moveTo(0.05, -1.1); c.bezierCurveTo(0.3, -1.25, 0.4, -1.0, 0.25, -0.98); c.stroke(); c.fillStyle = '#3f6a22'; c.beginPath(); c.ellipse(-0.25, -1.05, 0.17, 0.08, -0.4, 0, TAU); c.fill(); } },
  { id: 'crown', name: 'Bone Crown', draw(c, o, a) { c.save(); c.translate(0, -0.9); c.fillStyle = lin(c, 0, -0.4, 0, 0.1, [[0, shade(GOLD, 0.3)], [1, shade(GOLD, -0.4)]]); c.beginPath(); c.moveTo(-0.5, 0.1); c.lineTo(-0.55, -0.3); c.lineTo(-0.28, -0.1); c.lineTo(0, -0.42); c.lineTo(0.28, -0.1); c.lineTo(0.55, -0.3); c.lineTo(0.5, 0.1); c.closePath(); c.fill(); c.fillStyle = a; [-0.3, 0, 0.3].forEach(x => { c.beginPath(); c.arc(x, -0.02, 0.06, 0, TAU); c.fill(); }); c.restore(); } },
  { id: 'wizard', name: 'SI Wizard Hat', draw(c, o, a) { c.save(); c.translate(0, -0.82); c.rotate(-0.1); c.fillStyle = fabric(c, 0, 0, '#2a1d5c'); c.beginPath(); c.ellipse(0, 0.04, 0.85, 0.16, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-0.5, 0.02); c.lineTo(0.1, -1.35); c.lineTo(0.5, 0.02); c.fill(); c.fillStyle = a; star(c, -0.05, -0.45, 0.1); star(c, 0.18, -0.15, 0.07); star(c, 0.06, -0.85, 0.06); c.restore(); } },
  { id: 'pirate', name: 'Ghost Pirate', draw(c, o, a) { c.save(); c.translate(0, -0.85); c.fillStyle = fabric(c, 0, 0, '#16111a'); c.beginPath(); c.moveTo(-0.95, 0.05); c.quadraticCurveTo(-0.6, -0.65, 0, -0.55); c.quadraticCurveTo(0.6, -0.65, 0.95, 0.05); c.quadraticCurveTo(0, -0.12, -0.95, 0.05); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 0.035; c.beginPath(); c.moveTo(-0.9, 0.02); c.quadraticCurveTo(0, -0.15, 0.9, 0.02); c.stroke();
    c.fillStyle = BONE; c.beginPath(); c.arc(0, -0.3, 0.1, 0, TAU); c.fill(); c.strokeStyle = BONE; c.lineWidth = 0.04; c.beginPath(); c.moveTo(-0.15, -0.12); c.lineTo(0.15, -0.38); c.moveTo(0.15, -0.12); c.lineTo(-0.15, -0.38); c.stroke(); c.fillStyle = '#16111a'; c.fillRect(-0.05, -0.33, 0.035, 0.035); c.fillRect(0.015, -0.33, 0.035, 0.035); c.restore(); } },
  { id: 'straw', name: 'Scarecrow Hat', draw(c, o, a) { c.save(); c.translate(0, -0.84); c.rotate(0.08); c.fillStyle = lin(c, -1, 0, 1, 0, [[0, '#8a6a32'], [0.5, '#c9a35a'], [1, '#6c5026']]); c.beginPath(); c.ellipse(0, 0.04, 1.0, 0.18, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-0.45, 0.02); c.quadraticCurveTo(-0.4, -0.5, 0, -0.52); c.quadraticCurveTo(0.4, -0.5, 0.45, 0.02); c.fill(); c.fillStyle = a; c.fillRect(-0.44, -0.14, 0.88, 0.1); c.strokeStyle = '#d8b56a'; c.lineWidth = 0.02; for (let i = 0; i < 9; i++) { const x = -0.95 + i * 0.24; c.beginPath(); c.moveTo(x, 0.1); c.lineTo(x + 0.05, 0.26); c.stroke(); } c.restore(); } },
  { id: 'frankhair', name: 'Franken Flat-top', draw(c) { c.fillStyle = '#141018'; c.beginPath(); c.moveTo(-0.72, -0.6); c.lineTo(-0.7, -1.02); c.lineTo(0.7, -1.02); c.lineTo(0.72, -0.6); c.quadraticCurveTo(0.3, -0.75, 0, -0.68); c.lineTo(-0.15, -0.58); c.lineTo(-0.3, -0.7); c.quadraticCurveTo(-0.55, -0.7, -0.72, -0.6); c.fill();
    for (const s of [-1, 1]) { c.fillStyle = lin(c, s * 0.95, 0, s * 1.2, 0, [[0, '#5f6670'], [1, '#c4cad4']]); c.fillRect(s > 0 ? 0.93 : -1.17, 0.18, 0.24, 0.16); c.fillStyle = '#3a3f46'; c.fillRect(s > 0 ? 1.12 : -1.2, 0.13, 0.08, 0.26); } } },
  { id: 'candycorn', name: 'Candy Corn Cap', draw(c) { c.save(); c.translate(0, -0.82); c.rotate(-0.06); const pts = [[-0.5, 0.05], [0.5, 0.05], [0, -0.95]]; c.save(); c.beginPath(); c.moveTo(...pts[0]); c.lineTo(...pts[1]); c.lineTo(...pts[2]); c.closePath(); c.clip(); c.fillStyle = '#f0d9a6'; c.fillRect(-1, -1, 2, 2); c.fillStyle = '#f08a1c'; c.fillRect(-1, -0.6, 2, 0.4); c.fillStyle = '#f5c419'; c.fillRect(-1, -0.2, 2, 0.4); c.restore(); c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(-0.1, -0.7, 0.05, 0.6); c.restore(); } },
  { id: 'clawhelm', name: 'Clawdeth Shell', draw(c) { const T = '#d9774f', S = '#a9553c', U = '#ee9a7e'; c.save(); c.translate(0, -0.95); const px = 0.14;
    for (let i = -4; i <= 4; i++) { const h = 3 - Math.floor(Math.abs(i) / 2); for (let j = 0; j < h; j++) { c.fillStyle = j === h - 1 ? U : (i + j) % 2 ? T : S; c.fillRect(i * px - px / 2, -j * px, px, px); } }
    for (const s of [-1, 1]) { c.fillStyle = S; c.fillRect(s * 0.28 - 0.03, -0.7, 0.06, 0.32); c.fillStyle = '#120a18'; c.fillRect(s * 0.28 - 0.08, -0.84, 0.16, 0.16); c.fillStyle = '#f3efe6'; c.fillRect(s * 0.28 - 0.02, -0.8, 0.05, 0.05); } c.restore(); } },
  { id: 'bow', name: 'Spooky Bow', draw(c, o, a) { c.save(); c.translate(0.45, -0.82); c.rotate(0.3); c.fillStyle = a; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(s * 0.35, -0.35, s * 0.4, 0); c.quadraticCurveTo(s * 0.35, 0.3, 0, 0); c.fill(); } c.fillStyle = shade(a, -0.35); c.beginPath(); c.arc(0, 0, 0.08, 0, TAU); c.fill(); c.fillStyle = '#0d0910'; c.beginPath(); c.arc(0.18, -0.06, 0.03, 0, TAU); c.arc(-0.2, 0.06, 0.03, 0, TAU); c.fill(); c.restore(); } },
];
'use strict';
/* Eyes, mouths and face paint. o.eyes = pill eyes of the current pose in ball units, o.mouth = mouth anchor, o.ms = mouth scale */
function eyeBox(o) { let x0 = 9, x1 = -9, y0 = 9, y1 = -9; o.eyes.forEach(e => { x0 = Math.min(x0, e.x - e.w * 0.8); x1 = Math.max(x1, e.x + e.w * 0.8); y0 = Math.min(y0, e.y - e.h / 2); y1 = Math.max(y1, e.y + e.h / 2); }); return { x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }; }
function glowEyes(col, a = 0.75) { return (c, o) => { o.eyes.forEach(e => { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rad(c, e.x, e.y, 0, e.h * 0.95, [[0, hexA(col, a)], [1, hexA(col, 0)]]); c.fillRect(e.x - e.h, e.y - e.h, e.h * 2, e.h * 2); c.restore();
  pillPath(c, e.x, e.y, e.w * 1.02, e.h * 1.02, e.rot); c.fillStyle = lin(c, 0, e.y - e.h / 2, 0, e.y + e.h / 2, [[0, shade(col, 0.55)], [0.6, col], [1, shade(col, -0.35)]]); c.fill();
  pillPath(c, e.x - e.w * 0.12, e.y - e.h * 0.2, e.w * 0.28, e.h * 0.3, e.rot); c.fillStyle = 'rgba(255,250,235,0.75)'; c.fill(); }); }; }
const EYES = [
  { id: 'none', name: 'Classic', draw() {} },
  { id: 'ember', name: 'Ember Glow', draw: glowEyes('#ff8a1f') },
  { id: 'toxic', name: 'Toxic Glow', draw: glowEyes('#8fe36b') },
  { id: 'violet', name: 'Spectral', draw: glowEyes('#a98bff') },
  { id: 'blood', name: 'Blood Eyes', draw: glowEyes('#e0303a', 0.22) },
  { id: 'shades', name: 'Pixel Shades', draw(c, o) { const b = eyeBox(o), px = (b.x1 - b.x0) / 14; c.fillStyle = '#07050a'; c.fillRect(b.x0 - px, b.cy - px * 2.5, b.x1 - b.x0 + px * 2, px * 1.3);
    o.eyes.forEach(e => { c.fillRect(e.x - px * 3, b.cy - px * 2, px * 6, px * 4); c.fillRect(e.x - px * 2, b.cy + px * 2, px * 4, px); c.fillStyle = 'rgba(255,255,255,0.55)'; c.fillRect(e.x - px * 2, b.cy - px, px, px); c.fillRect(e.x - px, b.cy, px, px); c.fillStyle = '#07050a'; }); } },
  { id: 'patch', name: 'Eye Patch', draw(c, o) { const e = o.eyes[o.eyes.length - 1]; c.strokeStyle = '#0c090f'; c.lineWidth = 0.05; c.beginPath(); c.moveTo(-1.02, -0.55); c.lineTo(e.x, e.y - e.h * 0.1); c.lineTo(1.02, -0.2); c.stroke(); c.fillStyle = '#0c090f'; c.beginPath(); c.ellipse(e.x, e.y, e.w * 1.2, e.h * 0.62, 0, 0, TAU); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 0.02; c.stroke(); } },
  { id: 'monocle', name: 'Monocle', draw(c, o) { const e = o.eyes[o.eyes.length - 1]; c.strokeStyle = GOLD; c.lineWidth = 0.035; c.beginPath(); c.arc(e.x, e.y, e.h * 0.62, 0, TAU); c.stroke(); c.fillStyle = 'rgba(200,220,255,0.12)'; c.fill(); c.lineWidth = 0.015; c.beginPath(); c.moveTo(e.x + e.h * 0.5, e.y + e.h * 0.35); c.quadraticCurveTo(e.x + 0.3, e.y + 0.8, e.x + 0.1, 1.0); c.stroke(); } },
  { id: 'mask', name: 'Masquerade', draw(c, o, a) { const b = eyeBox(o), w = b.x1 - b.x0; c.save(); c.translate(b.cx, b.cy); c.fillStyle = lin(c, -w, 0, w, 0, [[0, shade(a, -0.5)], [0.5, a], [1, shade(a, -0.5)]]); c.beginPath(); c.moveTo(-w * 0.75, -0.12); c.quadraticCurveTo(-w * 0.4, -0.42, 0, -0.18); c.quadraticCurveTo(w * 0.4, -0.42, w * 0.75, -0.12); c.quadraticCurveTo(w * 0.7, 0.3, w * 0.25, 0.25); c.quadraticCurveTo(0, 0.1, -w * 0.25, 0.25); c.quadraticCurveTo(-w * 0.7, 0.3, -w * 0.75, -0.12); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 0.02; c.stroke(); c.restore();
    o.eyes.forEach(e => { pillPath(c, e.x, e.y, e.w, e.h * 0.9, e.rot); c.fillStyle = '#060408'; c.fill(); }); } },
  { id: 'lashes', name: 'Spooky Lashes', draw(c, o) { c.strokeStyle = '#060408'; c.lineCap = 'round'; c.lineWidth = 0.028; o.eyes.forEach(e => { for (let i = -2; i <= 2; i++) { const a = -Math.PI / 2 + i * 0.35, x = e.x + Math.cos(a) * e.w * 0.5, y = e.y - e.h * 0.42 + Math.sin(a) * e.w * 0.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 0.1, y + Math.sin(a) * 0.12); c.stroke(); } }); } },
  { id: 'goggles', name: 'Lab Goggles', draw(c, o) { const b = eyeBox(o); c.strokeStyle = '#3a2a1a'; c.lineWidth = 0.07; c.beginPath(); c.moveTo(-1.02, b.cy - 0.08); c.lineTo(1.02, b.cy - 0.08); c.stroke(); o.eyes.forEach(e => { const r = e.h * 0.6; c.fillStyle = 'rgba(143,227,107,0.22)'; c.beginPath(); c.arc(e.x, e.y, r, 0, TAU); c.fill(); c.strokeStyle = '#8a6a3a'; c.lineWidth = 0.06; c.stroke(); c.strokeStyle = '#c99a52'; c.lineWidth = 0.02; c.stroke(); }); } },
];
const MOUTHS = [
  { id: 'none', name: 'None', draw() {} },
  { id: 'fangs', name: 'Vampire Fangs', draw(c, o) { mouthAt(c, o, () => { c.strokeStyle = '#0a070c'; c.lineWidth = 0.035; c.lineCap = 'round'; c.beginPath(); c.moveTo(-0.22, 0); c.quadraticCurveTo(0, 0.08, 0.22, 0); c.stroke(); for (const s of [-1, 1]) { c.fillStyle = '#f2ebdc'; c.beginPath(); c.moveTo(s * 0.06, 0.035); c.lineTo(s * 0.15, 0.025); c.lineTo(s * 0.105, 0.2); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 0.01; c.stroke(); } }); } },
  { id: 'bloodfangs', name: 'Bloody Fangs', draw(c, o) { MOUTHS[1].draw(c, o); mouthAt(c, o, () => { c.fillStyle = '#9e1420'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 0.105, 0.24, 0.018, 0.04, 0, 0, TAU); c.fill(); } c.beginPath(); c.ellipse(-0.18, 0.1, 0.015, 0.05, 0, 0, TAU); c.fill(); }); } },
  { id: 'grin', name: 'Jack Grin', draw(c, o) { mouthAt(c, o, () => { c.fillStyle = '#0a070c'; c.beginPath(); c.moveTo(-0.3, -0.04); c.quadraticCurveTo(0, 0.36, 0.3, -0.04); c.quadraticCurveTo(0.2, 0.04, 0.12, 0.02); c.lineTo(0.08, 0.1); c.lineTo(0.02, 0.04); c.lineTo(-0.06, 0.04); c.lineTo(-0.1, 0.12); c.lineTo(-0.14, 0.03); c.quadraticCurveTo(-0.22, 0.04, -0.3, -0.04); c.fill(); }); } },
  { id: 'stitched', name: 'Stitched', draw(c, o) { mouthAt(c, o, () => { c.strokeStyle = '#0a070c'; c.lineWidth = 0.03; c.lineCap = 'round'; c.beginPath(); c.moveTo(-0.25, 0.02); c.quadraticCurveTo(0, 0.08, 0.25, 0.02); c.stroke(); c.lineWidth = 0.02; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 0.1, -0.03); c.lineTo(i * 0.1 + 0.01, 0.1); c.stroke(); } }); } },
  { id: 'wolf', name: 'Wolf Snarl', draw(c, o) { mouthAt(c, o, () => { c.fillStyle = '#1a0c0e'; c.beginPath(); c.moveTo(-0.25, 0); c.quadraticCurveTo(0, -0.06, 0.25, 0); c.quadraticCurveTo(0, 0.22, -0.25, 0); c.fill(); c.fillStyle = '#efe6d2'; for (let i = -3; i <= 3; i++) { const x = i * 0.065; c.beginPath(); c.moveTo(x - 0.03, -0.02); c.lineTo(x + 0.03, -0.02); c.lineTo(x, Math.abs(i) === 2 ? 0.12 : 0.06); c.fill(); } }); } },
  { id: 'mustache', name: 'Villain Stache', draw(c, o) { mouthAt(c, o, () => { c.fillStyle = '#120c10'; for (const s of [-1, 1]) { c.save(); c.scale(s, 1); c.beginPath(); c.moveTo(0, -0.04); c.quadraticCurveTo(0.15, -0.1, 0.28, 0); c.quadraticCurveTo(0.38, 0.06, 0.4, -0.08); c.quadraticCurveTo(0.42, 0.1, 0.26, 0.08); c.quadraticCurveTo(0.12, 0.06, 0, 0.04); c.fill(); c.restore(); } }); } },
  { id: 'smile', name: 'Cute Smile', draw(c, o) { mouthAt(c, o, () => { c.strokeStyle = '#0a070c'; c.lineWidth = 0.035; c.lineCap = 'round'; c.beginPath(); c.arc(0, -0.06, 0.12, 0.35, Math.PI - 0.35); c.stroke(); }); } },
];
function mouthAt(c, o, fn) { c.save(); c.translate(o.mouth.x, o.mouth.y); c.scale(o.ms, o.ms); fn(); c.restore(); }
const FACES = [
  { id: 'none', name: 'None', draw() {} },
  { id: 'stitches', name: 'Stitches', draw(c, o) { c.strokeStyle = '#2a1a22'; c.lineWidth = 0.025; c.lineCap = 'round'; c.beginPath(); c.moveTo(-0.8, -0.55); c.quadraticCurveTo(-0.4, -0.35, -0.15, -0.6); c.stroke(); for (let i = 0; i < 6; i++) { const t = i / 5, x = -0.8 + t * 0.65, y = -0.55 + Math.sin(t * Math.PI) * 0.1 - t * 0.05; c.beginPath(); c.moveTo(x - 0.02, y - 0.06); c.lineTo(x + 0.02, y + 0.06); c.stroke(); } } },
  { id: 'skull', name: 'Skull Paint', draw(c, o) { o.eyes.forEach(e => { c.fillStyle = 'rgba(12,8,14,0.85)'; c.beginPath(); c.ellipse(e.x, e.y + 0.02, e.w * 1.25, e.h * 0.68, 0, 0, TAU); c.fill(); }); mouthAt(c, o, () => { c.fillStyle = 'rgba(12,8,14,0.85)'; c.beginPath(); c.moveTo(0, -0.14); c.lineTo(0.06, -0.04); c.lineTo(-0.06, -0.04); c.fill(); c.strokeStyle = 'rgba(12,8,14,0.85)'; c.lineWidth = 0.02; c.beginPath(); c.moveTo(-0.28, 0.06); c.lineTo(0.28, 0.06); c.stroke(); for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 0.08, 0.0); c.lineTo(i * 0.08, 0.12); c.stroke(); } }); } },
  { id: 'web', name: 'Web Paint', draw(c) { c.save(); c.translate(0.55, -0.55); drawWeb(c, 0, 0, 0.5, 7, 'rgba(20,12,24,0.6)', 0.012); c.restore(); } },
  { id: 'whiskers', name: 'Whiskers', draw(c, o) { mouthAt(c, o, () => { c.fillStyle = '#1a1018'; c.beginPath(); c.moveTo(-0.06, -0.12); c.lineTo(0.06, -0.12); c.lineTo(0, -0.05); c.fill(); c.strokeStyle = '#1a1018'; c.lineWidth = 0.018; for (const s of [-1, 1]) for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(s * 0.18, -0.06 + i * 0.05); c.lineTo(s * 0.55, -0.1 + i * 0.1); c.stroke(); } }); } },
  { id: 'scars', name: 'Battle Scars', draw(c, o) { c.strokeStyle = 'rgba(120,30,40,0.7)'; c.lineWidth = 0.03; c.lineCap = 'round'; const e = o.eyes[0]; c.beginPath(); c.moveTo(e.x - 0.1, e.y - 0.4); c.lineTo(e.x + 0.12, e.y + 0.4); c.stroke(); c.beginPath(); c.moveTo(0.4, 0.45); c.lineTo(0.65, 0.3); c.stroke(); } },
  { id: 'bolt', name: 'Lightning Mark', draw(c) { c.fillStyle = hexA(GOLD, 0.9); c.beginPath(); c.moveTo(0.05, -0.92); c.lineTo(-0.1, -0.68); c.lineTo(0.0, -0.68); c.lineTo(-0.08, -0.48); c.lineTo(0.12, -0.74); c.lineTo(0.02, -0.74); c.closePath(); c.fill(); } },
];
'use strict';
/* Outfits (paint = clipped to GrokButt's body and shaded by the render; over = drawn on top), backs/capes, and props */
function wrapBands(c, r, col, n) { for (let i = 0; i < n; i++) { const y = -1 + (i + r()) * 2 / n, a = (r() - 0.5) * 0.5, h = 0.1 + r() * 0.06; c.save(); c.translate(0, y); c.rotate(a); c.fillStyle = shade(col, (r() - 0.5) * 0.15); c.fillRect(-1.3, -h / 2, 2.6, h); c.strokeStyle = 'rgba(90,70,40,0.35)'; c.lineWidth = 0.012; c.strokeRect(-1.3, -h / 2, 2.6, h); c.restore(); } }
const OUTFITS = [
  { id: 'none', name: 'None' },
  { id: 'mummy', name: 'Mummy Wraps', paint(c, o) { const r = seeded(7); wrapBands(c, r, '#e3d3ae', 15); c.globalCompositeOperation = 'destination-out'; o.eyes.forEach(e => { c.beginPath(); c.ellipse(e.x, e.y, e.w * 1.1, e.h * 0.62, 0, 0, TAU); c.fill(); }); c.globalCompositeOperation = 'source-over'; } },
  { id: 'pumpkin', name: 'Pumpkin Skin', paint(c) { c.fillStyle = '#f07a22'; c.fillRect(-1.3, -1.3, 2.6, 2.6); c.strokeStyle = 'rgba(110,40,5,0.45)'; c.lineWidth = 0.04; for (const x of [-0.75, -0.4, 0, 0.4, 0.75]) { c.beginPath(); c.moveTo(x * 0.6, -1.05); c.quadraticCurveTo(x * 1.4, 0, x * 0.6, 1.05); c.stroke(); } } },
  { id: 'bones', name: 'Skeleton Suit', paint(c, o) { c.fillStyle = '#17121c'; c.fillRect(-1.3, -1.3, 2.6, 2.6); c.fillStyle = '#efe4cc'; c.beginPath(); c.ellipse(o.face, -0.05, 0.75, 0.68, 0, 0, TAU); c.fill(); c.fillRect(o.face - 0.06, 0.55, 0.12, 0.5); for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(o.face, 0.72 + i * 0.12, 0.35 - i * 0.07, 0.035, 0, 0, TAU); c.fill(); } } },
  { id: 'dotz', name: 'Dotz Fuzz', paint(c) { const r = seeded(3); c.fillStyle = '#6a3fc4'; c.fillRect(-1.3, -1.3, 2.6, 2.6); c.lineWidth = 0.025; c.lineCap = 'round'; for (let i = 0; i < 700; i++) { const x = (r() - 0.5) * 2.4, y = (r() - 0.5) * 2.4, a = r() * TAU; c.strokeStyle = r() < 0.5 ? '#9b72f0' : '#3f2280'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 0.09, y + Math.sin(a) * 0.09); c.stroke(); } c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.ellipse(0, 0, 0.6, 0.45, 0, 0, TAU); c.fill(); c.globalCompositeOperation = 'source-over'; } },
  { id: 'burlap', name: 'Scarecrow Burlap', paint(c) { c.fillStyle = '#b48a52'; c.fillRect(-1.3, -1.3, 2.6, 2.6); c.strokeStyle = 'rgba(80,55,25,0.35)'; c.lineWidth = 0.012; for (let i = -13; i <= 13; i++) { c.beginPath(); c.moveTo(i * 0.1, -1.3); c.lineTo(i * 0.1, 1.3); c.moveTo(-1.3, i * 0.1); c.lineTo(1.3, i * 0.1); c.stroke(); } c.strokeStyle = '#4a3418'; c.lineWidth = 0.025; c.beginPath(); c.moveTo(-0.9, 0.55); c.lineTo(0.9, 0.55); c.stroke(); for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(i * 0.1, 0.5); c.lineTo(i * 0.1 + 0.03, 0.6); c.stroke(); } } },
  { id: 'candy', name: 'Candy Stripes', paint(c, o, a) { c.fillStyle = '#f0e2c4'; c.fillRect(-1.3, -1.3, 2.6, 2.6); c.fillStyle = a; c.save(); c.rotate(-0.6); for (let i = -6; i <= 6; i++) c.fillRect(i * 0.34, -2, 0.15, 4); c.restore(); } },
  { id: 'jolly', name: 'Jollybob Fur', paint(c, o) { const r = seeded(11); c.fillStyle = '#c9a77c'; c.fillRect(-1.3, -1.3, 2.6, 2.6); c.lineWidth = 0.03; c.lineCap = 'round'; for (let i = 0; i < 600; i++) { const x = (r() - 0.5) * 2.4, y = (r() - 0.5) * 2.4; c.strokeStyle = r() < 0.5 ? '#e0c49a' : '#9a7a52'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 0.06, y + 0.1); c.stroke(); } c.globalCompositeOperation = 'destination-out'; const b = eyeBox(o); c.beginPath(); c.ellipse(b.cx, b.cy + 0.15, (b.x1 - b.x0) / 2 + 0.2, 0.55, 0, 0, TAU); c.fill(); c.globalCompositeOperation = 'source-over'; } },
  { id: 'spiderweb', name: 'Web Wrap', paint(c) { drawWeb(c, 0.2, -0.3, 1.6, 12, 'rgba(60,40,70,0.75)', 0.018); } },
  { id: 'sheet', name: 'Ghost Sheet', over(c, o) { c.fillStyle = lin(c, -1, -1, 1, 1, [[0, '#d7d0ea'], [0.6, '#a59cc6'], [1, '#6f6696']]); c.globalAlpha = 0.97; c.beginPath(); c.moveTo(-1.08, 0.9); c.bezierCurveTo(-1.25, -0.2, -0.95, -1.12, 0, -1.12); c.bezierCurveTo(0.95, -1.12, 1.25, -0.2, 1.08, 0.9); for (let i = 0; i < 6; i++) { const x0 = 1.08 - i * 0.36; c.quadraticCurveTo(x0 - 0.09, 1.18, x0 - 0.18, 1.0); c.quadraticCurveTo(x0 - 0.27, 0.85, x0 - 0.36, 1.05); } c.closePath(); c.fill(); c.globalAlpha = 1;
    c.strokeStyle = 'rgba(70,60,110,0.3)'; c.lineWidth = 0.025; for (const x of [-0.6, 0.15, 0.7]) { c.beginPath(); c.moveTo(x, 0.05); c.quadraticCurveTo(x - 0.08, 0.5, x + 0.04, 0.95); c.stroke(); }
    o.eyes.forEach(e => { pillPath(c, e.x, e.y, e.w, e.h, e.rot); c.fillStyle = '#07050a'; c.fill(); }); } },
  { id: 'bowtie', name: 'Bowtie', over(c, o, a) { c.save(); c.translate(o.face, 0.85); c.fillStyle = a; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0, 0); c.lineTo(s * 0.26, -0.13); c.lineTo(s * 0.26, 0.13); c.closePath(); c.fill(); } c.fillStyle = shade(a, -0.4); c.beginPath(); c.arc(0, 0, 0.06, 0, TAU); c.fill(); c.restore(); } },
];
function capeShape(c, col, w, h, inner) { c.fillStyle = lin(c, -w, 0, w, 0, [[0, shade(col, -0.55)], [0.5, col], [1, shade(col, -0.55)]]); c.beginPath(); c.moveTo(-0.6, -0.2); c.quadraticCurveTo(-w, 0.3, -w * 1.05, h); for (let i = 0; i < 4; i++) { const x = -w * 1.05 + (i + 1) * w * 2.1 / 4; c.quadraticCurveTo(x - w * 0.26, h - 0.12, x, h); } c.quadraticCurveTo(w, 0.3, 0.6, -0.2); c.closePath(); c.fill(); if (inner) { c.fillStyle = hexA(inner, 0.85); c.beginPath(); c.moveTo(-0.55, -0.1); c.quadraticCurveTo(-w * 0.8, 0.4, -w * 0.85, h - 0.08); c.lineTo(w * 0.85, h - 0.08); c.quadraticCurveTo(w * 0.8, 0.4, 0.55, -0.1); c.fill(); } }
const BACKS = [
  { id: 'none', name: 'None' },
  { id: 'vcape', name: 'Vampire Cape', back(c, o, a) { capeShape(c, '#120a12', 1.35, 1.25, shade(a, -0.15)); for (const s of [-1, 1]) { c.fillStyle = '#120a12'; c.beginPath(); c.moveTo(s * 0.55, 0.2); c.lineTo(s * 1.35, -0.85); c.lineTo(s * 1.0, 0.45); c.fill(); c.fillStyle = shade(a, -0.15); c.beginPath(); c.moveTo(s * 0.62, 0.2); c.lineTo(s * 1.25, -0.7); c.lineTo(s * 0.98, 0.35); c.fill(); } },
    front(c, o) { for (const s of [-1, 1]) { c.fillStyle = lin(c, 0, 0.6, s * 0.9, 1.1, [[0, '#2a1622'], [1, '#0a050a']]); c.beginPath(); c.moveTo(s * 0.05, 0.98); c.quadraticCurveTo(s * 0.55, 0.92, s * 0.95, 0.55); c.lineTo(s * 1.02, 0.85); c.quadraticCurveTo(s * 0.55, 1.12, s * 0.05, 1.08); c.fill(); } c.fillStyle = GOLD; c.beginPath(); c.arc(0, 1.03, 0.06, 0, TAU); c.fill(); } },
  { id: 'cloak', name: 'Witch Cloak', back(c, o, a) { capeShape(c, '#21142d', 1.3, 1.22, null); } },
  { id: 'robe', name: 'Wizard Robe', back(c, o, a) { capeShape(c, '#2a1d5c', 1.3, 1.22, null); c.fillStyle = a; star(c, -1.0, 0.6, 0.08); star(c, 1.05, 0.4, 0.07); star(c, 0.95, 0.95, 0.06); } },
  { id: 'batwings', name: 'Bat Wings', back(c, o, a) { for (const s of [-1, 1]) { c.save(); c.scale(s, 1); c.fillStyle = lin(c, 0.6, 0, 2, 0, [[0, '#1a1020'], [1, '#07040a']]); c.beginPath(); c.moveTo(0.7, -0.15); c.quadraticCurveTo(1.3, -0.9, 2.0, -0.55); c.quadraticCurveTo(1.9, -0.15, 1.95, 0.25); c.quadraticCurveTo(1.7, 0.05, 1.55, 0.35); c.quadraticCurveTo(1.35, 0.15, 1.2, 0.45); c.quadraticCurveTo(1.0, 0.25, 0.8, 0.4); c.closePath(); c.fill(); c.strokeStyle = hexA(a, 0.35); c.lineWidth = 0.02; for (const [x, y] of [[1.95, 0.25], [1.55, 0.35], [1.2, 0.45]]) { c.beginPath(); c.moveTo(0.85, -0.2); c.lineTo(x, y); c.stroke(); } c.restore(); } } },
  { id: 'devtail', name: 'Devil Tail', back(c, o, a) { c.strokeStyle = shade(a, -0.2); c.lineWidth = 0.07; c.lineCap = 'round'; c.beginPath(); c.moveTo(0.6, 0.6); c.bezierCurveTo(1.4, 0.9, 1.5, 0.0, 1.25, -0.25); c.stroke(); c.fillStyle = shade(a, -0.2); c.beginPath(); c.moveTo(1.25, -0.25); c.lineTo(1.05, -0.35); c.lineTo(1.28, -0.58); c.lineTo(1.42, -0.3); c.closePath(); c.fill(); } },
  { id: 'cattail', name: 'Cat Tail', back(c) { c.strokeStyle = '#17121c'; c.lineWidth = 0.13; c.lineCap = 'round'; c.beginPath(); c.moveTo(0.6, 0.7); c.bezierCurveTo(1.5, 0.8, 1.2, -0.2, 1.45, -0.55); c.stroke(); } },
  { id: 'wolftail', name: 'Wolf Tail', back(c) { c.fillStyle = lin(c, 0.6, 0.6, 1.6, -0.4, [[0, '#4d4038'], [1, '#8a7a6a']]); c.beginPath(); c.moveTo(0.6, 0.5); c.quadraticCurveTo(1.5, 0.75, 1.65, -0.35); c.quadraticCurveTo(1.35, 0.0, 0.8, 0.85); c.fill(); } },
  { id: 'hood', name: 'Reaper Hood', back(c) { c.fillStyle = lin(c, -1.4, 0, 1.4, 0, [[0, '#05040a'], [0.5, '#1b1725'], [1, '#05040a']]); c.beginPath(); c.moveTo(-1.4, 1.3); c.quadraticCurveTo(-1.45, -1.35, 0.1, -1.38); c.quadraticCurveTo(1.45, -1.3, 1.4, 1.3); c.closePath(); c.fill(); },
    front(c) { c.strokeStyle = '#100d16'; c.lineWidth = 0.16; c.beginPath(); c.moveTo(-1.08, 0.95); c.quadraticCurveTo(-1.25, -1.15, 0.05, -1.17); c.quadraticCurveTo(1.25, -1.15, 1.08, 0.95); c.stroke(); } },
  { id: 'spiderlegs', name: 'Spider Legs', back(c) { c.strokeStyle = '#0b070e'; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 0.08; for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const y = -0.5 + i * 0.35; c.beginPath(); c.moveTo(s * 0.8, y); c.lineTo(s * 1.45, y - 0.45 + i * 0.1); c.lineTo(s * 1.75, y + 0.35 + i * 0.1); c.stroke(); } } },
  { id: 'crablegs', name: 'Clawdeth Claws', back(c) { const T = '#d9774f', S = '#a9553c', px = 0.12; for (const s of [-1, 1]) { c.save(); c.scale(s, 1); for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? S : T; c.fillRect(0.85 + i * px, 0.1 - i * px, px, px); } c.fillStyle = T; c.fillRect(1.3, -0.55, px * 3, px * 2); c.fillRect(1.3, -0.25, px * 3, px); c.fillStyle = S; c.fillRect(1.3, -0.31, px * 2, px * 0.5); c.restore(); } } },
  { id: 'wings', name: 'Raven Wings', back(c) { for (const s of [-1, 1]) { c.save(); c.scale(s, 1); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#0e0c16' : '#1a1828'; c.save(); c.translate(0.75, -0.1); c.rotate(-0.9 + i * 0.32); c.beginPath(); c.ellipse(0.65, 0, 0.7 - i * 0.05, 0.12, 0, 0, TAU); c.fill(); c.restore(); } c.restore(); } } },
];
const PROPS = [
  { id: 'none', name: 'None' },
  { id: 'broom', name: 'Broomstick', back(c) { c.save(); c.rotate(-0.5); c.fillStyle = '#5a3a1e'; c.fillRect(-1.7, 0.75, 3.0, 0.07); c.fillStyle = '#b48a3c'; c.beginPath(); c.moveTo(1.25, 0.72); c.lineTo(1.85, 0.55); c.lineTo(1.9, 1.05); c.lineTo(1.25, 0.86); c.fill(); c.strokeStyle = '#7a5a26'; c.lineWidth = 0.015; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(1.3, 0.78); c.lineTo(1.88, 0.58 + i * 0.09); c.stroke(); } c.restore(); } },
  { id: 'scythe', name: 'Scythe', back(c) { c.save(); c.translate(1.15, 0); c.rotate(0.15); c.fillStyle = '#3a2614'; c.fillRect(-0.04, -1.4, 0.08, 2.6); c.fillStyle = lin(c, 0, -1.5, 0, -0.9, [[0, '#d2d8e2'], [1, '#5f6670']]); c.beginPath(); c.moveTo(0, -1.38); c.quadraticCurveTo(-0.9, -1.55, -1.3, -0.95); c.quadraticCurveTo(-0.85, -1.25, 0, -1.2); c.fill(); c.restore(); } },
  { id: 'trident', name: 'Pitchfork', back(c, o, a) { c.save(); c.translate(1.15, 0); c.rotate(0.12); c.fillStyle = '#2a1414'; c.fillRect(-0.035, -1.2, 0.07, 2.4); c.strokeStyle = shade(a, -0.2); c.lineWidth = 0.07; c.lineCap = 'round'; c.beginPath(); c.moveTo(-0.25, -1.55); c.lineTo(-0.25, -1.25); c.quadraticCurveTo(0, -1.1, 0.25, -1.25); c.lineTo(0.25, -1.55); c.moveTo(0, -1.65); c.lineTo(0, -1.2); c.stroke(); c.restore(); } },
  { id: 'bucket', name: 'Candy Bucket', front(c) { c.save(); c.translate(1.05, 0.72); pumpkinShape(c, 0, 0, 0.34, 0.28, '#e2621b', true); c.strokeStyle = '#1a1018'; c.lineWidth = 0.035; c.beginPath(); c.arc(0, -0.15, 0.32, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.restore(); } },
  { id: 'wand', name: 'Magic Wand', front(c, o, a) { c.save(); c.translate(1.05, 0.35); c.rotate(0.6); c.fillStyle = '#1a1018'; c.fillRect(-0.03, -0.55, 0.06, 0.8); c.fillStyle = BONE; c.fillRect(-0.03, -0.55, 0.06, 0.1); c.restore(); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rad(c, 1.38, -0.12, 0, 0.35, [[0, hexA(a, 0.8)], [1, hexA(a, 0)]]); c.fillRect(1.0, -0.5, 0.8, 0.8); c.restore(); c.fillStyle = shade(a, 0.4); star(c, 1.38, -0.12, 0.12); } },
  { id: 'lantern', name: 'Lantern', front(c) { c.save(); c.translate(1.12, 0.55); c.strokeStyle = '#2a2018'; c.lineWidth = 0.03; c.beginPath(); c.arc(0, -0.35, 0.1, Math.PI, 0); c.stroke(); c.fillStyle = rad(c, 0, 0, 0, 0.6, [[0, 'rgba(255,170,60,0.5)'], [1, 'rgba(255,140,40,0)']]); c.fillRect(-0.6, -0.6, 1.2, 1.2); c.fillStyle = '#2a2018'; c.fillRect(-0.2, -0.32, 0.4, 0.06); c.fillRect(-0.2, 0.26, 0.4, 0.06); c.fillStyle = 'rgba(255,200,110,0.85)'; c.fillRect(-0.16, -0.26, 0.32, 0.52); c.fillStyle = '#2a2018'; c.fillRect(-0.02, -0.26, 0.04, 0.52); c.restore(); } },
  { id: 'potion', name: 'Potion', front(c, o, a) { c.save(); c.translate(1.08, 0.62); c.fillStyle = rad(c, 0, 0.05, 0, 0.5, [[0, hexA(TOXIC, 0.35)], [1, hexA(TOXIC, 0)]]); c.fillRect(-0.5, -0.5, 1, 1); c.fillStyle = hexA(TOXIC, 0.85); c.beginPath(); c.arc(0, 0.08, 0.24, 0, TAU); c.fill(); c.fillStyle = 'rgba(200,220,210,0.25)'; c.fillRect(-0.07, -0.3, 0.14, 0.2); c.fillStyle = '#5a3a1e'; c.fillRect(-0.08, -0.38, 0.16, 0.1); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.arc(-0.09, 0.0, 0.05, 0, TAU); c.fill(); c.restore(); } },
  { id: 'lollipop', name: 'Lollipop', front(c, o, a) { c.save(); c.translate(1.1, 0.35); c.fillStyle = '#e8dcc0'; c.fillRect(-0.025, 0, 0.05, 0.65); c.fillStyle = a; c.beginPath(); c.arc(0, 0, 0.26, 0, TAU); c.fill(); c.strokeStyle = shade(a, -0.45); c.lineWidth = 0.04; c.beginPath(); for (let t = 0; t < 14; t += 0.2) c.lineTo(Math.cos(t) * t * 0.018, Math.sin(t) * t * 0.018); c.stroke(); c.restore(); } },
  { id: 'candle', name: 'Candle', front(c) { c.save(); c.translate(1.1, 0.7); c.fillStyle = rad(c, 0, -0.42, 0, 0.5, [[0, 'rgba(255,170,70,0.5)'], [1, 'rgba(255,140,40,0)']]); c.fillRect(-0.5, -0.9, 1, 1); c.fillStyle = lin(c, -0.1, 0, 0.1, 0, [[0, '#8f7b5c'], [0.5, '#d8c49a'], [1, '#6e5c44']]); c.fillRect(-0.09, -0.3, 0.18, 0.55); c.fillStyle = '#ffd27a'; c.beginPath(); c.ellipse(0, -0.42, 0.05, 0.11, 0, 0, TAU); c.fill(); c.restore(); } },
  { id: 'book', name: 'Spell Book', front(c, o, a) { c.save(); c.translate(1.05, 0.62); c.rotate(-0.2); c.fillStyle = '#3a1a2a'; rr(c, -0.3, -0.36, 0.6, 0.72, 0.04); c.fill(); c.fillStyle = '#d6c49a'; c.fillRect(0.26, -0.33, 0.05, 0.66); c.fillStyle = a; star(c, 0, 0, 0.13); c.strokeStyle = GOLD; c.lineWidth = 0.02; c.strokeRect(-0.24, -0.3, 0.46, 0.6); c.restore(); } },
  { id: 'cropsign', name: 'Trick or Crop? Sign', front(c, o, a) { c.save(); c.translate(1.02, 0.5); c.rotate(0.12); c.fillStyle = '#5a3a1e'; c.fillRect(-0.03, 0, 0.06, 0.7); c.fillStyle = '#1c1220'; rr(c, -0.5, -0.32, 1.0, 0.42, 0.05); c.fill(); c.strokeStyle = a; c.lineWidth = 0.025; c.stroke(); c.fillStyle = a; c.font = `700 0.13px ${HEAD}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('TRICK OR', 0, -0.2); c.fillText('CROP?', 0, -0.05); c.restore(); } },
  { id: 'cauldron', name: 'Cauldron', front(c) { c.save(); c.translate(0, 1.0); c.fillStyle = rad(c, 0, -0.32, 0, 0.7, [[0, hexA(TOXIC, 0.45)], [1, hexA(TOXIC, 0)]]); c.fillRect(-0.9, -1.0, 1.8, 1.0); c.fillStyle = lin(c, -0.7, 0, 0.7, 0, [[0, '#0b0a0e'], [0.5, '#2a2833'], [1, '#0b0a0e']]); c.beginPath(); c.ellipse(0, 0.05, 0.7, 0.4, 0, 0, TAU); c.fill(); c.fillStyle = '#16151c'; c.beginPath(); c.ellipse(0, -0.3, 0.68, 0.1, 0, 0, TAU); c.fill(); c.fillStyle = TOXIC; c.beginPath(); c.ellipse(0, -0.31, 0.58, 0.07, 0, 0, TAU); c.fill(); c.restore(); } },
  { id: 'dotzbuddies', name: 'Dotz Buddies', front(c) { dotBlob(c, 1.05, 0.75, 0.22, '#6a3fc4'); dotBlob(c, -1.05, 0.8, 0.18, '#2fb7a9'); dotBlob(c, 1.25, 0.35, 0.14, '#e2621b'); } },
  { id: 'pricetag', name: 'Price Tag', front(c) { c.save(); c.translate(0.95, 0.55); c.rotate(0.25); c.strokeStyle = BONE; c.lineWidth = 0.015; c.beginPath(); c.moveTo(-0.3, -0.25); c.lineTo(-0.15, 0); c.stroke(); c.fillStyle = GOLD; c.beginPath(); c.moveTo(-0.2, -0.12); c.lineTo(0.5, -0.12); c.lineTo(0.5, 0.14); c.lineTo(-0.2, 0.14); c.lineTo(-0.3, 0.01); c.closePath(); c.fill(); c.fillStyle = '#1a1018'; c.font = `800 0.11px ${UI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$49.99/hug', 0.13, 0.015); c.restore(); } },
  { id: 'pixelclaws', name: 'Pixel Claws', front(c) { const T = '#d9774f', S = '#a9553c', px = 0.1; for (const s of [-1, 1]) { c.save(); c.translate(s * 1.08, 0.7); c.fillStyle = T; c.fillRect(-px * 1.5, -px, px * 3, px * 2); c.fillRect(-px * 1.5, -px * 2.6, px, px * 1.6); c.fillRect(px * 0.5, -px * 2.6, px, px * 1.6); c.fillStyle = S; c.fillRect(-px * 1.5, px * 0.4, px * 3, px * 0.6); c.restore(); } } },
  { id: 'bone', name: 'Bone', front(c) { c.save(); c.translate(1.05, 0.55); c.rotate(-0.7); c.fillStyle = '#e6d6b4'; c.fillRect(-0.3, -0.05, 0.6, 0.1); for (const x of [-0.3, 0.3]) for (const y of [-0.06, 0.06]) { c.beginPath(); c.arc(x, y, 0.08, 0, TAU); c.fill(); } c.restore(); } },
  { id: 'candyapple', name: 'Candy Apple', front(c) { c.save(); c.translate(1.08, 0.65); c.fillStyle = '#c9a35a'; c.fillRect(-0.02, -0.6, 0.04, 0.4); c.fillStyle = rad(c, -0.08, -0.08, 0.02, 0.3, [[0, '#e0404a'], [1, '#5a0a10']]); c.beginPath(); c.arc(0, 0, 0.25, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-0.1, -0.1, 0.05, 0.08, -0.5, 0, TAU); c.fill(); c.restore(); } },
];
'use strict';
/* GrokButt himself: Blender sprite + skins + all layers, drawn in ball units */
const SKINS = [
  { id: 'classic', name: 'Classic', tint: null },
  { id: 'moonlit', name: 'Moonlit', tint: '#c3d0ee' },
  { id: 'zombie', name: 'Zombie', tint: '#a8c98a' },
  { id: 'franken', name: 'Franken', tint: '#8fbf7a' },
  { id: 'ghostly', name: 'Ghostly', tint: '#cfc6ea', alpha: 0.78, glow: '#9b7bff' },
  { id: 'gilded', name: 'Gilded', tint: '#f0c060', glow: '#e7b24a' },
  { id: 'ember', name: 'Ember Lit', tint: '#ffcf9a', glow: '#ff8a1f' },
];
const POSES = [
  { id: 'front', name: 'Front', spr: 'front' },
  { id: 'three', name: 'Glance', spr: 'three' },
  { id: 'butt', name: 'Classic Butt', spr: 'butt' },
  { id: 'peek', name: 'Peek-a-boo', spr: 'front' },
];
function poseInfo(pose) {
  const p = POSES.find(p => p.id === pose) || POSES[0], m = GB_META[p.spr], eyes = m.eyes;
  const fx = eyes.reduce((s, e) => s + e.x, 0) / eyes.length, ey = eyes.reduce((s, e) => s + e.y, 0) / eyes.length;
  const ms = p.spr === 'butt' ? 0.45 : p.spr === 'three' ? 0.9 : 1;
  return { spr: p.spr, m, eyes, face: p.spr === 'butt' ? -0.6 : fx, mouth: { x: p.spr === 'butt' ? -0.82 : fx * 1.05, y: ey + (p.spr === 'butt' ? 0.3 : 0.42) }, ms };
}
function drawSpriteUnit(c, spr) { const m = GB_META[spr], im = SPR[spr]; if (!im) return; c.save(); c.scale(1 / m.r, 1 / m.r); c.drawImage(im, -m.cx, -m.cy, m.w, m.h); c.restore(); }
const EXT = 1.5;
function bodyLayer(st, o, R) {
  const S = Math.ceil(2 * EXT * R), k = mk(S, S), c = k.getContext('2d'); const sk = SKINS.find(s => s.id === st.skin) || SKINS[0];
  const unit = cc => { cc.setTransform(R, 0, 0, R, S / 2, S / 2); };
  unit(c); drawSpriteUnit(c, o.spr);
  if (sk.tint) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'multiply'; c.fillStyle = sk.tint; c.fillRect(0, 0, S, S); c.globalCompositeOperation = 'destination-in'; unit(c); drawSpriteUnit(c, o.spr); c.globalCompositeOperation = 'source-over'; }
  const of = OUTFITS.find(x => x.id === st.outfit);
  if (of && of.paint) { const p = mk(S, S), pc = p.getContext('2d'); unit(pc); of.paint(pc, o, st.acc); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'multiply'; c.drawImage(p, 0, 0); c.globalCompositeOperation = 'destination-in'; unit(c); drawSpriteUnit(c, o.spr); c.globalCompositeOperation = 'source-over'; }
  const fc = FACES.find(x => x.id === st.face); if (fc && st.face !== 'none') { unit(c); c.globalCompositeOperation = 'source-atop'; fc.draw(c, o, st.acc); c.globalCompositeOperation = 'source-over'; }
  return { k, S, sk };
}
function byId(list, id) { return list.find(x => x.id === id) || list[0]; }
function drawGrokButt(c, st, x, y, R) {
  const o = poseInfo(st.pose); const a = st.acc || EMBER;
  c.save(); c.translate(x, y);
  // contact shadow
  c.save(); c.scale(1, 0.18); c.fillStyle = rad(c, 0, (1.02 * R) / 0.18, 0, R * 1.1, [[0, 'rgba(0,0,0,0.55)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(-R * 1.2, (1.02 * R) / 0.18 - R * 1.2, R * 2.4, R * 2.4); c.restore();
  const U = fn => { c.save(); c.scale(R, R); fn(); c.restore(); };
  const bk = byId(BACKS, st.back), pr = byId(PROPS, st.prop), of = byId(OUTFITS, st.outfit);
  if (bk.back) U(() => bk.back(c, o, a));
  if (pr.back) U(() => pr.back(c, o, a));
  const { k, S, sk } = bodyLayer(st, o, R);
  c.save(); if (sk.glow) { c.shadowColor = sk.glow; c.shadowBlur = R * 0.25; } c.globalAlpha = sk.alpha || 1; c.drawImage(k, -S / 2, -S / 2); c.restore();
  U(() => { byId(EYES, st.eyes).draw(c, o, a); if (st.outfit !== 'sheet') byId(MOUTHS, st.mouth).draw(c, o, a); if (of.over) of.over(c, o, a); if (bk.front) bk.front(c, o, a); byId(HATS, st.hat).draw(c, o, a); if (pr.front) pr.front(c, o, a); });
  c.restore();
}
'use strict';
/* Costume presets, frames, effects and captions */
const BASE = { pose: 'front', hat: 'none', eyes: 'none', mouth: 'none', face: 'none', outfit: 'none', back: 'none', prop: 'none', skin: 'classic' };
const COSTUMES = [
  ['vampire', 'Count Buttula', { back: 'vcape', mouth: 'fangs', eyes: 'blood', skin: 'moonlit' }, 'mansion', 'blood', '#a3202a', ['moon', 'bats']],
  ['pumpkinking', 'Pumpkin King', { outfit: 'pumpkin', hat: 'stem', mouth: 'grin', eyes: 'ember', prop: 'bucket' }, 'patch', 'vine', '#e2621b', ['embers']],
  ['ghost', 'Ghost Sheet', { outfit: 'sheet' }, 'graveyard', 'moonring', '#9fb4d8', ['fog', 'moon']],
  ['witch', 'Witchy Butt', { hat: 'witch', back: 'cloak', prop: 'broom', eyes: 'lashes' }, 'forest', 'glow', '#8fe36b', ['fireflies', 'fog']],
  ['zombie', 'Zombutt', { skin: 'zombie', face: 'stitches', mouth: 'stitched', eyes: 'toxic' }, 'graveyard', 'drip', '#8fe36b', ['fog']],
  ['mummy', 'Mummy Wraps', { outfit: 'mummy', eyes: 'ember', prop: 'candle' }, 'crypt', 'double', '#e7b24a', ['cobwebs']],
  ['devil', 'Lil Devil', { hat: 'horns', back: 'devtail', prop: 'trident', mouth: 'grin', eyes: 'blood', skin: 'ember' }, 'ember', 'ring', '#a3202a', ['embers', 'glow']],
  ['jollybob', 'Jollybob (rival)', { outfit: 'jolly', mouth: 'smile', prop: 'pricetag' }, 'plum', 'candy', '#e7b24a', ['glow']],
  ['dotz', 'Dotz Crew (rival)', { outfit: 'dotz', prop: 'dotzbuddies', mouth: 'smile' }, 'starry', 'dots', '#9b7bff', ['fireflies']],
  ['clawdeth', 'Clawdeth (rival)', { hat: 'clawhelm', back: 'crablegs', prop: 'pixelclaws', eyes: 'shades' }, 'server', 'pixel', '#e2621b', ['embers']],
  ['skeleton', 'Skelebutt', { outfit: 'bones', face: 'skull', prop: 'bone' }, 'bloodmoon', 'bones', '#e6d6b4', ['bats']],
  ['franken', 'Frankenbutt', { skin: 'franken', hat: 'frankhair', face: 'scars', mouth: 'stitched' }, 'lab', 'ring', '#8fe36b', ['lightning']],
  ['were', 'Werebutt', { hat: 'wolfears', back: 'wolftail', mouth: 'wolf', eyes: 'ember' }, 'bloodmoon', 'moonring', '#e7b24a', ['moon', 'fog']],
  ['cat', 'Black Cat', { hat: 'catears', back: 'cattail', face: 'whiskers', eyes: 'toxic' }, 'mansion', 'ring', '#8fe36b', ['moon']],
  ['wizard', 'SI Wizard', { hat: 'wizard', back: 'robe', prop: 'wand', eyes: 'violet' }, 'starry', 'glow', '#9b7bff', ['fireflies']],
  ['pirate', 'Ghost Pirate', { hat: 'pirate', eyes: 'patch', skin: 'ghostly', mouth: 'mustache' }, 'swamp', 'double', '#2fb7a9', ['fog']],
  ['reaper', 'Grim Reaper', { back: 'hood', prop: 'scythe', eyes: 'violet' }, 'graveyard', 'crop', '#9b7bff', ['fog', 'vignette']],
  ['scarecrow', 'Scarecrow', { hat: 'straw', outfit: 'burlap', mouth: 'stitched' }, 'patch', 'vine', '#e2621b', ['bats']],
  ['bat', 'Batbutt', { hat: 'batears', back: 'batwings', mouth: 'fangs' }, 'batsky', 'bats', '#ff8a1f', ['bats']],
  ['scientist', 'Mad SI-entist', { eyes: 'goggles', prop: 'potion', face: 'bolt', hat: 'frankhair' }, 'lab', 'glow', '#8fe36b', ['lightning', 'fog']],
  ['candycorn', 'Candy Corn', { hat: 'candycorn', outfit: 'candy', prop: 'lollipop', mouth: 'smile' }, 'spice', 'candy', '#ff8a1f', ['embers']],
  ['spider', 'Spider Queen', { back: 'spiderlegs', hat: 'crown', face: 'web', eyes: 'blood' }, 'web', 'web', '#a3202a', ['spider', 'cobwebs']],
  ['crop', 'Trick or Crop?', { prop: 'cropsign', hat: 'witch', mouth: 'smile' }, 'obsidian', 'crop', '#ff8a1f', ['vignette'], 'TRICK OR CROP?'],
  ['gilded', 'Gilded Idol', { skin: 'gilded', hat: 'crown', eyes: 'ember', outfit: 'bowtie' }, 'ember', 'double', '#e7b24a', ['glow']],
  ['cauldron', 'Cauldron Keeper', { hat: 'witch', prop: 'cauldron', eyes: 'toxic', back: 'cloak' }, 'lab', 'drip', '#8fe36b', ['fog', 'fireflies']],
  ['raven', 'Raven Lord', { back: 'wings', eyes: 'mask', hat: 'tophat' }, 'bloodmoon', 'ring', '#a3202a', ['bats', 'moon']],
  ['spookybutt', 'Spooky Butt', { pose: 'butt', hat: 'witch', back: 'cloak' }, 'graveyard', 'moonring', '#ff8a1f', ['fog', 'moon']],
  ['peek', 'Peek-a-boo', { pose: 'peek', eyes: 'ember', hat: 'pumpkin' }, 'patch', 'text', '#ff8a1f', ['embers']],
].map(([id, name, slots, bg, frame, fcol, fx, caption]) => ({ id, name, slots: Object.assign({}, BASE, slots), bg, frame, fcol, fx, caption: caption || '' }));

function textOnArc(c, text, cx, cy, R, mid, size, col, inside) {
  c.save(); c.font = `700 ${size}px ${HEAD}`; c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle';
  const chars = [...text], ws = chars.map(ch => c.measureText(ch).width + size * 0.12), tot = ws.reduce((a, b) => a + b, 0); const dir = inside ? -1 : 1;
  let ang = mid - dir * tot / R / 2;
  chars.forEach((ch, i) => { const a = ang + dir * ws[i] / R / 2; c.save(); c.translate(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.rotate(a + dir * Math.PI / 2); c.fillText(ch, 0, 0); c.restore(); ang += dir * ws[i] / R; });
  c.restore();
}
function ringStroke(c, r, w, style) { c.strokeStyle = style; c.lineWidth = w; c.beginPath(); c.arc(500, 500, r, 0, TAU); c.stroke(); }
function outerMask(c, r, col) { c.save(); c.fillStyle = col; c.beginPath(); c.rect(0, 0, 1000, 1000); c.arc(500, 500, r, 0, TAU, true); c.fill('evenodd'); c.restore(); }
const FRAMES = [
  { id: 'none', name: 'None', draw() {} },
  { id: 'ring', name: 'Ring', draw(c, col) { ringStroke(c, 478, 26, lin(c, 0, 0, 1000, 1000, [[0, shade(col, 0.3)], [0.5, col], [1, shade(col, -0.45)]])); } },
  { id: 'double', name: 'Double Ring', draw(c, col) { ringStroke(c, 482, 14, col); ringStroke(c, 456, 5, hexA(col, 0.7)); } },
  { id: 'glow', name: 'Glow Ring', draw(c, col) { c.save(); c.shadowColor = col; c.shadowBlur = 40; ringStroke(c, 470, 12, col); c.restore(); ringStroke(c, 470, 4, shade(col, 0.5)); } },
  { id: 'vine', name: 'Thorn Vine', draw(c, col) { ringStroke(c, 474, 16, shade(col, -0.55)); c.fillStyle = shade(col, -0.3); for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; c.save(); c.translate(500 + Math.cos(a) * 474, 500 + Math.sin(a) * 474); c.rotate(a + (i % 2 ? 0.6 : -0.6)); c.beginPath(); c.moveTo(0, -8); c.lineTo(26, 0); c.lineTo(0, 8); c.fill(); c.restore(); } for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.2; c.save(); pumpkinShape(c, 500 + Math.cos(a) * 474, 500 + Math.sin(a) * 474, 26, 20, '#e2621b', false); c.restore(); } } },
  { id: 'web', name: 'Web Corners', draw(c, col) { for (const [x, y, a] of [[0, 0, 0], [1000, 0, Math.PI / 2], [1000, 1000, Math.PI], [0, 1000, -Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.rect(0, 0, 400, 400); c.clip(); drawWeb(c, 0, 0, 330, 16, hexA(col, 0.75), 2.5); c.restore(); } spiderShape(c, 860, 230, 1.3); } },
  { id: 'drip', name: 'Slime Drip', draw(c, col) { c.fillStyle = lin(c, 0, 0, 0, 200, [[0, shade(col, -0.2)], [1, col]]); c.beginPath(); c.moveTo(0, 0); c.lineTo(1000, 0); c.lineTo(1000, 50); const r = seeded(5); for (let x = 1000; x > 0; x -= 50) { const d = 50 + r() * 120; c.lineTo(x - 10, 50); c.quadraticCurveTo(x - 25, d, x - 25, d + 10); c.quadraticCurveTo(x - 25, d + 25, x - 35, d); c.quadraticCurveTo(x - 40, 50, x - 50, 50); } c.lineTo(0, 50); c.fill(); outerMask(c, 492, shade(col, -0.78)); ringStroke(c, 488, 8, col); } },
  { id: 'bats', name: 'Bat Swarm', draw(c, col) { ringStroke(c, 480, 10, col); const r = seeded(9); for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, d = 455 + r() * 30; batShape(c, 500 + Math.cos(a) * d, 500 + Math.sin(a) * d, 0.8 + r() * 0.6, a + Math.PI / 2, '#0b0710'); } } },
  { id: 'candy', name: 'Candy Stripe', draw(c, col) { c.save(); c.beginPath(); c.arc(500, 500, 492, 0, TAU); c.arc(500, 500, 456, 0, TAU, true); c.clip('evenodd'); c.fillStyle = '#efe1c2'; c.fillRect(0, 0, 1000, 1000); c.strokeStyle = col; c.lineWidth = 22; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; c.beginPath(); c.moveTo(500 + Math.cos(a) * 440, 500 + Math.sin(a) * 440); c.lineTo(500 + Math.cos(a + 0.12) * 510, 500 + Math.sin(a + 0.12) * 510); c.stroke(); } c.restore(); } },
  { id: 'bones', name: 'Bone Ring', draw(c, col) { for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; c.save(); c.translate(500 + Math.cos(a) * 470, 500 + Math.sin(a) * 470); c.rotate(a + Math.PI / 2); c.fillStyle = col; c.fillRect(-36, -7, 72, 14); for (const x of [-36, 36]) for (const y of [-7, 7]) { c.beginPath(); c.arc(x, y, 10, 0, TAU); c.fill(); } c.restore(); } } },
  { id: 'dots', name: 'Dotted', draw(c, col) { for (let i = 0; i < 60; i++) { const a = i / 60 * TAU; c.fillStyle = i % 2 ? col : shade(col, -0.4); c.beginPath(); c.arc(500 + Math.cos(a) * 474, 500 + Math.sin(a) * 474, i % 2 ? 14 : 9, 0, TAU); c.fill(); } } },
  { id: 'pixel', name: 'Pixel Border', draw(c, col) { const p = 25; for (let i = 0; i < 40; i++) for (const [x, y] of [[i * p, 0], [i * p, 1000 - p], [0, i * p], [1000 - p, i * p]]) { c.fillStyle = (i % 2) ? col : shade(col, -0.45); c.fillRect(x, y, p, p); } } },
  { id: 'crop', name: 'Crop Marks', draw(c, col) { c.strokeStyle = col; c.lineWidth = 12; c.lineCap = 'square'; for (const [x, y, sx, sy] of [[90, 90, 1, 1], [910, 90, -1, 1], [910, 910, -1, -1], [90, 910, 1, -1]]) { c.beginPath(); c.moveTo(x, y + sy * 120); c.lineTo(x, y); c.lineTo(x + sx * 120, y); c.stroke(); } c.fillStyle = col; c.beginPath(); c.arc(500, 90, 8, 0, TAU); c.arc(500, 910, 8, 0, TAU); c.fill(); } },
  { id: 'text', name: 'Halloween Text', draw(c, col) { ringStroke(c, 486, 4, col); ringStroke(c, 396, 4, col); c.save(); c.beginPath(); c.arc(500, 500, 484, 0, TAU); c.arc(500, 500, 398, 0, TAU, true); c.fillStyle = 'rgba(10,6,14,0.72)'; c.fill('evenodd'); c.restore(); textOnArc(c, 'HAPPY HALLOWEEN', 500, 500, 441, -Math.PI / 2, 54, col); textOnArc(c, 'GROKBUTT', 500, 500, 441, Math.PI / 2, 50, col, true); for (const a of [Math.PI * 0.03, Math.PI * 0.97]) { c.fillStyle = col; star(c, 500 + Math.cos(a) * 441, 500 + Math.sin(a) * 441, 16); } } },
  { id: 'moonring', name: 'Moon Halo', draw(c, col) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rad(c, 500, 500, 380, 500, [[0, hexA(col, 0)], [0.8, hexA(col, 0.3)], [1, hexA(col, 0)]]); c.fillRect(0, 0, 1000, 1000); c.restore(); ringStroke(c, 470, 3, hexA(col, 0.8)); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.fillStyle = col; c.beginPath(); c.arc(500 + Math.cos(a) * 470, 500 + Math.sin(a) * 470, 9, 0, TAU); c.fill(); } } },
];
const FX = [
  { id: 'fog', name: 'Fog', after(c) { fogBand(c, seeded(21), 900, 140, '#b8aed8', 18, 0.3); fogBand(c, seeded(22), 760, 80, '#b8aed8', 10, 0.15); } },
  { id: 'moon', name: 'Moonlight', before(c) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(160,180,230,0.05)'; c.beginPath(); c.moveTo(780 - i * 30, -50); c.lineTo(180 + i * 60, 1000); c.lineTo(320 + i * 70, 1000); c.fill(); } c.fillStyle = rad(c, 500, 380, 0, 520, [[0, 'rgba(170,190,240,0.2)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, 1000, 1000); c.restore(); } },
  { id: 'glow', name: 'Aura Glow', before(c, st) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rad(c, 500, 540, 120, 470, [[0, hexA(st.acc || EMBER, 0.55)], [1, hexA(st.acc || EMBER, 0)]]); c.fillRect(0, 0, 1000, 1000); c.restore(); } },
  { id: 'bats', name: 'Bats', after(c) { const r = seeded(31); for (let i = 0; i < 9; i++) batShape(c, 80 + r() * 840, 70 + r() * 300, 0.9 + r() * 1.1, (r() - 0.5) * 0.6, '#0b0710'); } },
  { id: 'embers', name: 'Embers', after(c) { const r = seeded(41); c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const x = r() * 1000, y = 300 + r() * 700, s = 2 + r() * 5; c.fillStyle = rad(c, x, y, 0, s * 2, [[0, 'rgba(255,170,60,0.95)'], [1, 'rgba(255,120,30,0)']]); c.fillRect(x - s * 2, y - s * 2, s * 4, s * 4); } c.restore(); } },
  { id: 'fireflies', name: 'Fireflies', after(c) { const r = seeded(51); c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const x = r() * 1000, y = r() * 1000; c.fillStyle = rad(c, x, y, 0, 12, [[0, 'rgba(210,255,140,0.95)'], [1, 'rgba(180,255,120,0)']]); c.fillRect(x - 12, y - 12, 24, 24); } c.restore(); } },
  { id: 'cobwebs', name: 'Cobwebs', after(c) { for (const [x, a] of [[0, 0], [1000, Math.PI / 2]]) { c.save(); c.translate(x, 0); c.rotate(a); c.beginPath(); c.rect(0, 0, 300, 300); c.clip(); drawWeb(c, 0, 0, 260, 12, 'rgba(220,210,235,0.45)', 2); c.restore(); } } },
  { id: 'spider', name: 'Dangling Spider', after(c) { c.strokeStyle = 'rgba(220,210,235,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(800, 0); c.lineTo(800, 250); c.stroke(); spiderShape(c, 800, 275, 1.4); } },
  { id: 'lightning', name: 'Lightning', before(c) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(150,170,255,0.12)'; c.fillRect(0, 0, 1000, 1000); c.strokeStyle = 'rgba(200,215,255,0.9)'; c.shadowColor = '#9fb4ff'; c.shadowBlur = 25; c.lineWidth = 5; const r = seeded(61); for (const x0 of [150, 860]) { c.beginPath(); let x = x0, y = 0; c.moveTo(x, y); while (y < 520) { x += (r() - 0.5) * 80; y += 40 + r() * 40; c.lineTo(x, y); } c.stroke(); } c.restore(); } },
  { id: 'vignette', name: 'Vignette', last(c) { c.fillStyle = rad(c, 500, 500, 330, 720, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.75)']]); c.fillRect(0, 0, 1000, 1000); } },
  { id: 'grain', name: 'Film Grain', last(c) { const r = seeded(71); for (let i = 0; i < 9000; i++) { c.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'; c.fillRect(r() * 1000, r() * 1000, 2, 2); } } },
];
const CAPTIONS = ['', 'TRICK OR CROP?', 'HAPPY HALLOWEEN', 'SPOOKY SI SEASON', 'BOO!', 'GROKBUTT', 'TRICK OR TREAT', 'NO TRICKS, JUST BUTT'];
'use strict';
/* Stickers for upload mode. Each draws centred in a 400x400 box (centre 200,200). */
function gbSticker(slots, acc, pose) { return c => drawGrokButt(c, Object.assign({}, BASE, slots, { acc: acc || EMBER, pose: pose || slots.pose || 'front' }), 200, 215, 120); }
function badge(text, col, sub) { return c => { c.save(); c.translate(200, 200); c.rotate(-0.08); c.fillStyle = '#140c1a'; rr(c, -180, -62, 360, 124, 26); c.fill(); c.strokeStyle = col; c.lineWidth = 8; c.stroke(); c.fillStyle = col; let fs = 64; c.font = `800 ${fs}px ${HEAD}`; while (c.measureText(text).width > 320 && fs > 20) { fs -= 2; c.font = `800 ${fs}px ${HEAD}`; } c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, sub ? -12 : 4); if (sub) { c.font = `600 24px ${UI_FONT}`; c.fillStyle = BONE; c.fillText(sub, 0, 36); } c.restore(); }; }
function unitIcon(fn, s = 150, dy = 0) { return c => { c.save(); c.translate(200, 200 + dy); c.scale(s, s); fn(c); c.restore(); }; }
const UO = () => poseInfo('front');
const STICKERS = [
  { id: 'gb_peek', name: 'GrokButt Peek', draw: c => { c.save(); c.beginPath(); c.rect(0, 0, 400, 300); c.clip(); drawGrokButt(c, Object.assign({}, BASE, { eyes: 'ember', acc: EMBER }), 200, 275, 170); c.restore(); c.fillStyle = '#1a1018'; rr(c, 20, 290, 360, 24, 12); c.fill(); } },
  { id: 'gb_butt', name: 'Classic Butt', draw: gbSticker({ pose: 'butt' }) },
  { id: 'gb_witch', name: 'Witch GrokButt', draw: gbSticker({ hat: 'witch', back: 'cloak' }, '#8fe36b') },
  { id: 'gb_vamp', name: 'Vampire GrokButt', draw: gbSticker({ back: 'vcape', mouth: 'fangs' }, '#a3202a') },
  { id: 'gb_ghost', name: 'Ghost GrokButt', draw: gbSticker({ outfit: 'sheet' }) },
  { id: 'gb_pumpkin', name: 'Pumpkin GrokButt', draw: gbSticker({ outfit: 'pumpkin', hat: 'stem', mouth: 'grin' }) },
  { id: 'gb_devil', name: 'Devil GrokButt', draw: gbSticker({ hat: 'horns', back: 'devtail', mouth: 'grin', skin: 'ember' }, '#a3202a') },
  { id: 'gb_mummy', name: 'Mummy GrokButt', draw: gbSticker({ outfit: 'mummy', eyes: 'ember' }) },
  { id: 'gb_reaper', name: 'Reaper GrokButt', draw: gbSticker({ back: 'hood', prop: 'scythe', eyes: 'violet' }) },
  { id: 'gb_cat', name: 'Cat GrokButt', draw: gbSticker({ hat: 'catears', back: 'cattail', face: 'whiskers' }) },
  { id: 'gb_bat', name: 'Bat GrokButt', draw: gbSticker({ hat: 'batears', back: 'batwings', mouth: 'fangs' }) },
  { id: 'bat', name: 'Bat', draw: c => batShape(c, 200, 200, 4.4, -0.1, '#120a16') },
  { id: 'bats', name: 'Bat Trio', draw: c => { batShape(c, 120, 150, 2.4, -0.3, '#120a16'); batShape(c, 270, 120, 1.8, 0.2, '#120a16'); batShape(c, 220, 280, 2.8, 0, '#120a16'); } },
  { id: 'jack', name: "Jack-o'-lantern", draw: c => pumpkinShape(c, 200, 220, 150, 120, '#e2621b', true) },
  { id: 'pumpkin', name: 'Pumpkin', draw: c => pumpkinShape(c, 200, 220, 150, 115, '#e98a2a', false) },
  { id: 'candycorn', name: 'Candy Corn', draw: c => { c.save(); c.translate(200, 200); c.beginPath(); c.moveTo(-110, 140); c.quadraticCurveTo(0, 170, 110, 140); c.lineTo(0, -160); c.closePath(); c.clip(); c.fillStyle = '#f0d9a6'; c.fillRect(-200, -200, 400, 400); c.fillStyle = '#f08a1c'; c.fillRect(-200, -60, 400, 110); c.fillStyle = '#f5c419'; c.fillRect(-200, 50, 400, 120); c.restore(); } },
  { id: 'candy', name: 'Wrapped Candy', draw: c => { c.save(); c.translate(200, 200); c.rotate(-0.4); c.fillStyle = '#7a3fa0'; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 70, 0); c.lineTo(s * 170, -60); c.lineTo(s * 170, 60); c.fill(); } c.fillStyle = lin(c, 0, -70, 0, 70, [[0, '#c278f0'], [1, '#4a1f6a']]); c.beginPath(); c.ellipse(0, 0, 100, 70, 0, 0, TAU); c.fill(); c.fillStyle = EMBER; c.fillRect(-20, -68, 40, 136); c.restore(); } },
  { id: 'lollipop', name: 'Lollipop', draw: unitIcon(cc => { cc.translate(-1.1, -0.62); PROPS.find(p => p.id === 'lollipop').front(cc, UO(), '#a3202a'); }, 320, 0) },
  { id: 'spider', name: 'Spider', draw: c => { c.strokeStyle = 'rgba(220,210,235,0.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(200, 0); c.lineTo(200, 150); c.stroke(); spiderShape(c, 200, 220, 3.6); } },
  { id: 'webcorner', name: 'Web Corner', draw: c => { c.save(); c.beginPath(); c.rect(0, 0, 400, 400); c.clip(); drawWeb(c, 0, 0, 400, 12, 'rgba(225,215,240,0.85)', 4); c.restore(); } },
  { id: 'moon', name: 'Harvest Moon', draw: c => moon(c, 200, 200, 62, '#ffb35c', 0.5) },
  { id: 'tomb', name: 'R.I.P. Tombstone', draw: c => { tomb(c, 200, 370, 250, 330, '#3a3346'); c.strokeStyle = '#1d1828'; c.lineWidth = 8; c.stroke(); c.fillStyle = BONE; c.textAlign = 'center'; c.font = `800 64px ${HEAD}`; c.fillText('R.I.P.', 200, 170); c.font = `700 30px ${HEAD}`; c.fillText('BORING', 200, 230); c.fillText('PFP', 200, 270); c.fillStyle = '#2a3a14'; c.fillRect(60, 360, 280, 18); } },
  { id: 'witchhat', name: 'Witch Hat', draw: unitIcon(cc => { cc.translate(0, 0.9); HATS.find(h => h.id === 'witch').draw(cc, UO(), '#7a3fa0'); }, 170, 30) },
  { id: 'horns', name: 'Devil Horns', draw: unitIcon(cc => { cc.translate(0, 1.0); HATS.find(h => h.id === 'horns').draw(cc, UO(), '#a3202a'); }, 240, 0) },
  { id: 'catears', name: 'Cat Ears', draw: unitIcon(cc => { cc.translate(0, 0.9); HATS.find(h => h.id === 'catears').draw(cc, UO(), '#e7b24a'); }, 240, 0) },
  { id: 'crown', name: 'Bone Crown', draw: unitIcon(cc => { cc.translate(0, 1.05); HATS.find(h => h.id === 'crown').draw(cc, UO(), '#a3202a'); }, 300, 0) },
  { id: 'fangs', name: 'Fangs', draw: unitIcon(cc => { MOUTHS[1].draw(cc, { mouth: { x: 0, y: -0.1 }, ms: 1 }); }, 600, 0) },
  { id: 'shades', name: 'Pixel Shades', draw: unitIcon(cc => EYES.find(e => e.id === 'shades').draw(cc, UO()), 260, 0) },
  { id: 'stache', name: 'Villain Stache', draw: unitIcon(cc => MOUTHS.find(m => m.id === 'mustache').draw(cc, { mouth: { x: 0, y: 0 }, ms: 1 }), 420, 0) },
  { id: 'potion', name: 'Potion', draw: unitIcon(cc => { cc.translate(-1.08, -0.62); PROPS.find(p => p.id === 'potion').front(cc); }, 360, 20) },
  { id: 'cauldron', name: 'Cauldron', draw: unitIcon(cc => { cc.translate(0, -0.9); PROPS.find(p => p.id === 'cauldron').front(cc); }, 240, 20) },
  { id: 'candle', name: 'Candle', draw: unitIcon(cc => { cc.translate(-1.1, -0.45); PROPS.find(p => p.id === 'candle').front(cc); }, 300, 0) },
  { id: 'ghost', name: 'Lil Ghost', draw: unitIcon(cc => { OUTFITS.find(o => o.id === 'sheet').over(cc, UO()); }, 150, 0) },
  { id: 'jolly', name: 'Jollybob Plush', draw: gbSticker({ outfit: 'jolly', mouth: 'smile', prop: 'pricetag' }, '#e7b24a') },
  { id: 'dotz', name: 'Dotz Crew', draw: c => { dotBlob(c, 130, 230, 90, '#6a3fc4'); dotBlob(c, 280, 250, 70, '#2fb7a9'); dotBlob(c, 220, 120, 55, '#e2621b'); } },
  { id: 'clawdeth', name: 'Clawdeth', draw: gbSticker({ hat: 'clawhelm', back: 'crablegs', prop: 'pixelclaws', eyes: 'shades' }) },
  { id: 'trickorcrop', name: 'Trick or Crop? Badge', draw: badge('TRICK OR CROP?', EMBER) },
  { id: 'boo', name: 'BOO!', draw: c => { c.save(); c.translate(200, 200); c.rotate(-0.12); c.font = `900 150px ${HEAD}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 18; c.strokeStyle = '#140c1a'; c.strokeText('BOO!', 0, 0); c.fillStyle = lin(c, 0, -70, 0, 70, [[0, '#ffb35c'], [1, '#e2621b']]); c.fillText('BOO!', 0, 0); c.restore(); } },
  { id: 'spookysi', name: 'Spooky SI Season', draw: badge('SPOOKY SI', '#9b7bff', 'SEASON 2026') },
  { id: 'cropmarks', name: 'Crop Marks', draw: c => { c.strokeStyle = EMBER; c.lineWidth = 14; for (const [x, y, sx, sy] of [[40, 40, 1, 1], [360, 40, -1, 1], [360, 360, -1, -1], [40, 360, 1, -1]]) { c.beginPath(); c.moveTo(x, y + sy * 90); c.lineTo(x, y); c.lineTo(x + sx * 90, y); c.stroke(); } } },
];
const stickerCache = {};
function stickerCanvas(id) { if (stickerCache[id]) return stickerCache[id]; const k = mk(400, 400), c = k.getContext('2d'); const s = STICKERS.find(s => s.id === id); if (s) s.draw(c); return (stickerCache[id] = k); }
'use strict';
/* Final composition into a 1000x1000 canvas */
function drawHandle(c, h) { if (!h) return; h = h.trim(); if (!h) return; if (h[0] !== '@') h = '@' + h; h = h.slice(0, 22); c.save(); c.font = `700 40px ${UI_FONT}`; const w = c.measureText(h).width + 56; c.fillStyle = 'rgba(12,8,16,0.78)'; rr(c, 500 - w / 2, 822, w, 62, 31); c.fill(); c.strokeStyle = hexA(GOLD, 0.8); c.lineWidth = 3; c.stroke(); c.fillStyle = BONE; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(h, 500, 854); c.restore(); }
function drawCaption(c, text, col) { if (!text) return; c.save(); c.shadowColor = 'rgba(0,0,0,0.9)'; c.shadowBlur = 14; textOnArc(c, text, 500, 520, 395, -Math.PI / 2, text.length > 14 ? 50 : 60, col); c.restore(); }
function photoLayer(c, st) {
  const im = st.photo; if (!im) { c.fillStyle = rad(c, 500, 440, 0, 760, [[0, '#2a1840'], [1, '#08040c']]); c.fillRect(0, 0, 1000, 1000); c.fillStyle = hexA(BONE, 0.55); c.font = `600 42px ${UI_FONT}`; c.textAlign = 'center'; c.fillText('Upload your PFP', 500, 500); return; }
  const P = st.ph, base = Math.max(1000 / im.width, 1000 / im.height);
  c.save(); c.translate(500 + P.x, 500 + P.y); c.rotate(P.rot); const k = base * P.s; c.drawImage(im, -im.width * k / 2, -im.height * k / 2, im.width * k, im.height * k); c.restore();
  if (st.grade) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(90,50,130,0.55)'; c.fillRect(0, 0, 1000, 1000); c.globalCompositeOperation = 'soft-light'; c.fillStyle = rad(c, 500, 600, 0, 700, [[0, 'rgba(255,140,40,0.6)'], [1, 'rgba(255,120,30,0.1)']]); c.fillRect(0, 0, 1000, 1000); c.restore(); }
}
function drawStickers(c, st, sel) {
  st.stickers.forEach((s, i) => { const k = stickerCanvas(s.id), sz = 300 * s.s; c.save(); c.translate(s.x, s.y); c.rotate(s.rot); if (s.flip) c.scale(-1, 1); c.drawImage(k, -sz / 2, -sz / 2, sz, sz);
    if (sel && i === st.sel) { c.strokeStyle = 'rgba(255,170,60,0.95)'; c.setLineDash([14, 10]); c.lineWidth = 4 / Math.max(0.3, 1); c.strokeRect(-sz / 2, -sz / 2, sz, sz); c.setLineDash([]); }
    c.restore(); });
}
function compose(c, st, opts = {}) {
  c.save(); c.clearRect(0, 0, 1000, 1000);
  const fxs = FX.filter(f => st.fx.includes(f.id));
  if (st.mode === 'dress') {
    c.drawImage(bgCanvas(st.bg), 0, 0);
    fxs.forEach(f => f.before && f.before(c, st));
    if (st.pose === 'peek') drawGrokButt(c, st, 500, 830, 330 * st.size); else drawGrokButt(c, st, 500, 545 + (1 - st.size) * 120, 238 * st.size);
  } else {
    photoLayer(c, st); fxs.forEach(f => f.before && f.before(c, st));
  }
  fxs.forEach(f => f.after && f.after(c, st));
  if (st.mode === 'upload') drawStickers(c, st, opts.sel);
  byId(FRAMES, st.frame).draw(c, st.fcol);
  drawCaption(c, st.caption, st.fcol === '#24182e' ? BONE : st.fcol);
  drawHandle(c, st.handle);
  fxs.forEach(f => f.last && f.last(c, st));
  c.restore();
}
