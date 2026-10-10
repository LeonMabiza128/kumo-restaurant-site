// Animated version of the "Another training link" post. Layers: real text, the photo (clipped to its arc), animated challenge card.
// Frames are captured by seeking every CSS animation, then encoded with ffmpeg.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const G = path.join(__dirname, 'gtm');
const arc = JSON.parse(fs.readFileSync(path.join(G, 'arc.json')));
const SRC = 'file://' + path.join(G, 'src7.png');
const LOGO = 'file://' + path.join(__dirname, 'assets', 'logo-white.png');
const FPS = 30, DUR = 9;

// clip polygon, inset slightly inside the detected photo edge
const poly = [...arc.top.map(([x, y]) => `${x}px ${y + 10}px`), ...arc.bot.slice().reverse().map(([x, y]) => `${x}px ${y - 8}px`)].join(',');
const linePts = arc.top.filter(([x]) => x <= 700).map(([x, y]) => `${x},${y - 6}`).join(' ');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:#041C58}
#s{position:absolute;left:0;top:0;width:1122px;height:1402px;transform:scale(${1080 / 1122});transform-origin:0 0;font-family:Poppins,Arial,sans-serif;color:#fff;overflow:hidden;
 background:radial-gradient(circle at 85% 10%,rgba(59,130,246,.28),transparent 45%),#041C58}
.a{animation-fill-mode:both;animation-timing-function:cubic-bezier(.2,.8,.2,1);animation-play-state:paused}
@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes photoIn{from{opacity:0;transform:translateY(80px)}to{opacity:1;transform:none}}
@keyframes zoom{from{transform:scale(1.06)}to{transform:scale(1.0)}}
@keyframes drift{from{transform:scale(1.0)}to{transform:scale(1.045)}}
@keyframes draw{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}
@keyframes pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes tick{0%{background:#fff;border-color:#C9CEDA}100%{background:#FFC61A;border-color:#FFC61A}}
@keyframes check{from{opacity:0;transform:rotate(45deg) scale(.2)}to{opacity:1;transform:rotate(45deg) scale(1)}}
@keyframes bar{from{transform:scaleX(.15)}to{transform:scaleX(1)}}
@keyframes pts{0%{opacity:0;transform:translateY(10px)}25%{opacity:1;transform:translateY(-10px)}80%{opacity:1;transform:translateY(-34px)}100%{opacity:0;transform:translateY(-44px)}}
@keyframes wiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-12deg) scale(1.08)}40%{transform:rotate(10deg) scale(1.12)}60%{transform:rotate(-6deg) scale(1.08)}80%{transform:rotate(3deg)}}
@keyframes spark{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}
@keyframes ctaIn{from{opacity:0;transform:translateX(120px)}to{opacity:1;transform:none}}
@keyframes nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(10px)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,198,26,.6)}100%{box-shadow:0 0 0 26px rgba(255,198,26,0)}}
.logo{position:absolute;left:74px;top:52px;height:82px}
.h1{position:absolute;left:74px;top:168px;font-size:92px;font-weight:800;letter-spacing:-3px;line-height:1;white-space:nowrap}
.box{position:absolute;left:70px;top:272px;height:114px;padding:0 18px 0 14px;background:#FEDC16;border-radius:16px;display:flex;align-items:center}
.box span{font-size:96px;font-weight:800;letter-spacing:-3px;color:#041C58;white-space:nowrap;line-height:1}
.sub{position:absolute;left:78px;top:404px;font-size:40px;font-weight:500;white-space:nowrap}
.photoWrap{position:absolute;inset:0;clip-path:polygon(${poly})}
.photo{position:absolute;inset:0;background:url(${SRC}) 0 0/1122px 1402px no-repeat;transform-origin:924px 782px}
.card{position:absolute;left:759px;top:537px;width:330px;height:488px;background:#fff;border-radius:30px;transform:rotate(4deg);box-shadow:0 30px 60px rgba(0,0,0,.35);color:#041C58;padding:32px 34px}
.trophy{width:150px;height:150px;border-radius:50%;background:#FEDC16;margin:0 auto;display:flex;align-items:center;justify-content:center}
.ct{font-size:31px;font-weight:800;line-height:1.12;margin-top:16px;letter-spacing:-.5px}
.r{display:flex;align-items:center;gap:14px;margin-top:14px;position:relative}
.c{flex:0 0 34px;height:34px;border-radius:50%;border:4px solid #C9CEDA;position:relative}
.c:after{content:'';position:absolute;left:9px;top:3px;width:8px;height:15px;border:solid #041C58;border-width:0 4px 4px 0;opacity:0}
.b{height:16px;border-radius:8px;background:#D7DBE5;flex:1;transform-origin:0 50%}
.p{position:absolute;right:-8px;top:-6px;font-size:22px;font-weight:800;color:#22A04B;opacity:0}
.tag{margin-top:20px;background:#ECEEF4;border-radius:30px;font-size:19px;font-weight:600;text-align:center;padding:9px 0;color:#2a335a}
.url{position:absolute;left:62px;top:1314px;font-size:28px;font-weight:600}
.cta{position:absolute;left:636px;top:1294px;width:436px;height:64px;border-radius:40px;background:#FEDC16;color:#041C58;font-size:27px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:16px}
</style></head><body><div id="s">
<img class="logo a" src="${LOGO}" style="animation:fade .6s .1s both paused">
<div class="h1 a" style="animation:fadeUp .7s .35s both paused">Another training link.</div>
<div class="box a" style="animation:wipe .6s 1.05s both paused"><span class="a" style="animation:fade .4s 1.45s both paused">Another &ldquo;later&rdquo;.</span></div>
<div class="sub a" style="animation:fadeUp .6s 1.9s both paused">Turn learning into a team challenge.</div>
<div class="a" style="position:absolute;inset:0;animation:photoIn .9s 2.2s both paused">
<div class="photoWrap">
  <div class="a" style="position:absolute;inset:0;animation:zoom 1.6s 2.2s both paused;transform-origin:924px 782px">
    <div class="photo a" style="animation:drift 6s 3.8s both paused;animation-timing-function:linear"></div>
  </div>
</div>
<svg style="position:absolute;left:0;top:0" width="1122" height="1402"><polyline class="a" points="${linePts}" fill="none" stroke="#FEDC16" stroke-width="20" stroke-linecap="round" stroke-dasharray="1400" style="animation:draw 1s 2.7s both paused"/></svg>
<div class="card">
  <div class="trophy a" style="animation:pop .6s 3.2s both paused">
    <svg class="a" width="96" height="96" viewBox="-50 -50 100 100" style="animation:wiggle .9s 6.4s both paused">
      <path d="M-22 -30 h44 v14 q0 28 -22 32 q-22 -4 -22 -32z" fill="none" stroke="#041C58" stroke-width="7" stroke-linejoin="round"/>
      <path d="M-22 -24 h-12 q0 18 16 18 M22 -24 h12 q0 18 -16 18" fill="none" stroke="#041C58" stroke-width="6"/>
      <rect x="-5" y="16" width="10" height="12" fill="#041C58"/><rect x="-18" y="28" width="36" height="9" rx="3" fill="#041C58"/>
      <path d="M-3 -18 l3 -7 l3 7 l7 0 l-6 5 l2 7 l-6 -4 l-6 4 l2 -7 l-6 -5z" fill="#fff"/>
    </svg>
  </div>
  <div class="ct a" style="animation:fadeUp .5s 3.5s both paused">LEARN &bull; QUIZ &bull;<br>EARN POINTS</div>
  ${[0, 1, 2].map((i) => `<div class="r a" style="animation:fade .3s ${3.8 + i * 0.15}s both paused">
     <div class="c a" style="animation:tick .25s ${4.4 + i * 0.7}s both paused"><i class="a" style="position:absolute;left:9px;top:3px;width:8px;height:15px;border:solid #041C58;border-width:0 4px 4px 0;animation:check .3s ${4.45 + i * 0.7}s both paused"></i></div>
     <div class="b a" style="animation:bar .5s ${3.85 + i * 0.15}s both paused;${i === 2 ? 'margin-right:30px' : i === 1 ? 'margin-right:16px' : ''}"></div>
     <div class="p a" style="animation:pts 1.2s ${4.45 + i * 0.7}s both paused">+10</div></div>`).join('')}
  <div class="tag a" style="animation:fade .4s 4.0s both paused">Illustrative challenge</div>
</div>
</div>
${[[1005, 492, 30], [1040, 528, 62]].map(([x, y, r]) => `<div class="a" style="position:absolute;left:${x}px;top:${y}px;width:12px;height:44px;border-radius:6px;background:#FEDC16;transform-origin:center;rotate:${r}deg;opacity:0;animation:fade .3s 3.4s both paused, spark 1.2s 6.4s 2 forwards paused"></div>`).join('')}
<div class="url a" style="animation:fade .6s 6.6s both paused">lumina-advance.co.za</div>
<div class="cta a" style="animation:ctaIn .7s 6.8s both paused, pulse 1.2s 7.6s 1 both paused">Let&rsquo;s plan your programme
  <svg class="a" width="40" height="24" viewBox="0 0 40 24" style="animation:nudge .8s 7.5s 2 both paused"><path d="M2 12 H34 M24 3 L35 12 L24 21" stroke="#041C58" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
</div></body></html>`;

(async () => {
  const FR = path.join(G, 'frames');
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const f = path.join(G, '_anim.html'); fs.writeFileSync(f, html);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + f); await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready);
  const n = FPS * DUR;
  for (let i = 0; i < n; i++) {
    const t = (i / FPS) * 1000;
    await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, t);
    await p.screenshot({ path: path.join(FR, `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  const out = path.join(G, 'Lumina-another-training-link-animated.mp4');
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${FR}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart ${out}`);
  console.log('ok', out, n, 'frames');
})();
