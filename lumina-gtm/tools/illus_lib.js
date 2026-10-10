// Custom flat illustrations for the Lumina deck (SVG -> PNG)
const sharp = require('sharp');
const path = require('path');
const OUT = (f) => path.join(__dirname, 'assets', f);

const P = {
  navy: '#0B1747', navy2: '#14245F', navy3: '#1C2F78', navy4: '#2D4196',
  blue: '#3B82F6', cyan: '#14C8EE', yellow: '#FFC61A', orange: '#FF7A1A',
  violet: '#A78BFA', green: '#22C55E', red: '#F0525F', white: '#FFFFFF', ice: '#DDEBFF',
};
const SKIN = ['#8D5524', '#C68642', '#5C3A21', '#E0AC69', '#A0673A', '#F1C27D', '#6B4226'];

// ---------- person figure ----------
// pose: stand | cheer | walk | sit | slump | wave
function person(x, y, s, shirt, skin, pose = 'stand', hair = '#1A1A2E', pants = '#0E1A45') {
  const g = [];
  const sw = 9 * s; // limb width
  const limb = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const hx = x, hy = y - 118 * s;
  // legs
  if (pose === 'walk') {
    g.push(limb(x - 6 * s, y - 50 * s, x - 22 * s, y, pants));
    g.push(limb(x + 6 * s, y - 50 * s, x + 20 * s, y, pants));
  } else if (pose === 'sit' || pose === 'slump') {
    g.push(limb(x - 6 * s, y - 40 * s, x + 26 * s, y - 38 * s, pants));
    g.push(limb(x + 26 * s, y - 38 * s, x + 28 * s, y, pants));
    g.push(limb(x + 4 * s, y - 40 * s, x + 34 * s, y - 38 * s, pants));
    g.push(limb(x + 34 * s, y - 38 * s, x + 36 * s, y, pants));
  } else {
    g.push(limb(x - 8 * s, y - 50 * s, x - 10 * s, y, pants));
    g.push(limb(x + 8 * s, y - 50 * s, x + 10 * s, y, pants));
  }
  const bodyTop = (pose === 'sit' || pose === 'slump') ? y - 100 * s : y - 98 * s;
  const bodyBot = (pose === 'sit' || pose === 'slump') ? y - 36 * s : y - 44 * s;
  // arms (behind body for some)
  const sh = bodyTop + 12 * s;
  let arms = '';
  if (pose === 'cheer') arms = limb(x - 16 * s, sh, x - 34 * s, sh - 44 * s, skin) + limb(x + 16 * s, sh, x + 34 * s, sh - 44 * s, skin);
  else if (pose === 'wave') arms = limb(x - 16 * s, sh, x - 22 * s, sh + 44 * s, skin) + limb(x + 16 * s, sh, x + 36 * s, sh - 40 * s, skin);
  else if (pose === 'walk') arms = limb(x - 14 * s, sh, x - 30 * s, sh + 38 * s, skin) + limb(x + 14 * s, sh, x + 26 * s, sh + 40 * s, skin);
  else if (pose === 'slump') arms = limb(x - 12 * s, sh, x + 18 * s, sh + 40 * s, skin) + limb(x + 12 * s, sh, x + 30 * s, sh + 40 * s, skin);
  else if (pose === 'sit') arms = limb(x - 12 * s, sh, x + 30 * s, sh + 26 * s, skin) + limb(x + 12 * s, sh, x + 40 * s, sh + 26 * s, skin);
  else arms = limb(x - 16 * s, sh, x - 20 * s, sh + 46 * s, skin) + limb(x + 16 * s, sh, x + 20 * s, sh + 46 * s, skin);
  g.push(arms);
  // body
  g.push(`<rect x="${x - 19 * s}" y="${bodyTop}" width="${38 * s}" height="${bodyBot - bodyTop}" rx="${16 * s}" fill="${shirt}"/>`);
  // head
  let hyy = (pose === 'sit') ? hy + 2 * s : hy;
  let hxx = hx;
  if (pose === 'slump') { hyy = hy + 16 * s; hxx = hx + 8 * s; }
  g.push(`<circle cx="${hxx}" cy="${hyy}" r="${17 * s}" fill="${skin}"/>`);
  g.push(`<path d="M${hxx - 17 * s} ${hyy - 2 * s} a${17 * s} ${17 * s} 0 0 1 ${34 * s} 0 q-${8 * s} -${8 * s} -${17 * s} -${7 * s} q-${10 * s} ${1 * s} -${17 * s} ${7 * s}z" fill="${hair}"/>`);
  return g.join('');
}

const svg = (w, h, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
const render = (name, w, h, body, defs) => sharp(Buffer.from(svg(w, h, body, defs))).png().toFile(OUT(name));

// icon bubble (simple glyphs drawn with paths)
const GLYPH = {
  cap: (c) => `<path d="M-26 -4 L0 -16 L26 -4 L0 8Z" fill="${c}"/><path d="M-16 1 v12 q16 10 32 0 v-12 L0 8Z" fill="${c}"/>`,
  heart: (c) => `<path d="M0 18 C-30 -4 -18 -26 0 -12 C18 -26 30 -4 0 18Z" fill="${c}"/>`,
  star: (c) => `<path d="M0 -22 L6 -7 L22 -7 L9 3 L14 19 L0 9 L-14 19 L-9 3 L-22 -7 L-6 -7Z" fill="${c}"/>`,
  game: (c) => `<rect x="-24" y="-12" width="48" height="26" rx="13" fill="${c}"/><rect x="-16" y="-2" width="12" height="4" fill="#0B1747"/><rect x="-12" y="-6" width="4" height="12" fill="#0B1747"/><circle cx="10" cy="-2" r="3" fill="#0B1747"/><circle cx="16" cy="4" r="3" fill="#0B1747"/>`,
  trophy: (c) => `<path d="M-14 -18 h28 v10 q0 18 -14 20 q-14 -2 -14 -20z" fill="${c}"/><rect x="-4" y="10" width="8" height="8" fill="${c}"/><rect x="-12" y="17" width="24" height="5" rx="2" fill="${c}"/><path d="M-14 -14 h-8 q0 12 10 12 M14 -14 h8 q0 12 -10 12" stroke="${c}" stroke-width="4" fill="none"/>`,
  bulb: (c) => `<circle cx="0" cy="-6" r="15" fill="${c}"/><rect x="-7" y="8" width="14" height="10" rx="3" fill="${c}"/>`,
};
const bubble = (x, y, r, bg, glyph, gc = '#FFFFFF') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${bg}"/><g transform="translate(${x} ${y}) scale(${r / 34})">${GLYPH[glyph](gc)}</g>`;


module.exports={P,SKIN,person,svg,render,GLYPH,bubble,OUT};
