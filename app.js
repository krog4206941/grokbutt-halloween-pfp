'use strict';
/* GROKBUTT Halloween PFP Maker - UI */
(() => {
const $ = s => document.querySelector(s);
const view = $('#view'), vc = view.getContext('2d'), mini = $('#mini'), mc = mini.getContext('2d');
const st = Object.assign({}, BASE, { mode: 'dress', bg: 'graveyard', frame: 'ring', fcol: '#ff8a1f', acc: '#ff8a1f', fx: ['fog', 'moon'], caption: '', handle: '', size: 1, costume: '',
  photo: null, ph: { x: 0, y: 0, s: 1, rot: 0 }, grade: false, stickers: [], sel: -1 });
let cat = 'costume', dirty = true;
const req = () => { dirty = true; };
function frame() { if (dirty) { dirty = false; compose(vc, st, { sel: true }); mc.clearRect(0, 0, 96, 96); mc.drawImage(view, 0, 0, 96, 96); } requestAnimationFrame(frame); }
let toastT; function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 1800); }
let hintT; function hint(t) { const el = $('#hint'); el.textContent = t; el.classList.add('show'); clearTimeout(hintT); hintT = setTimeout(() => el.classList.remove('show'), 2600); }
const QUIPS = ['Costume on. Still no limbs.', 'Spooky. Glossy. Round.', 'Trick or Crop?', 'Peak SI season.', 'The butt abides.', 'Certified haunted.'];
const pick = a => a[Math.floor(Math.random() * a.length)];

// ---------- thumbnails (lazy queue) ----------
const queue = []; let busy = false;
function pump() { if (busy) return; busy = true; const step = () => { const t0 = performance.now(); while (queue.length && performance.now() - t0 < 12) { const j = queue.shift(); if (j.cv.isConnected) j.fn(j.cv.getContext('2d')); } if (queue.length) requestAnimationFrame(step); else busy = false; }; requestAnimationFrame(step); }
function thumb(fn) { const cv = mk(150, 150); queue.push({ cv, fn }); pump(); return cv; }
function thumbState(over) { return c => { c.save(); c.scale(0.15, 0.15); compose(c, Object.assign({}, st, { mode: 'dress', fx: [], handle: '', caption: '', frame: 'none' }, over)); c.restore(); }; }
function closeUp(over) { return c => { const s = Object.assign({}, st, over); c.drawImage(bgCanvas(s.bg), 0, 0, 150, 150); const R = s.pose === 'peek' ? 46 : 48; drawGrokButt(c, Object.assign({}, s, { pose: s.pose === 'peek' ? 'front' : s.pose }), 75, 82, R); }; }

// ---------- panels ----------
const DRESS_CATS = [['costume', 'Costumes'], ['pose', 'Pose'], ['hat', 'Hats'], ['eyes', 'Eyes'], ['mouth', 'Mouth'], ['face', 'Face paint'], ['outfit', 'Outfit'], ['back', 'Capes & tails'], ['prop', 'Props'], ['skin', 'Skin'], ['bg', 'Backgrounds'], ['frame', 'Frames'], ['fx', 'Effects'], ['text', 'Text & @'], ];
const UP_CATS = [['photo', 'Your photo'], ['stickers', 'Stickers'], ['frame', 'Frames'], ['fx', 'Effects'], ['text', 'Text & @']];
const SLOT = { hat: HATS, eyes: EYES, mouth: MOUTHS, face: FACES, outfit: OUTFITS, back: BACKS, prop: PROPS, skin: SKINS, pose: POSES };
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function sec(t) { return el('div', 'sec', t); }
function optGrid(items, isOn, onPick, draw) { const g = el('div', 'grid'); items.forEach(it => { const b = el('button', 'opt' + (isOn(it) ? ' on' : '')); b.dataset.id = it.id; b.append(thumb(draw(it))); b.append(el('span', '', it.name)); b.onclick = () => { onPick(it); g.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === b)); req(); }; g.append(b); }); return g; }
function swatches(get, set) { const w = el('div', 'sw'); SWATCH.forEach(([n, c]) => { const b = el('button', get() === c ? 'on' : ''); b.style.background = c; b.title = n; b.setAttribute('aria-label', n); b.onclick = () => { set(c); w.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); req(); }; w.append(b); }); const ci = el('input'); ci.type = 'color'; ci.value = get(); ci.title = 'Custom colour'; ci.oninput = () => { set(ci.value); w.querySelectorAll('button').forEach(x => x.classList.remove('on')); req(); }; w.append(ci); return w; }
function slider(label, min, max, stp, get, set) { const f = el('div', 'field'); const l = el('label', '', label); const r = el('input'); r.type = 'range'; r.min = min; r.max = max; r.step = stp; r.value = get(); r.oninput = () => { set(+r.value); req(); }; f.append(l, r); return f; }
function applyCostume(cs) { Object.assign(st, cs.slots, { bg: cs.bg, frame: cs.frame, fcol: cs.fcol, acc: cs.fcol, fx: cs.fx.slice(), costume: cs.id }); st.caption = cs.caption || (CAPTIONS.includes(st.caption) && st.caption && st.frame !== 'text' && !st._capFromCostume ? st.caption : ''); st._capFromCostume = !!cs.caption; req(); }
function renderPanel() {
  const body = $('#panelBody'); body.innerHTML = ''; queue.length = 0;
  const P = (...n) => n.forEach(x => body.append(x));
  if (cat === 'costume') { P(sec('Pick a costume (28)'), optGrid(COSTUMES, it => st.costume === it.id, it => { applyCostume(it); toast(`${it.name}: ${pick(QUIPS)}`); }, it => thumbState(Object.assign({}, it.slots, { bg: it.bg, acc: it.fcol, frame: it.frame, fcol: it.fcol })))); }
  else if (SLOT[cat]) {
    const list = SLOT[cat];
    P(sec({ pose: 'Pose', hat: 'Hats & headgear', eyes: 'Eyes', mouth: 'Mouths & fangs', face: 'Face paint', outfit: 'Outfits', back: 'Capes, wings & tails', prop: 'Held props', skin: 'Skin' }[cat] + ` (${list.length})`));
    P(optGrid(list, it => st[cat] === it.id, it => { st[cat] = it.id; st.costume = ''; }, it => cat === 'pose' ? thumbState({ pose: it.id }) : closeUp({ [cat]: it.id })));
    if (['hat', 'eyes', 'back', 'prop', 'outfit'].includes(cat)) P(sec('Accent colour'), swatches(() => st.acc, c => st.acc = c));
    if (cat === 'pose') P(slider('GrokButt size', 0.7, 1.2, 0.01, () => st.size, v => st.size = v));
  }
  else if (cat === 'bg') P(sec(`Backgrounds (${BGS.length})`), optGrid(BGS, it => st.bg === it.id, it => st.bg = it.id, it => c => c.drawImage(bgCanvas(it.id), 0, 0, 150, 150)));
  else if (cat === 'frame') { P(sec(`Frames (${FRAMES.length})`), optGrid(FRAMES, it => st.frame === it.id, it => st.frame = it.id, it => c => { c.fillStyle = '#1a1022'; c.fillRect(0, 0, 150, 150); c.save(); c.scale(0.15, 0.15); it.draw(c, st.fcol); c.restore(); }), sec('Frame & text colour'), swatches(() => st.fcol, c => { st.fcol = c; if (cat === 'frame') setTimeout(renderPanelKeep, 0); })); }
  else if (cat === 'fx') { P(sec(`Effects (${FX.length}), stack as many as you like`)); const ch = el('div', 'chips'); FX.forEach(f => { const b = el('button', st.fx.includes(f.id) ? 'on' : '', f.name); b.onclick = () => { const i = st.fx.indexOf(f.id); if (i >= 0) st.fx.splice(i, 1); else st.fx.push(f.id); b.classList.toggle('on'); req(); }; ch.append(b); }); P(ch); }
  else if (cat === 'text') {
    P(sec('Caption on the arc')); const ch = el('div', 'chips'); CAPTIONS.forEach(t => { const b = el('button', st.caption === t ? 'on' : '', t || 'None'); b.onclick = () => { st.caption = t; ch.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); req(); }; ch.append(b); }); P(ch);
    const f = el('div', 'field'); f.append(el('label', '', 'Your @handle (optional)')); const i = el('input'); i.type = 'text'; i.id = 'handleIn'; i.placeholder = '@krog_420'; i.maxLength = 22; i.value = st.handle; i.autocomplete = 'off'; i.oninput = () => { st.handle = i.value; req(); }; f.append(i); P(f, sec('Text colour'), swatches(() => st.fcol, c => st.fcol = c));
  }
  else if (cat === 'photo') {
    const d = el('button', 'drop', `📸 ${st.photo ? 'Swap photo' : 'Upload your PFP'}<small>Stays on your device. We never see it. Neither does Jollybob.</small>`); d.style.width = '100%'; d.id = 'uploadBtn'; d.onclick = () => $('#fileIn').click(); P(d);
    P(sec('Position'), slider('Zoom', 0.5, 3, 0.01, () => st.ph.s, v => st.ph.s = v), slider('Rotate', -3.14, 3.14, 0.01, () => st.ph.rot, v => st.ph.rot = v));
    const r = el('div', 'row'); const g = el('button', 'ghost', st.grade ? '🌙 Spooky grade: ON' : '🌙 Spooky grade: OFF'); g.onclick = () => { st.grade = !st.grade; g.textContent = st.grade ? '🌙 Spooky grade: ON' : '🌙 Spooky grade: OFF'; req(); }; const rs = el('button', 'ghost', 'Reset photo'); rs.onclick = () => { st.ph = { x: 0, y: 0, s: 1, rot: 0 }; renderPanel(); req(); }; r.append(g, rs); P(r);
    P(el('p', 'fine', 'Tip: drag the photo to move it. Pinch or scroll to zoom.'));
  }
  else if (cat === 'stickers') {
    P(sec(`Tap to add a sticker (${STICKERS.length})`)); const g = el('div', 'grid'); STICKERS.forEach(s => { const b = el('button', 'opt'); b.dataset.id = s.id; b.append(thumb(c => { c.fillStyle = '#1a1022'; c.fillRect(0, 0, 150, 150); c.drawImage(stickerCanvas(s.id), 5, 5, 140, 140); })); b.append(el('span', '', s.name)); b.onclick = () => addSticker(s.id); g.append(b); }); P(g);
    P(selBox());
  }
}
function renderPanelKeep() { const y = $('#panelBody').scrollTop; renderPanel(); $('#panelBody').scrollTop = y; }
function selBox() {
  const box = el('div', 'selbox'); box.id = 'selbox'; const s = st.stickers[st.sel];
  if (!s) { box.append(el('p', 'fine', st.stickers.length ? 'Tap a sticker on the preview to edit it.' : 'No stickers yet. Your PFP looks suspiciously un-haunted.')); return box; }
  box.append(el('div', 'sec', 'Selected: ' + STICKERS.find(x => x.id === s.id).name));
  box.append(slider('Size', 0.2, 3, 0.01, () => s.s, v => s.s = v), slider('Rotate', -3.14, 3.14, 0.01, () => s.rot, v => s.rot = v));
  const r = el('div', 'row'); [['↔ Flip', () => s.flip = !s.flip], ['⧉ Duplicate', () => { st.stickers.push(Object.assign({}, s, { x: s.x + 40, y: s.y + 40 })); st.sel = st.stickers.length - 1; }], ['⬆ Forward', () => { st.stickers.splice(st.sel, 1); st.stickers.push(s); st.sel = st.stickers.length - 1; }], ['🗑 Delete', () => { st.stickers.splice(st.sel, 1); st.sel = -1; }]].forEach(([t, f]) => { const b = el('button', 'ghost', t); b.onclick = () => { f(); refreshSel(); req(); }; r.append(b); }); box.append(r);
  return box;
}
function refreshSel() { const o = $('#selbox'); if (o) o.replaceWith(selBox()); }
function addSticker(id) { const n = st.stickers.length; st.stickers.push({ id, x: 500 + ((n * 137) % 360) - 180, y: 500 + ((n * 211) % 360) - 180, s: 0.9, rot: 0, flip: false }); st.sel = st.stickers.length - 1; refreshSel(); req(); hint('Drag to move · pinch to resize & rotate'); }
function renderCats() { const c = $('#cats'); c.innerHTML = ''; (st.mode === 'dress' ? DRESS_CATS : UP_CATS).forEach(([id, n]) => { const b = el('button', id === cat ? 'on' : '', n); b.dataset.cat = id; b.onclick = () => { cat = id; c.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); renderPanel(); }; c.append(b); }); }
function setMode(m) { st.mode = m; cat = m === 'dress' ? 'costume' : 'photo'; document.querySelectorAll('.tabs.mode button').forEach(b => b.classList.toggle('on', b.dataset.mode === m)); if (m === 'upload' && st.frame === 'none') st.frame = 'ring'; renderCats(); renderPanel(); req(); }
document.querySelectorAll('.tabs.mode button').forEach(b => b.onclick = () => setMode(b.dataset.mode));

// ---------- upload ----------
function loadFile(f) { if (!f || !/^image\//.test(f.type)) { toast('That is not an image. Nice try, Clawdeth.'); return; } const url = URL.createObjectURL(f); const im = new Image(); im.onload = () => { st.photo = im; st.ph = { x: 0, y: 0, s: 1, rot: 0 }; if (cat === 'photo') renderPanel(); req(); toast('PFP loaded. Time to haunt it.'); }; im.src = url; }
$('#fileIn').onchange = e => { loadFile(e.target.files[0]); e.target.value = ''; };
const wrap = $('#wrap'); wrap.addEventListener('dragover', e => e.preventDefault()); wrap.addEventListener('drop', e => { e.preventDefault(); if (st.mode !== 'upload') setMode('upload'); loadFile(e.dataTransfer.files[0]); });

// ---------- pointer: drag / pinch / rotate ----------
const pts = new Map(); let gest = null;
function toLocal(e) { const r = view.getBoundingClientRect(); return { x: (e.clientX - r.left) * 1000 / r.width, y: (e.clientY - r.top) * 1000 / r.height }; }
function hitSticker(p) { for (let i = st.stickers.length - 1; i >= 0; i--) { const s = st.stickers[i], dx = p.x - s.x, dy = p.y - s.y, c = Math.cos(-s.rot), sn = Math.sin(-s.rot), lx = dx * c - dy * sn, ly = dx * sn + dy * c, h = 150 * s.s; if (Math.abs(lx) < h && Math.abs(ly) < h) return i; } return -1; }
function target() { return st.sel >= 0 ? st.stickers[st.sel] : st.ph; }
function startGest() { const t = target(), a = [...pts.values()]; const isPh = st.sel < 0; const base = { x: isPh ? t.x : t.x, y: t.y, s: t.s, rot: t.rot };
  if (a.length === 1) gest = { kind: 1, p0: a[0], base }; else { const [p, q] = a; gest = { kind: 2, d0: Math.hypot(q.x - p.x, q.y - p.y), a0: Math.atan2(q.y - p.y, q.x - p.x), m0: { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }, base }; } }
view.addEventListener('pointerdown', e => { if (st.mode !== 'upload') return; view.setPointerCapture(e.pointerId); const p = toLocal(e); pts.set(e.pointerId, p);
  if (pts.size === 1) { const i = hitSticker(p); if (i !== st.sel) { st.sel = i; refreshSel(); } if (i < 0 && !st.photo) { $('#fileIn').click(); pts.clear(); return; } } startGest(); req(); });
view.addEventListener('pointermove', e => { if (!pts.has(e.pointerId) || !gest) return; pts.set(e.pointerId, toLocal(e)); const t = target(), a = [...pts.values()], b = gest.base;
  if (gest.kind === 1 && a.length === 1) { t.x = b.x + a[0].x - gest.p0.x; t.y = b.y + a[0].y - gest.p0.y; }
  else if (a.length >= 2) { const [p, q] = a, d = Math.hypot(q.x - p.x, q.y - p.y), an = Math.atan2(q.y - p.y, q.x - p.x), m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; t.s = Math.max(0.15, Math.min(4, b.s * d / gest.d0)); t.rot = b.rot + an - gest.a0; t.x = b.x + m.x - gest.m0.x; t.y = b.y + m.y - gest.m0.y; }
  req(); });
const endP = e => { if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId); if (pts.size) startGest(); else { gest = null; if (cat === 'stickers') refreshSel(); else if (cat === 'photo' && st.sel < 0) renderPanelKeep(); } };
view.addEventListener('pointerup', endP); view.addEventListener('pointercancel', endP);
view.addEventListener('wheel', e => { if (st.mode !== 'upload') return; e.preventDefault(); const t = target(); if (e.shiftKey) t.rot += e.deltaY * 0.003; else t.s = Math.max(0.15, Math.min(4, t.s * Math.exp(-e.deltaY * 0.0015))); req(); }, { passive: false });
view.addEventListener('click', () => { if (st.mode === 'dress') { const cs = pick(COSTUMES); applyCostume(cs); if (cat === 'costume') renderPanelKeep(); toast(`${cs.name}. Tap again for another.`); } });

// ---------- randomize ----------
function rnd(list, pNone = 0.35) { return Math.random() < pNone ? list[0].id : pick(list.slice(1)).id; }
$('#randomBtn').onclick = () => {
  if (st.mode === 'dress') {
    if (Math.random() < 0.4) { applyCostume(pick(COSTUMES)); }
    else { Object.assign(st, { pose: Math.random() < 0.7 ? 'front' : pick(POSES).id, hat: rnd(HATS, 0.15), eyes: rnd(EYES, 0.45), mouth: rnd(MOUTHS, 0.4), face: rnd(FACES, 0.7), outfit: rnd(OUTFITS, 0.6), back: rnd(BACKS, 0.4), prop: rnd(PROPS, 0.4), skin: rnd(SKINS, 0.6), bg: pick(BGS).id, frame: pick(FRAMES.slice(1)).id, fcol: pick(SWATCH)[1], costume: '' }); st.acc = pick(SWATCH)[1]; st.fx = FX.filter(() => Math.random() < 0.22).map(f => f.id); }
    toast('🎲 ' + pick(['The spirits have chosen.', 'Summoned a new look.', 'Trick or Crop?', 'Randomly haunted.']));
  } else { const n = 3 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) st.stickers.push({ id: pick(STICKERS).id, x: 140 + Math.random() * 720, y: 140 + Math.random() * 720, s: 0.5 + Math.random() * 0.6, rot: (Math.random() - 0.5) * 0.8, flip: Math.random() < 0.3 }); st.sel = -1; st.frame = pick(FRAMES.slice(1)).id; st.fcol = pick(SWATCH)[1]; toast('🎲 Sprinkled some spooky.'); }
  renderPanelKeep(); req();
};

// ---------- export ----------
function exportCanvas() { const k = mk(1000, 1000); compose(k.getContext('2d'), st, { sel: false }); return k; }
$('#downloadBtn').onclick = () => {
  const k = exportCanvas(); k.toBlob(b => { const url = URL.createObjectURL(b); const a = document.createElement('a'); a.href = url; a.download = 'grokbutt-halloween-pfp.png'; document.body.append(a); a.click(); a.remove();
    $('#outImg').src = url; $('#modal').hidden = false; const sb = $('#shareBtn'); const file = new File([b], 'grokbutt-halloween-pfp.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { sb.hidden = false; sb.onclick = () => navigator.share({ files: [file], title: 'My GROKBUTT Halloween PFP', text: 'Trick or Crop? 🎃 Made with the GROKBUTT Halloween PFP Maker' }).catch(() => {}); } else sb.hidden = true;
    toast('Downloaded! Go haunt your timeline.'); }, 'image/png');
};
$('#closeModal').onclick = () => { $('#modal').hidden = true; };
$('#circleToggle').onchange = e => wrap.classList.toggle('round', e.target.checked);

// test / automation hooks
window.GB = { st, req, setMode, addSticker, applyCostume, COSTUMES, STICKERS, exportCanvas, loadFile, renderPanel };

// ---------- boot ----------
renderCats();
loadSprites().then(() => { applyCostume(COSTUMES[0]); renderPanel(); frame(); hint('Tap GrokButt for a surprise costume'); document.body.dataset.ready = '1';
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { for (const k in stickerCache) delete stickerCache[k]; req(); renderPanelKeep(); });
}).catch(err => { console.error('sprite load failed', err); });
})();
