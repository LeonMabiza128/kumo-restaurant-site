// Series 3: problem-led posts. Each creative = the problem (hook or fact) + cartoon + "How Lumina helps" panel.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const A = (f) => 'file://' + path.join(__dirname, 'assets', f);
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:Poppins,Arial,sans-serif}
body.y{background:#FFC61A;color:#0B1747}
body.n{background:#0B1747;color:#fff}
body.n:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 90% 5%,rgba(59,130,246,.45),transparent 40%),radial-gradient(circle at 0% 55%,rgba(167,139,250,.25),transparent 40%)}
.top{position:absolute;left:64px;right:64px;top:56px;display:flex;justify-content:space-between;align-items:center;z-index:3}
.top img{height:48px}
.tag{font-size:21px;font-weight:700;padding:9px 20px;border-radius:40px;letter-spacing:.3px}
.y .tag{background:#0B1747;color:#fff}.n .tag{background:#FFC61A;color:#0B1747}
.hook{position:absolute;left:64px;right:64px;top:150px;z-index:2}
.kicker{font-size:21px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.y .kicker{color:#1C2F78}.n .kicker{color:#14C8EE}
h1{font-size:60px;line-height:1.1;font-weight:800;letter-spacing:-1.2px}
.n h1 em{font-style:normal;color:#FFC61A}
.y h1{line-height:1.24}.y h1 em{font-style:normal;background:#0B1747;color:#FFC61A;padding:0 12px 4px;border-radius:12px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.stat{font-size:150px;font-weight:800;line-height:.95;letter-spacing:-5px}
.y .stat{color:#0B1747}.n .stat{color:#FFC61A}
.statline{font-size:34px;font-weight:700;line-height:1.25;margin-top:10px}
.src{font-size:16px;margin-top:10px;opacity:.75}
.ill{position:absolute;left:50%;transform:translateX(-50%);z-index:1}
.panel{position:absolute;left:48px;right:48px;bottom:96px;border-radius:30px;padding:30px 36px 26px;z-index:2}
.y .panel{background:#0B1747;color:#fff}
.n .panel{background:#fff;color:#0B1747}
.panel h2{font-size:25px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;display:flex;align-items:center;gap:12px;margin-bottom:14px}
.panel h2 img{height:30px}
.y .panel h2{color:#FFC61A}.n .panel h2{color:#1C2F78}
.row{display:flex;gap:16px;align-items:flex-start;font-size:26px;line-height:1.35;font-weight:600;padding:9px 0}
.row i{flex:0 0 34px;height:34px;border-radius:50%;background:#22C55E;position:relative;margin-top:2px}
.row i:after{content:'';position:absolute;left:12px;top:6px;width:8px;height:15px;border:solid #fff;border-width:0 4px 4px 0;transform:rotate(45deg)}
.foot{position:absolute;left:64px;right:64px;bottom:36px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;z-index:3}
.y .foot{color:#0B1747}.n .foot{color:#fff}
.foot span:last-child{font-weight:700}
`;
const post = ({ theme, tag, kicker, h1, stat, statline, src, img, iw, it, helps }) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>
<body class="${theme}">
<img class="ill" src="${A(img)}" style="width:${iw}px;top:${it}px">
<div class="top"><img src="${A(theme === 'y' ? 'logo-navy.png' : 'logo-white.png')}"><span class="tag">${tag}</span></div>
<div class="hook">${kicker ? `<div class="kicker">${kicker}</div>` : ''}${stat ? `<div class="stat">${stat}</div><div class="statline">${statline}</div>` : `<h1>${h1}</h1>`}${src ? `<div class="src">Source: ${src}</div>` : ''}</div>
<div class="panel"><h2>How Lumina helps</h2>${helps.map((h) => `<div class="row"><i></i><span>${h}</span></div>`).join('')}</div>
<div class="foot"><span>lumina-advance.co.za</span><span>Book a free intro call &rarr;</span></div>
</body></html>`;

const POSTS = [
  ['01-mental-wellness-fact', { theme: 'n', tag: 'Did you know?', kicker: 'Mental wellness at work', stat: '12 billion', statline: 'working days are lost every year to depression and anxiety.', src: 'World Health Organization (2022)', img: 'il_burnout.png', iw: 620, it: 470,
    helps: ['Private 30-second wellbeing check-ins every week', 'Short reset routines staff can do at their desk', 'A manager dashboard that flags problems early'] }],
  ['02-slow-team', { theme: 'y', tag: 'Workplace problem', kicker: 'Is your team slowing down?', h1: 'Your team is not lazy. <em>They are disengaged.</em>', img: 'il_monday.png', iw: 720, it: 440,
    helps: ['Clear weekly goals that give people a reason to push', 'Team challenges with points and a live leaderboard', 'KPIs we review with you every single week'] }],
  ['03-nobody-finishes-training', { theme: 'n', tag: 'Training problem', kicker: 'Sound familiar?', h1: 'You paid for training. <em>Nobody finished it.</em>', img: 'il_phone.png', iw: 640, it: 440,
    helps: ['Five-minute lessons instead of full-day workshops', 'Works on any phone, at any time', 'Every lesson ends with a quiz that earns points'] }],
  ['04-retail-training', { theme: 'y', tag: 'For retail teams', kicker: 'Retail managers ask us', h1: 'How do you train staff who <em>never sit at a desk?</em>', img: 'il_store.png', iw: 700, it: 470,
    helps: ['Lessons on staff phones in five minutes a day', 'Store-vs-store competitions with real prizes', 'One report showing progress in every branch'] }],
  ['05-gamified-training', { theme: 'n', tag: 'How it works', kicker: 'Gamified training, explained', h1: 'Learn it. Play it. <em>Win something for it.</em>', img: 'il_gameloop.png', iw: 660, it: 380,
    helps: ['Learn: a short lesson on the week\'s topic', 'Play: quizzes and puzzles based on that lesson', 'Win: points, leaderboards and weekly prizes'] }],
  ['06-team-building', { theme: 'y', tag: 'Team building', kicker: 'The team building problem', h1: 'Fun on Friday. <em>Forgotten by Monday.</em>', img: 'il_tug.png', iw: 780, it: 440,
    helps: ['Twelve weeks of team challenges, not one day', 'Live events: a kickoff, sessions and an awards day', 'Teams that keep working together long after'] }],
  ['07-replacement-cost', { theme: 'n', tag: 'Did you know?', kicker: 'The real cost of resignations', stat: 'Up to 2&times;', statline: 'a person\'s annual salary is what it can cost to replace them.', src: 'Gallup (2019)', img: 'il_exit.png', iw: 700, it: 520,
    helps: ['Growth paths that show people a future with you', 'Recognition and rewards for the people who stay', 'Skills that make staff feel invested in'] }],
  ['08-new-hires-leaving', { theme: 'y', tag: 'Onboarding', kicker: 'New staff leaving early?', h1: 'The first 90 days decide <em>if new staff stay.</em>', img: 'il_onboard.png', iw: 680, it: 440,
    helps: ['A week-by-week induction on their phone', 'Quizzes and games that make rules stick', 'A welcome buddy and team activities from day one'] }],
  ['09-ai-skills-gap', { theme: 'n', tag: 'Did you know?', kicker: 'AI and the skills gap', stat: '39%', statline: 'of workers\' core skills are expected to change by 2030.', src: 'World Economic Forum, Future of Jobs Report (2025)', img: 'il_ai.png', iw: 600, it: 500,
    helps: ['Short AI courses from certified specialists', 'Practice through games, not long lectures', 'Built for everyday staff, not only tech teams'] }],
  ['10-recognition-gap', { theme: 'y', tag: 'Did you know?', kicker: 'Recognition and retention', stat: '45%', statline: 'less turnover after two years for people who get great recognition.', src: 'Gallup and Workhuman (2023)', img: 'il_recog.png', iw: 600, it: 520,
    helps: ['Weekly winners and shout-outs your team can see', 'Certificates and rewards like vouchers and gadgets', 'An awards day to celebrate your top performers'] }],
];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
  for (const [name, cfg] of POSTS) {
    const f = path.join(__dirname, 'out', '_p3.html');
    fs.writeFileSync(f, post(cfg));
    const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
    await p.goto('file://' + f);
    await p.waitForLoadState('networkidle');
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => ({ hook: Math.round(document.querySelector('.hook').getBoundingClientRect().bottom), panel: Math.round(document.querySelector('.panel').getBoundingClientRect().top) }));
    console.log(name, 'hook ends', m.hook, 'panel starts', m.panel, 'space for art', m.panel - m.hook);
    await p.screenshot({ path: path.join(OUT, `Lumina-${name}.png`) });
    await p.close();
  }
  fs.unlinkSync(path.join(__dirname, 'out', '_p3.html'));
  await b.close();
})();
