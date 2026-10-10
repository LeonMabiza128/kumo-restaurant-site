// Animate the problem-led posts: reuse gen_posts3 markup, inject a motion stylesheet, seek and capture frames, encode MP4.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { post, POSTS } = require('./gen_posts3.js');
const OUT = path.join(__dirname, 'out', 'animated');
fs.mkdirSync(OUT, { recursive: true });
const FPS = 30, DUR = 8;
const only = process.argv.slice(2);

const motion = `<style>
.top,.kicker,h1,.stat,.statline,.src,.ill,.panel,.panel h2,.row,.row i,.foot,.foot span:last-child,h1 em{animation-play-state:paused!important}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes up{from{opacity:0;translate:0 50px}to{opacity:1;translate:0 0}}
@keyframes artIn{from{opacity:0;translate:0 90px;scale:.88}to{opacity:1;translate:0 0;scale:1}}
@keyframes bob{from{translate:0 0}to{translate:0 -14px}}
@keyframes panelIn{from{opacity:0;translate:0 140px}to{opacity:1;translate:0 0}}
@keyframes tickPop{0%{scale:0}70%{scale:1.3}100%{scale:1}}
@keyframes sweep{from{background-size:0% 100%}to{background-size:100% 100%}}
@keyframes goYellow{from{color:#fff}to{color:#FFC61A}}
@keyframes ctaIn{from{opacity:0;translate:60px 0}to{opacity:1;translate:0 0}}
@keyframes nudge{0%,100%{translate:0 0}50%{translate:8px 0}}
.top{animation:fade .5s .1s both}
.kicker{animation:up .5s .35s both}
h1,.stat{animation:up .7s .6s both cubic-bezier(.2,.8,.2,1)}
.statline{animation:up .5s 1.1s both}
.src{animation:fade .5s 1.4s both}
.y h1 em{background:linear-gradient(#0B1747,#0B1747) no-repeat 0 0/0% 100%;animation:sweep .55s 1.25s both cubic-bezier(.6,0,.2,1)}
.n h1 em{animation:goYellow .5s 1.25s both}
.ill{animation:artIn .8s 1.5s both cubic-bezier(.2,.8,.2,1),bob 1.6s 2.3s infinite alternate ease-in-out}
.panel{animation:panelIn .7s 2.7s both cubic-bezier(.2,.8,.2,1)}
.panel h2{animation:fade .4s 3.1s both}
.row:nth-of-type(1){animation:up .45s 3.35s both}.row:nth-of-type(1) i{animation:tickPop .4s 3.55s both}
.row:nth-of-type(2){animation:up .45s 3.8s both}.row:nth-of-type(2) i{animation:tickPop .4s 4.0s both}
.row:nth-of-type(3){animation:up .45s 4.25s both}.row:nth-of-type(3) i{animation:tickPop .4s 4.45s both}
.foot{animation:fade .5s 4.8s both}
.foot span:last-child{display:inline-block;animation:ctaIn .6s 5.0s both,nudge .7s 5.8s 3 ease-in-out}
</style>
<script>
// count-up for the big statistic, driven by the frame clock
window.__stat = null;
window.setT = (t) => {
  const el = document.querySelector('.stat'); if (!el) return;
  if (!window.__stat) { const m = el.innerHTML.match(/(\\d+(?:\\.\\d+)?)/); window.__stat = { html: el.innerHTML, n: m ? parseFloat(m[1]) : null, s: m ? m[1] : '' }; }
  const s = window.__stat; if (s.n === null) return;
  const k = Math.min(1, Math.max(0, (t - 0.6) / 1.1)), e = 1 - Math.pow(1 - k, 3);
  el.innerHTML = s.html.replace(s.s, String(Math.round(s.n * e)));
};
</script>`;

async function renderOne(b, name, cfg) {
  const FR = path.join(__dirname, 'out', 'fr_' + name);
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const f = path.join(__dirname, 'out', `_a_${name}.html`);
  fs.writeFileSync(f, post(cfg).replace('</head>', motion + '</head>'));
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + f); await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready);
  for (let i = 0; i < FPS * DUR; i++) {
    const t = i / FPS;
    await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; } window.setT(t); }, t);
    await p.screenshot({ path: path.join(FR, `f${String(i).padStart(4, '0')}.png`) });
  }
  await p.close(); fs.unlinkSync(f);
  const out = path.join(OUT, `Lumina-${name}-animated.mp4`);
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${FR}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart ${out}`);
  fs.copyFileSync(path.join(FR, 'f0045.png'), path.join(OUT, `_check-${name}-1.5s.png`));
  fs.copyFileSync(path.join(FR, `f${String(FPS * DUR - 1).padStart(4, '0')}.png`), path.join(OUT, `_check-${name}-end.png`));
  fs.rmSync(FR, { recursive: true, force: true });
  console.log('done', name);
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
  const jobs = POSTS.filter(([n]) => !only.length || only.some((o) => n.startsWith(o)));
  const queue = [...jobs];
  await Promise.all([0, 1, 2].map(async () => { while (queue.length) { const [n, c] = queue.shift(); await renderOne(b, n, c); } }));
  await b.close();
})();
