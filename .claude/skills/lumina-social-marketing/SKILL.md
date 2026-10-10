---
name: lumina-social-marketing
description: Lumina Experiences digital marketing playbook. Use for any Lumina social media post, content plan, content calendar, campaign, caption, ad, email or marketing strategy. Every post names a real workplace or retail problem, then shows how Lumina solves it.
---

# Lumina digital marketing and social content

Lumina Experiences for Workplaces (lumina-advance.co.za, tagline "Brighter workplaces") sells customisable staff programmes in South Africa. A programme combines short courses, gamified training, team competitions, rewards, recognition, wellbeing and live events, with KPIs reviewed with the client every week.

## The core rule: problem first, then Lumina

Social media is not a "nice to have". Every post is a chance to show a potential client a problem they already have and to show them what Lumina does about it. A post that only says something nice about engagement is a wasted post.

Every post must do three things:
1. **Name a specific problem** the buyer recognises: an HR manager, MD, CEO, operations or training manager, or a retail regional manager.
2. **Make it land.** Use one angle: a "did you know" fact, an emotional moment, or a practical "how do you…" question.
3. **Tie it back to Lumina.** Name the actual features that solve that problem. Never use a generic "we can help".

## Problem to Lumina feature map

| Problem the client has | Lumina features to name |
|---|---|
| Mental wellness, stress, burnout | Private 30-second weekly wellbeing check-ins, short reset routines, a manager dashboard that flags problems early, wellbeing talks |
| Slowness, low productivity, disengagement | Clear weekly goals, team challenges with points and a live leaderboard, weekly KPI reviews |
| Lack of interest in training, low completion | Five-minute phone lessons, a quiz at the end of every lesson, points, weekly completion reports |
| How to train shift or retail staff | Lessons on staff phones, store-vs-store competitions, one report for every branch |
| What gamified training is | Learn (short lesson), Play (quizzes and puzzles), Win (points, leaderboard, weekly prizes) |
| Team building that does not last | 12 weeks of team challenges, a kickoff event, live sessions, an awards day |
| Resignations, quiet quitting, staff leaving to start businesses | Growth paths, recognition, rewards, skills that make staff feel invested in |
| New hires leaving early | A week-by-week phone induction, quizzes and games that make rules stick, a welcome buddy |
| AI anxiety and the skills gap | Short AI and new-skills courses from certified specialists, practice through games |
| Lack of recognition | Weekly winners and shout-outs, certificates, vouchers and gadgets, an awards day |
| Inconsistent service across branches | Product and service lessons, branch leaderboards, mystery-shopper KPIs |
| "Our needs are different" | Use the ready-made 12-week programme or a custom one built from the client's issues and budget. The client can add their own courses. Fully online or blended. White-label branding and domain. Monthly, quarterly or annual plans |

## Content mix (per 10 posts)

- 3 to 4 **"Did you know?"** posts with a verified statistic and its source.
- 3 to 4 **problem posts** that name a familiar pain ("You paid for training. Nobody finished it.").
- 1 to 2 **"how it works"** posts that explain a feature, such as gamified training or the 12-week journey.
- 1 **retail** post for every 4 to 5 posts, since retail chains are a target sector.
- Engagement extras such as polls or "tag someone" can go in occasionally, but they must still connect to a problem.
- Sectors: Corporate (Chesney), Banking and Retail (Siya), ICT (Trevor).

## Caption formula

1. **Hook:** the problem or the fact, in one line.
2. **Why it hurts:** two or three plain sentences about what the client sees day to day.
3. **How Lumina solves it:** name two or three specific features.
4. **CTA:** "Want to see how this would work for your team? Send us a message or book a free intro call at lumina-advance.co.za."
5. **Source line**, for any statistic.
6. 3 to 5 hashtags, for example #EmployeeEngagement #StaffRetention #HR #Wellbeing #Retail #FutureOfWork #SouthAfrica.

## Writing rules (from the client)

- Plain, normal English in full sentences. No poetic or flowery language.
- **No em dashes.**
- Easy enough for a college student to understand.
- Never invent statistics. Only use facts with a named source, and check them before use. Facts already checked:
  - WHO (2022): 12 billion working days are lost every year to depression and anxiety.
  - Gallup (2019): replacing an employee costs one-half to two times their annual salary.
  - WEF Future of Jobs (2025): 39% of workers' core skills are expected to change by 2030.
  - Gallup and Workhuman (2023): people who receive great recognition are 45% less likely to have left after two years.
  - Gallup State of the Global Workplace (2024): 23% of employees worldwide are engaged.
- Client-facing material contains no internal instructions.
- Never present AI or stock imagery of "Lumina events" as real client results.

## Creative rules

- Size 1080×1350 (4:5) for LinkedIn, Facebook and Instagram. Alternate yellow and navy themes.
- Layout, top to bottom:
  - the logo and a tag pill, such as "Did you know?", "Workplace problem", "For retail teams" or "How it works"
  - a small uppercase kicker
  - the hook headline, or a big statistic with one line and its source
  - a cartoon that shows the problem
  - a **"How Lumina helps"** panel with three green-tick rows
  - a footer with lumina-advance.co.za and "Book a free intro call →"
- The solution must be visible on the image itself, not only in the caption.
- Palette:

  | Colour | Hex |
  |---|---|
  | navy | #0B1747 |
  | card | #14245F |
  | card2 | #1C2F78 |
  | yellow | #FFC61A |
  | orange | #FF7A1A |
  | cyan | #14C8EE |
  | blue | #3B82F6 |
  | violet | #A78BFA |
  | green | #22C55E |
  | soft text | #C3CEF0 |

- Font: Poppins, with weight 800 for headlines.
- On the yellow theme, highlight words with a navy marker box. On the navy theme, highlight words in yellow.
- Imagery: flat cartoon people with faces, in diverse skin tones, drawn as SVG and rendered to PNG. The client likes humans, illustrations and cartoons.
- Covers: the yellow "Invest in your people. Help your people thrive." design. Keep text clear of each platform's profile photo:
  - Facebook: a centred profile circle at the bottom.
  - LinkedIn company page: a logo square on the left third.
  - X: an avatar in the bottom-left.
  - YouTube: keep text inside the 1546×423 safe area.

## Tools in this repo

These live in `lumina-gtm/tools/` and use Node, sharp and playwright-core. Launch Chromium with `executablePath: '/opt/pw-browsers/chromium'` and the HTTPS proxy, so the Poppins web font loads.

- `illus_lib.js`: palette `P`, skin tones `SKIN`, `person(x, y, scale, shirt, skin, pose)` with the poses stand, cheer, walk, sit, slump and wave, plus `bubble()`, `GLYPH` and `render()`.
- `illus4.js`: cartoon scenes with faces (`face()` helper): monday, burnout, tug of war, onboarding, recognition, AI robot and wellbeing check-in.
- `illus5.js`: the gamified learning loop.
- `gen_posts3.js`: the problem-led post template. Edit the `POSTS` array, with fields `theme`, `tag`, `kicker`, `h1` or `stat` + `statline` + `src`, `img`, `iw`, `it` and `helps`, then run `node gen_posts3.js`. Check its log, which reports the space between the hook and the panel, so the art fits.
- `assets/`: logos and all the illustrations.

Earlier deliverables live in `lumina-gtm/`: the email template, social posts, covers, YouTube watermark, flyer and lead tracker.

## Scheduling (Metricool)

- Post Monday, Wednesday and Friday at 08:30 SAST.
- Deliver for each series:
  - the PNGs
  - `CAPTIONS.md`
  - a CSV with the columns Post, Date, Time, Networks, Angle, Problem, Caption, Image file and Image URL
- For image URLs, commit the images to the repo branch and use raw.githubusercontent links pinned to the commit SHA.
- Metricool's bulk upload uses its own downloadable CSV template, so tell the user to copy the fields across into it.

## Strategy notes

- **Funnel:** social posts lead to profile visits and DMs, then the website, then a booked 30-minute intro call, then a proposal or brief, then a pilot.
- Track results in the lead tracker spreadsheet, where the stages run from Contacted through to Pilot or Won.
- After a pilot, swap illustrations for real photos and real results. Real proof beats claims.
- Reuse each problem across channels: a LinkedIn post, a cold email hook (see the Go-To-Market doc sequences), a WhatsApp follow-up and a talking point in meetings.
