// Cartoon scenes for the social post series (people get faces here)
const { P, SKIN, person, render, GLYPH, bubble } = require('./illus_lib.js');
const glow = (id, c) => `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c}" stop-opacity="0.45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

// face drawn on top of a person's head; matches head offsets used in illus_lib
function face(x, y, s, pose = 'stand', mood = 'happy') {
  let hx = x, hy = y - 118 * s;
  if (pose === 'sit') hy += 2 * s;
  if (pose === 'slump') { hy += 16 * s; hx += 8 * s; }
  const e = `stroke="#0B1747" stroke-width="${2.6 * s}" stroke-linecap="round" fill="none"`;
  let f = '';
  if (mood === 'tired') f += `<path d="M${hx - 9 * s} ${hy + 3 * s} h${5 * s} M${hx + 4 * s} ${hy + 3 * s} h${5 * s}" ${e}/>`;
  else f += `<circle cx="${hx - 6 * s}" cy="${hy + 2 * s}" r="${2.3 * s}" fill="#0B1747"/><circle cx="${hx + 6 * s}" cy="${hy + 2 * s}" r="${2.3 * s}" fill="#0B1747"/>`;
  if (mood === 'happy') f += `<path d="M${hx - 6 * s} ${hy + 8 * s} q${6 * s} ${7 * s} ${12 * s} 0" ${e}/>`;
  else if (mood === 'big') f += `<path d="M${hx - 7 * s} ${hy + 7 * s} q${7 * s} ${10 * s} ${14 * s} 0z" fill="#0B1747"/>`;
  else f += `<path d="M${hx - 5 * s} ${hy + 12 * s} q${5 * s} -${5 * s} ${10 * s} 0" ${e}/>`;
  return f;
}
const guy = (x, y, s, shirt, skin, pose, mood, hair) => person(x, y, s, shirt, skin, pose, hair) + face(x, y, s, pose, mood);
const confetti = (pts) => pts.map(([x, y, c, r = 30]) => `<rect x="${x}" y="${y}" width="22" height="22" rx="4" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('');
const desk = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="18" rx="9" fill="#2D4196"/><rect x="${x + 20}" y="${y + 18}" width="14" height="140" fill="#2D4196"/><rect x="${x + w - 34}" y="${y + 18}" width="14" height="140" fill="#2D4196"/>`;
const laptop = (x, y, c = '#14C8EE') => `<rect x="${x}" y="${y}" width="150" height="96" rx="10" fill="#C3CEF0"/><rect x="${x + 10}" y="${y + 10}" width="130" height="76" rx="5" fill="${c}"/><rect x="${x - 20}" y="${y + 96}" width="190" height="12" rx="6" fill="#8C9BCB"/>`;

(async () => {
  // 1. Monday: drained vs energised
  {
    let b = `<circle cx="1050" cy="520" r="420" fill="url(#g)"/>`;
    b += `<ellipse cx="380" cy="980" rx="300" ry="34" fill="#14245F"/><ellipse cx="1050" cy="980" rx="300" ry="34" fill="#14245F"/>`;
    // left: slumped at desk under a cloud
    b += desk(200, 760, 360) + laptop(300, 664, '#2D4196');
    b += guy(330, 975, 2.6, '#8C9BCB', SKIN[2], 'slump', 'tired');
    b += `<g fill="#8C9BCB"><circle cx="330" cy="250" r="70"/><circle cx="420" cy="230" r="90"/><circle cx="510" cy="260" r="65"/><rect x="290" y="250" width="270" height="70" rx="35"/></g>`;
    b += `<path d="M360 360 l-20 50 M430 360 l-20 50 M500 360 l-20 50" stroke="#14C8EE" stroke-width="10" stroke-linecap="round"/>`;
    b += `<text x="600" y="520" font-family="Arial" font-weight="bold" font-size="60" fill="#8C9BCB">z</text><text x="640" y="460" font-family="Arial" font-weight="bold" font-size="80" fill="#8C9BCB">z</text>`;
    // arrow
    b += `<path d="M640 650 h110" stroke="#FFC61A" stroke-width="22" stroke-linecap="round"/><path d="M730 600 l60 50 l-60 50z" fill="#FFC61A"/>`;
    // right: cheering with sun
    b += `<circle cx="1050" cy="300" r="110" fill="#FFC61A"/>`;
    for (let a = 0; a < 360; a += 30) { const r1 = 135, r2 = 185, t = a * Math.PI / 180; b += `<line x1="${1050 + r1 * Math.cos(t)}" y1="${300 + r1 * Math.sin(t)}" x2="${1050 + r2 * Math.cos(t)}" y2="${300 + r2 * Math.sin(t)}" stroke="#FFC61A" stroke-width="14" stroke-linecap="round"/>`; }
    b += guy(1050, 975, 2.8, P.cyan, SKIN[3], 'cheer', 'big');
    b += bubble(1260, 560, 55, P.orange, 'star') + bubble(860, 600, 50, P.green, 'heart');
    await render('il_monday.png', 1400, 1060, b, glow('g', '#FFC61A'));
  }
  // 2. Burnout: tired at laptop, low battery
  {
    let b = `<circle cx="700" cy="560" r="480" fill="url(#g)"/><ellipse cx="700" cy="1000" rx="460" ry="40" fill="#14245F"/>`;
    b += desk(420, 760, 560) + laptop(640, 664, '#F0525F');
    b += guy(560, 990, 2.7, P.violet, SKIN[0], 'slump', 'sad');
    b += `<rect x="560" y="170" width="300" height="150" rx="26" fill="none" stroke="#C3CEF0" stroke-width="16"/><rect x="866" y="215" width="24" height="60" rx="8" fill="#C3CEF0"/><rect x="580" y="190" width="60" height="110" rx="12" fill="#F0525F"/>`;
    b += `<g transform="translate(1080 420)"><path d="M0 -70 L70 60 H-70Z" fill="#FFC61A"/><rect x="-8" y="-25" width="16" height="50" rx="6" fill="#0B1747"/><circle cx="0" cy="40" r="9" fill="#0B1747"/></g>`;
    b += bubble(300, 430, 55, P.blue, 'cap') + `<g transform="translate(1110 760)"><circle r="60" fill="#14245F"/><circle r="38" fill="none" stroke="#14C8EE" stroke-width="10"/><path d="M0 0 v-24 M0 0 l18 10" stroke="#14C8EE" stroke-width="10" stroke-linecap="round"/></g>`;
    await render('il_burnout.png', 1400, 1080, b, glow('g', '#F0525F'));
  }
  // 3. Tug of war
  {
    let b = `<circle cx="800" cy="520" r="520" fill="url(#g)"/><ellipse cx="800" cy="980" rx="720" ry="44" fill="#14245F"/>`;
    b += `<path d="M150 760 Q800 800 1450 760" stroke="#D9A066" stroke-width="20" fill="none" stroke-linecap="round"/>`;
    b += `<path d="M800 785 v-120" stroke="#C3CEF0" stroke-width="10"/><path d="M800 665 l90 30 l-90 30z" fill="#FFC61A"/>`;
    const L = [[260, P.blue, SKIN[1], 'big'], [430, P.blue, SKIN[4], 'happy'], [600, P.blue, SKIN[6], 'big']];
    const R = [[1000, P.orange, SKIN[5], 'big'], [1170, P.orange, SKIN[0], 'happy'], [1340, P.orange, SKIN[3], 'big']];
    for (const [x, c, sk, m] of L) b += `<g transform="rotate(-12 ${x} 975)">${guy(x, 975, 2.2, c, sk, 'walk', m)}</g>`;
    for (const [x, c, sk, m] of R) b += `<g transform="rotate(12 ${x} 975)">${guy(x, 975, 2.2, c, sk, 'walk', m)}</g>`;
    b += `<rect x="560" y="120" width="480" height="150" rx="24" fill="#1C2F78"/><text x="680" y="225" font-family="Arial" font-weight="bold" font-size="90" fill="#3B82F6" text-anchor="middle">12</text><text x="800" y="220" font-family="Arial" font-weight="bold" font-size="70" fill="#C3CEF0" text-anchor="middle">:</text><text x="920" y="225" font-family="Arial" font-weight="bold" font-size="90" fill="#FF7A1A" text-anchor="middle">11</text>`;
    b += confetti([[300, 240, P.yellow], [1240, 220, P.cyan], [420, 360, P.green, 60], [1150, 360, P.violet, 15]]);
    await render('il_tug.png', 1600, 1060, b, glow('g', '#FFC61A'));
  }
  // 4. Onboarding: welcome door with buddy
  {
    let b = `<circle cx="700" cy="540" r="480" fill="url(#g)"/><ellipse cx="700" cy="990" rx="520" ry="40" fill="#14245F"/>`;
    b += `<rect x="170" y="330" width="380" height="660" rx="20" fill="#1C2F78"/><rect x="210" y="380" width="300" height="610" rx="10" fill="#FFC61A" fill-opacity="0.25"/><circle cx="480" cy="700" r="14" fill="#FFC61A"/>`;
    b += `<path d="M120 220 Q450 300 780 220" stroke="#C3CEF0" stroke-width="6" fill="none"/>`;
    const flags = ['W', 'E', 'L', 'C', 'O', 'M', 'E'];
    flags.forEach((t, i) => { const x = 160 + i * 92, y = 240 + Math.sin((i / 6) * Math.PI) * 38; b += `<path d="M${x} ${y} h70 l-35 70z" fill="${[P.yellow, P.cyan, P.orange, P.green, P.violet, P.blue, P.yellow][i]}"/><text x="${x + 35}" y="${y + 34}" font-family="Arial" font-weight="bold" font-size="30" fill="#0B1747" text-anchor="middle">${t}</text>`; });
    b += guy(680, 980, 2.6, P.cyan, SKIN[4], 'walk', 'happy') + `<rect x="690" y="760" width="40" height="52" rx="6" fill="#FFFFFF"/><rect x="697" y="770" width="26" height="8" rx="3" fill="#FF7A1A"/>`;
    b += `<rect x="560" y="860" width="80" height="70" rx="10" fill="#FF7A1A"/><path d="M580 860 v-16 h40 v16" stroke="#FF7A1A" stroke-width="8" fill="none"/>`;
    b += guy(1000, 980, 2.6, P.yellow, SKIN[2], 'wave', 'big');
    for (const [x, y, c] of [[1150, 300, P.orange], [1230, 380, P.cyan], [1080, 400, P.violet]]) b += `<ellipse cx="${x}" cy="${y}" rx="48" ry="58" fill="${c}"/><path d="M${x} ${y + 58} q-20 80 10 160" stroke="#C3CEF0" stroke-width="4" fill="none"/>`;
    await render('il_onboard.png', 1400, 1060, b, glow('g', '#14C8EE'));
  }
  // 5. Recognition: trophy moment
  {
    let b = `<circle cx="700" cy="520" r="480" fill="url(#g)"/><ellipse cx="700" cy="1000" rx="560" ry="40" fill="#14245F"/>`;
    b += `<rect x="530" y="800" width="340" height="200" rx="16" fill="#1C2F78"/><rect x="530" y="800" width="340" height="24" rx="12" fill="#FFC61A"/><text x="700" y="950" font-family="Arial" font-weight="bold" font-size="110" fill="#FFFFFF" text-anchor="middle">1</text>`;
    b += guy(700, 805, 2.4, P.orange, SKIN[0], 'cheer', 'big');
    b += `<g transform="translate(700 330) scale(3.2)">${GLYPH.trophy('#FFC61A')}</g>`;
    b += guy(330, 995, 2.4, P.cyan, SKIN[3], 'cheer', 'happy') + guy(1070, 995, 2.4, P.violet, SKIN[5], 'cheer', 'happy');
    b += confetti([[420, 200, P.cyan], [960, 180, P.orange], [300, 420, P.yellow, 60], [1110, 430, P.green, 15], [560, 140, P.violet], [860, 120, P.yellow, 45], [1000, 300, P.blue, 70], [400, 320, P.orange, 10]]);
    b += bubble(220, 600, 55, P.blue, 'star') + bubble(1180, 620, 55, P.green, 'heart');
    await render('il_recog.png', 1400, 1080, b, glow('g', '#FFC61A'));
  }
  // 6. AI: person and friendly robot high-five
  {
    let b = `<circle cx="700" cy="540" r="480" fill="url(#g)"/><ellipse cx="700" cy="1000" rx="520" ry="40" fill="#14245F"/>`;
    b += guy(520, 990, 2.9, P.yellow, SKIN[6], 'wave', 'big');
    // robot
    const rx = 940;
    b += `<rect x="${rx - 22}" y="900" width="18" height="90" rx="9" fill="#8C9BCB"/><rect x="${rx + 24}" y="900" width="18" height="90" rx="9" fill="#8C9BCB"/>`;
    b += `<rect x="${rx - 80}" y="640" width="180" height="270" rx="40" fill="#C3CEF0"/><rect x="${rx - 40}" y="700" width="100" height="70" rx="14" fill="#14C8EE"/><circle cx="${rx + 10}" cy="830" r="20" fill="#FFC61A"/>`;
    b += `<line x1="${rx + 90}" y1="700" x2="${rx + 130}" y2="820" stroke="#C3CEF0" stroke-width="26" stroke-linecap="round"/>`;
    b += `<line x1="${rx - 70}" y1="690" x2="${rx - 210}" y2="560" stroke="#C3CEF0" stroke-width="26" stroke-linecap="round"/>`;
    b += `<rect x="${rx - 85}" y="420" width="190" height="180" rx="44" fill="#C3CEF0"/><rect x="${rx - 60}" y="460" width="140" height="95" rx="30" fill="#0B1747"/>`;
    b += `<circle cx="${rx - 22}" cy="500" r="15" fill="#14C8EE"/><circle cx="${rx + 42}" cy="500" r="15" fill="#14C8EE"/><path d="M${rx - 22} 530 q32 22 64 0" stroke="#14C8EE" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    b += `<line x1="${rx + 10}" y1="420" x2="${rx + 10}" y2="360" stroke="#C3CEF0" stroke-width="10"/><circle cx="${rx + 10}" cy="350" r="18" fill="#FF7A1A"/>`;
    // spark where hands meet
    b += `<g transform="translate(${rx - 225} 520)">${GLYPH.star('#FFC61A').replace('<path', '<path transform="scale(2.4)"')}</g>`;
    b += `<path d="M640 430 l-30 -40 M700 410 v-50 M760 430 l30 -40" stroke="#FFC61A" stroke-width="10" stroke-linecap="round"/>`;
    b += `<text x="1140" y="330" font-family="Arial" font-weight="bold" font-size="90" fill="#14C8EE">AI</text>`;
    b += bubble(260, 420, 55, P.violet, 'bulb') + bubble(1160, 700, 50, P.orange, 'cap');
    await render('il_ai.png', 1400, 1080, b, glow('g', '#14C8EE'));
  }
  // 7. Wellbeing check-in: mood scale
  {
    let b = `<circle cx="700" cy="560" r="480" fill="url(#g)"/><ellipse cx="700" cy="1000" rx="480" ry="40" fill="#14245F"/>`;
    const moods = [['#F0525F', 'sad'], ['#FF7A1A', 'flat'], ['#FFC61A', 'ok'], ['#22C55E', 'happy'], ['#14C8EE', 'big']];
    b += `<rect x="230" y="150" width="940" height="200" rx="100" fill="#1C2F78"/>`;
    moods.forEach(([c, m], i) => {
      const x = 330 + i * 185, y = 250, sel = i === 3;
      b += `<circle cx="${x}" cy="${y}" r="${sel ? 78 : 62}" fill="${c}"${sel ? ' stroke="#FFFFFF" stroke-width="10"' : ''}/><circle cx="${x - 18}" cy="${y - 12}" r="8" fill="#0B1747"/><circle cx="${x + 18}" cy="${y - 12}" r="8" fill="#0B1747"/>`;
      const e = 'stroke="#0B1747" stroke-width="9" fill="none" stroke-linecap="round"';
      if (m === 'sad') b += `<path d="M${x - 22} ${y + 28} q22 -20 44 0" ${e}/>`;
      else if (m === 'flat') b += `<path d="M${x - 20} ${y + 20} h40" ${e}/>`;
      else if (m === 'ok') b += `<path d="M${x - 20} ${y + 16} q20 10 40 0" ${e}/>`;
      else if (m === 'happy') b += `<path d="M${x - 24} ${y + 12} q24 26 48 0" ${e}/>`;
      else b += `<path d="M${x - 26} ${y + 8} q26 36 52 0z" fill="#0B1747"/>`;
    });
    b += `<path d="M885 340 l-30 70" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>`;
    b += `<rect x="640" y="560" width="190" height="330" rx="34" fill="#C3CEF0"/><rect x="660" y="600" width="150" height="250" rx="16" fill="#0B1747"/><circle cx="735" cy="680" r="34" fill="#22C55E"/><rect x="680" y="740" width="110" height="16" rx="8" fill="#8C9BCB"/><rect x="680" y="770" width="80" height="16" rx="8" fill="#8C9BCB"/>`;
    b += guy(500, 990, 2.7, P.green, SKIN[1], 'stand', 'happy') + `<line x1="545" y1="740" x2="640" y2="700" stroke="${SKIN[1]}" stroke-width="24" stroke-linecap="round"/>`;
    b += guy(1000, 990, 2.7, P.blue, SKIN[4], 'wave', 'big');
    b += bubble(1180, 520, 55, P.violet, 'heart') + bubble(260, 560, 50, P.cyan, 'star');
    await render('il_well.png', 1400, 1080, b, glow('g', '#22C55E'));
  }
  console.log('done');
})();
