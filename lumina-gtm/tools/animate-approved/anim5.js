// Animate approved creatives from their extracted layers. Final frame = the approved image.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const HERE = __dirname;
const FPS = 30;
const OUT = path.join(HERE, 'out'); fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const U = (d, f) => 'file://' + path.join(HERE, d, f);

function build(name) {
  const L = JSON.parse(fs.readFileSync(path.join(HERE, name, 'layout.json')));
  const ly = L.layers;
  const n = L.covers.length;
  const covStart = 3.35, covGap = 0.42;
  const tEnd = Math.max(covStart + n * covGap + 0.45, 5.0);
  const DUR = Math.max(9, Math.ceil(tEnd + 3.2));
  const img = (k, extra = '', style = '') => ly[k] ? `<img class="a" src="${U(name, k + '.png')}" style="left:${ly[k].x}px;top:${ly[k].y}px;width:${ly[k].w}px;height:${ly[k].h}px;${style}" ${extra}>` : '';
  const covers = L.covers.map((c, i) => `<div class="cv" style="left:${c.cx - c.w / 2}px;top:${c.cy - c.h / 2}px;width:${c.w}px;height:${c.h}px;transform:rotate(${c.ang}deg)">
      <div class="a" style="width:100%;height:100%;background:${c.color};border-radius:6px;filter:blur(1.2px);transform-origin:100% 50%;animation:wipe .45s ${covStart + i * covGap}s both cubic-bezier(.6,0,.25,1)"></div></div>`).join('');
  const card = ly.card ? `<img class="a" src="${U(name, 'card.png')}" style="position:absolute;left:${ly.card.x}px;top:${ly.card.y}px;width:${ly.card.w}px;height:${ly.card.h}px;transform-origin:50% 50%;animation:lift .7s 3.0s both ease-in-out">` : '';
  const c = ly.cta;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:${L.bg}}
#s{position:absolute;left:0;top:0;width:1122px;height:1402px;transform:scale(${1080 / 1122});transform-origin:0 0;overflow:hidden;background:${L.bg} url(${U(name, 'plate_bg.png')}) 0 0/1122px 1402px no-repeat}
img{position:absolute;display:block}
.a{animation-play-state:paused!important}
.cv{position:absolute}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes drop{from{opacity:0;translate:0 -24px}to{opacity:1;translate:0 0}}
@keyframes up{from{opacity:0;translate:0 46px}to{opacity:1;translate:0 0}}
@keyframes upS{from{opacity:0;translate:0 26px}to{opacity:1;translate:0 0}}
@keyframes boxwipe{from{clip-path:inset(0 100% 0 0 round 14px)}to{clip-path:inset(0 0 0 0 round 14px)}}
@keyframes reveal{from{clip-path:circle(0% at 50% 100%)}to{clip-path:circle(150% at 50% 100%)}}
@keyframes zoom{from{scale:1.12}to{scale:1}}
@keyframes lift{0%{scale:1}45%{scale:1.05}100%{scale:1}}
@keyframes wipe{from{scale:1 1}to{scale:0 1}}
@keyframes pulse{0%,100%{scale:1;opacity:1}50%{scale:1.25;opacity:.55}}
@keyframes ctaIn{from{opacity:0;translate:90px 0}to{opacity:1;translate:0 0}}
@keyframes sheen{from{translate:-160px 0}to{translate:${c.pill.w + 160}px 0}}
</style></head><body><div id="s">
<div class="a" style="position:absolute;inset:0;animation:reveal 1.25s 2.0s both cubic-bezier(.55,0,.25,1)">
  <div class="a" style="position:absolute;inset:0;transform-origin:561px ${L.arc_min}px;animation:zoom 6.2s 2.0s both cubic-bezier(.15,.6,.3,1)">
    <img src="${U(name, 'photo.png')}" style="left:0;top:0;width:1122px;height:1402px">
    ${card}
    ${covers}
  </div>
</div>
${img('logo', '', 'animation:drop .6s .15s both cubic-bezier(.2,.8,.2,1)')}
${img('line1', '', 'animation:up .7s .45s both cubic-bezier(.2,.8,.2,1)')}
${img('box', '', 'animation:boxwipe .6s 1.05s both cubic-bezier(.65,0,.25,1)')}
${img('sub', '', 'animation:upS .6s 1.6s both cubic-bezier(.2,.8,.2,1)')}
${ly.sparks ? img('sparks', '', `transform-origin:30% 70%;animation:fade .3s ${tEnd - 0.4}s both, pulse .5s ${tEnd - 0.1}s 3 forwards`) : ''}
${img('url', '', `animation:fade .5s ${tEnd + 0.3}s both`)}
<div class="a" style="position:absolute;left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;animation:ctaIn .65s ${tEnd + 0.5}s both cubic-bezier(.2,.8,.2,1)">
  <img src="${U(name, 'cta.png')}" style="left:0;top:0;width:${c.w}px;height:${c.h}px">
  <div style="position:absolute;left:${c.pill.x}px;top:${c.pill.y}px;width:${c.pill.w}px;height:${c.pill.h}px;border-radius:${c.pill.h / 2}px;overflow:hidden">
    <div class="a" style="position:absolute;top:-20%;left:0;width:90px;height:140%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:sheen .9s ${tEnd + 1.4}s both ease-in-out"></div>
  </div>
</div>
</div></body></html>`;
  return { html, DUR };
}

async function render(b, name) {
  const { html, DUR } = build(name);
  const FR = path.join(OUT, 'fr_' + name);
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const f = path.join(OUT, `_${name}.html`); fs.writeFileSync(f, html);
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + f); await p.waitForLoadState('networkidle');
  const N = FPS * DUR;
  for (let i = 0; i < N; i++) {
    await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, (i / FPS) * 1000);
    await p.screenshot({ path: path.join(FR, `f${String(i).padStart(4, '0')}.png`) });
  }
  await p.close();
  const mp4 = path.join(OUT, `Lumina-${name}-animated.mp4`);
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${FR}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow -movflags +faststart ${mp4}`);
  console.log('done', name, DUR + 's');
}

(async () => {
  const names = fs.readdirSync(HERE).filter((d) => /^p0\d-/.test(d) && fs.existsSync(path.join(HERE, d, 'layout.json')) && (!only.length || only.some((o) => d.startsWith(o)))).sort();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const q = [...names];
  await Promise.all([0, 1, 2].map(async () => { while (q.length) await render(b, q.shift()); }));
  await b.close();
})();
