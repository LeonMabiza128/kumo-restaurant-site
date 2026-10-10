// Gamified learning loop: learn -> play -> win -> thrive around a happy learner
const { P, SKIN, person, render, GLYPH, bubble } = require('./illus_lib.js');
const glow = (id, c) => `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c}" stop-opacity="0.45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
(async () => {
  const cx = 700, cy = 560, R = 380;
  let b = `<circle cx="${cx}" cy="${cy}" r="460" fill="url(#g)"/>`;
  const seg = (a0, a1, c) => { const t0 = a0 * Math.PI / 180, t1 = a1 * Math.PI / 180;
    const x0 = cx + R * Math.cos(t0), y0 = cy + R * Math.sin(t0), x1 = cx + R * Math.cos(t1), y1 = cy + R * Math.sin(t1);
    const ax = cx + R * Math.cos(t1), ay = cy + R * Math.sin(t1), tx = -Math.sin(t1), ty = Math.cos(t1), nx = Math.cos(t1), ny = Math.sin(t1);
    return `<path d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}" stroke="${c}" stroke-width="34" fill="none" stroke-linecap="round"/>` +
      `<path d="M${ax + tx * 50} ${ay + ty * 50} L${ax + nx * 46} ${ay + ny * 46} L${ax - nx * 46} ${ay - ny * 46}Z" fill="${c}"/>`; };
  b += seg(-80, -20, P.blue) + seg(10, 70, P.orange) + seg(100, 160, P.cyan) + seg(190, 250, P.violet);
  b += bubble(cx + R * Math.cos(-0.087 * 0) , cy - R, 0, P.blue, 'cap');
  const icons = [[-90, P.yellow, 'cap', '#0B1747'], [0, P.blue, 'game'], [90, P.orange, 'trophy'], [180, P.green, 'heart']];
  for (const [a, c, gl, gc] of icons) { const t = a * Math.PI / 180; b += bubble(cx + R * Math.cos(t), cy + R * Math.sin(t), 72, c, gl, gc || '#FFFFFF'); }
  b += `<ellipse cx="${cx}" cy="${cy + 230}" rx="170" ry="24" fill="#14245F"/>`;
  b += person(cx, cy + 230, 2.6, P.cyan, SKIN[3], 'cheer');
  const hy = cy + 230 - 118 * 2.6;
  b += `<circle cx="${cx - 15}" cy="${hy + 5}" r="6" fill="#0B1747"/><circle cx="${cx + 15}" cy="${hy + 5}" r="6" fill="#0B1747"/><path d="M${cx - 18} ${hy + 18} q18 26 36 0z" fill="#0B1747"/>`;
  b += `<rect x="${cx + 70}" y="${hy - 120}" width="56" height="96" rx="12" fill="#FFFFFF"/><rect x="${cx + 78}" y="${hy - 108}" width="40" height="66" rx="6" fill="#14C8EE"/>`;
  await render('il_gameloop.png', 1400, 1120, b, glow('g', '#FFC61A'));
  console.log('ok');
})();
