# Layer extraction v2: exact text crops, card kept in place (masked overlay), row covers for reveal effects.
import json, os, sys, math
import numpy as np, cv2
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
W, H = 1122, 1402

def rect_quad(cx, cy, w, h, ang):
    a = math.radians(ang); c, s = math.cos(a), math.sin(a)
    pts = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    return [(cx + x * c - y * s, cy + x * s + y * c) for x, y in pts]

# covers: (cx, cy, w, h, ang, order)
POSTS = {
  'p01-another-training-link': dict(src='src8.png', boxcol='yellow', line_strip=34,
     logo=(55, 40, 310, 145), url=(45, 1300, 380, 1366), cta=(620, 1280, 1090, 1370), arc_from=470,
     cards=[dict(quad=rect_quad(928, 779, 294, 446, 2.9), r=30)],
     covers=[(926, 768, 236, 84, 2.9), (925, 829, 236, 36, 2.9), (922, 864, 236, 36, 2.9), (919, 900, 236, 36, 2.9), (912, 953, 232, 56, 2.9)],
     sparks=(988, 476, 1068, 554)),
  'p02-same-company': dict(src='src9.png', boxcol='navy', line_strip=8,
     logo=(55, 40, 310, 145), url=(55, 1300, 360, 1366), cta=(660, 1288, 1070, 1376), arc_from=468,
     cards=[], covers=[(891, 1020, 210, 50, 4.0), (896, 1064, 260, 50, 4.0), (890, 1103, 180, 48, 4.0), (876, 1166, 134, 62, 4.0)],
     sparks=None),
  'p03-no-time-workshop': dict(src='src10.png', boxcol='yellow', line_strip=8,
     logo=(55, 40, 310, 147), url=(55, 1305, 360, 1368), cta=(628, 1252, 1088, 1356), arc_from=478,
     cards=[dict(quad=[(613.75, 541.9), (1055.6, 501), (1080.6, 945), (627.5, 973)], r=26),
            dict(quad=[(699, 500), (912, 488), (914, 540), (702, 553)], r=12)],
     covers=[(838, 618, 424, 120, -4.4), (843, 750, 424, 120, -4.4), (848, 882, 424, 120, -4.4)],
     sparks=None),
  'p04-wellness-day': dict(src='src11.png', boxcol='navy', line_strip=8,
     logo=(55, 40, 310, 145), url=(55, 1305, 360, 1370), cta=(728, 1294, 1088, 1378), arc_from=495,
     cards=[dict(quad=[(779, 603), (1080, 603), (1080, 994), (779, 994)], r=22)],
     covers=[(912, 653, 244, 72, 0, (792, 690)), (930, 742, 260, 90, 0, (792, 742)), (931, 836, 260, 90, 0, (792, 836)), (931, 930, 260, 90, 0, (792, 930))],
     sparks=None),
  'p05-training-complete': dict(src='src12.png', boxcol='yellow', line_strip=8,
     logo=(55, 30, 310, 133), url=(55, 1285, 360, 1350), cta=(634, 1262, 1084, 1356), arc_from=468,
     cards=[dict(quad=[(682.5, 478.75), (1032.5, 528.75), (983.75, 938), (648, 891)], r=22)],
     covers=[(820, 541, 238, 72, 7.7), (808, 650, 240, 104, 7.7), (820, 726, 266, 26, 7.7), (806, 754, 244, 26, 7.7), (779, 781, 200, 26, 7.7), (790, 857, 244, 82, 7.7, (925, 895))],
     sparks=(992, 452, 1098, 588)),
}

def dom(pix):
    pix = pix.reshape(-1, 3).astype(float)
    lum = pix @ np.array([.3, .59, .11])
    hist, edges = np.histogram(lum, bins=32, range=(0, 256))
    k = np.argmax(hist); c = (edges[k] + edges[k + 1]) / 2
    return np.median(pix[np.abs(lum - c) < 22], axis=0)

def nonbg(img, bg, tol=40):
    return np.abs(img.astype(int) - np.array(bg)).max(axis=-1) >= tol

def bbox_of(mask, pad=12):
    ys, xs = np.where(mask)
    return xs.min() - pad, ys.min() - pad, xs.max() + pad + 1, ys.max() + pad + 1

def feather_alpha(h, w, f):
    ramp = lambda n: np.clip(np.arange(n) / f, 0, 1)
    return (ramp(w)[None, :] * ramp(w)[::-1][None, :]) * (ramp(h)[:, None] * ramp(h)[::-1][:, None])

def save(arr, path):
    Image.fromarray(arr.astype(np.uint8), 'RGBA').save(path)

def color_mask(img, which):
    r, g, b = [img[..., i].astype(int) for i in range(3)]
    if which == 'yellow':
        return (r > 215) & (g > 170) & (b < 120)
    return (b > 45) & (r < 50) & (g < 65) & (b - r > 25)

def fit_arc(img, bg, y_from, skip_boxes):
    pts = []
    for x in range(0, W, 3):
        if any(b[0] - 10 <= x <= b[2] + 10 for b in skip_boxes):
            continue
        col = img[y_from:1250, x]
        nb = nonbg(col, bg, 45)
        run = np.convolve(nb.astype(int), np.ones(8, int), 'valid')
        if (run >= 8).any():
            pts.append((x, y_from + int(np.argmax(run >= 8))))
    pts = np.array(pts, float)
    for _ in range(6):
        c = np.polyfit(pts[:, 0], pts[:, 1], 4)
        r = pts[:, 1] - np.polyval(c, pts[:, 0])
        pts = pts[np.abs(r) < np.median(np.abs(r)) * 3 + 2]
    return c

def quad_mask(quads):
    m = np.zeros((H, W), np.uint8)
    for q in quads:
        sub = np.zeros((H, W), np.uint8)
        cv2.fillPoly(sub, [np.array(q['quad'], np.int32)], 255)
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * q['r'] + 1, 2 * q['r'] + 1))
        sub = cv2.dilate(cv2.erode(sub, k), k)
        m |= sub
    return cv2.GaussianBlur(m, (3, 3), 0)

def run(name, cfg):
    out = os.path.join(HERE, name); os.makedirs(out, exist_ok=True)
    for f in os.listdir(out): os.remove(os.path.join(out, f))
    img = np.array(Image.open(os.path.join(HERE, cfg['src'])).convert('RGB'))
    bg = tuple(int(v) for v in np.median(img[8:30, 8:30].reshape(-1, 3), axis=0))
    L = dict(bg='#%02X%02X%02X' % bg, layers={}, covers=[])
    inpaint = np.zeros((H, W), np.uint8)

    def put(key, x0, y0, x1, y1, alpha=None, f=8):
        x0, y0 = max(0, x0), max(0, y0); x1, y1 = min(W, x1), min(H, y1)
        c = img[y0:y1, x0:x1]
        a = feather_alpha(y1 - y0, x1 - x0, f) if alpha is None else alpha[y0:y1, x0:x1] / 255.0
        save(np.dstack([c, a * 255]), os.path.join(out, f'{key}.png'))
        L['layers'][key] = dict(x=int(x0), y=int(y0), w=int(x1 - x0), h=int(y1 - y0))
        inpaint[y0:y1, x0:x1] = np.maximum(inpaint[y0:y1, x0:x1], ((a > 0.02) * 255).astype(np.uint8))

    # logo
    x0, y0, x1, y1 = cfg['logo']
    m = np.zeros((H, W), bool); m[y0:y1, x0:x1] = nonbg(img[y0:y1, x0:x1], bg)
    put('logo', *bbox_of(m, 14))
    logo_bottom = bbox_of(m, 0)[3]

    # highlight box: largest component of box colour between logo and arc
    region = np.zeros((H, W), np.uint8)
    region[logo_bottom + 20:cfg['arc_from'] - 30, 40:1100] = color_mask(img[logo_bottom + 20:cfg['arc_from'] - 30, 40:1100], cfg['boxcol'])
    n, lab, st, _ = cv2.connectedComponentsWithStats(region)
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    bx, by, bw, bh = st[k, :4]
    put('box', bx - 6, by - 6, bx + bw + 6, by + bh + 6, f=4)

    # line 1: everything non-bg between logo and box, minus box colour
    a1 = np.zeros((H, W), np.uint8)
    yA, yB = logo_bottom + 14, by + 4
    sel = nonbg(img[yA:yB, 30:1110], bg) & ~color_mask(img[yA:yB, 30:1110], cfg['boxcol'])
    m = np.zeros((H, W), bool); m[yA:yB, 30:1110] = sel
    lx0, ly0, lx1, ly1 = bbox_of(m, 12)
    al = np.zeros((H, W), np.float32)
    al[ly0:ly1, lx0:lx1] = feather_alpha(ly1 - ly0, lx1 - lx0, 8)
    al[by - 2:by + bh + 6, bx - 6:bx + bw + 6] = 0
    put('line1', lx0, ly0, lx1, ly1, alpha=al * 255)

    # subline: between box and photo
    yA = by + bh + 4
    yB = cfg['arc_from'] + 5
    m = np.zeros((H, W), bool); m[yA:yB, 30:1110] = nonbg(img[yA:yB, 30:1110], bg, 60)
    # keep the widest text row band only (ignore photo bits at the bottom)
    rows = m[yA:yB].any(axis=1); ys = np.where(rows)[0]
    gaps = np.where(np.diff(ys) > 6)[0]
    end = ys[gaps[0]] if len(gaps) else ys[-1]
    m[yA + end + 1:yB] = False
    sx0, sy0, sx1, sy1 = bbox_of(m, 10)
    put('sub', sx0, sy0, sx1, min(sy1, yA + end + 9))

    # url
    x0, y0, x1, y1 = cfg['url']
    ubg = tuple(int(v) for v in np.median(img[y0:y0 + 6, x0:x0 + 6].reshape(-1, 3), axis=0))
    m = np.zeros((H, W), bool); m[y0:y1, x0:x1] = nonbg(img[y0:y1, x0:x1], ubg)
    put('url', *bbox_of(m, 10))

    # CTA pill shape
    x0, y0, x1, y1 = cfg['cta']
    sub = img[y0:y1, x0:x1]
    which = 'yellow' if color_mask(sub, 'yellow').mean() > color_mask(sub, 'navy').mean() else 'navy'
    pm = cv2.morphologyEx(color_mask(sub, which).astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(pm)
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    px, py, pw, ph = st[k, :4]; px += x0; py += y0
    pill = np.zeros((H, W), np.uint8); rr = ph // 2
    cv2.rectangle(pill, (px + rr, py), (px + pw - rr, py + ph), 255, -1)
    cv2.circle(pill, (px + rr, py + rr), rr, 255, -1); cv2.circle(pill, (px + pw - rr, py + rr), rr, 255, -1)
    pill = cv2.GaussianBlur(pill, (3, 3), 0)
    put('cta', px - 3, py - 3, px + pw + 3, py + ph + 3, alpha=pill)
    L['layers']['cta'].update(pill=dict(x=3, y=3, w=int(pw), h=int(ph)))

    if cfg['sparks']:
        put('sparks', *cfg['sparks'], f=6)

    # card overlays (kept in place) + covers
    if cfg['cards']:
        cm = quad_mask(cfg['cards'])
        ys, xs = np.where(cm > 0)
        cx0, cy0, cx1, cy1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        save(np.dstack([img[cy0:cy1, cx0:cx1], cm[cy0:cy1, cx0:cx1]]), os.path.join(out, 'card.png'))
        L['layers']['card'] = dict(x=int(cx0), y=int(cy0), w=int(cx1 - cx0), h=int(cy1 - cy0))
    for i, cov in enumerate(cfg['covers']):
        cx, cy, w, h, ang = cov[:5]
        q = np.array(rect_quad(cx, cy, w, h, ang), np.int32)
        mm = np.zeros((H, W), np.uint8); cv2.fillPoly(mm, [q], 255)
        ring = (cv2.dilate(mm, np.ones((13, 13), np.uint8)) > 0) & ~(cv2.dilate(mm, np.ones((5, 5), np.uint8)) > 0)
        yy_ = np.arange(H)[:, None].repeat(W, 1)
        up, lo = ring & (yy_ < cy), ring & (yy_ >= cy)
        ct = dom(img[up]) if up.sum() > 20 else dom(img[ring])
        cb = dom(img[lo]) if lo.sum() > 20 else ct
        if len(cov) > 5:
            sx, sy = cov[5]; ct = cb = np.median(img[sy - 3:sy + 4, sx - 3:sx + 4].reshape(-1, 3), axis=0)
        hexc = lambda c: '#%02X%02X%02X' % tuple(int(v) for v in c)
        col = None
        L['covers'].append(dict(cx=cx, cy=cy, w=w, h=h, ang=ang, color=f'linear-gradient({hexc(ct)},{hexc(cb)})'))

    # clean plate (text, cta, sparks removed) for the photo layer
    inpaint = cv2.dilate(inpaint, np.ones((5, 5), np.uint8))
    plate = cv2.inpaint(cv2.cvtColor(img, cv2.COLOR_RGB2BGR), inpaint, 7, cv2.INPAINT_TELEA)
    plate = cv2.cvtColor(plate, cv2.COLOR_BGR2RGB)
    # header text band: vertical blend between clean rows above and below the text block
    yt = L['layers']['line1']['y'] - 3
    yb = L['layers']['sub']['y'] + L['layers']['sub']['h'] + 1
    rt = cv2.GaussianBlur(img[yt - 3:yt].mean(axis=0, keepdims=True).astype(np.float32), (0, 0), sigmaX=8)[0]
    rbr = img[yb:yb + 3].mean(axis=0).astype(np.float32)
    okb = (np.abs(rbr - np.array(bg)).max(axis=-1) < 30).astype(np.float32)
    okb = cv2.GaussianBlur(okb[None, :], (0, 0), sigmaX=8)[0]
    rb = cv2.GaussianBlur(rbr[None], (0, 0), sigmaX=8)[0]
    rb = rb * okb[:, None] + rt * (1 - okb[:, None])
    tt = np.linspace(0, 1, yb - yt)[:, None, None]
    plate[yt:yb] = (rt[None] * (1 - tt) + rb[None] * tt).clip(0, 255).astype(np.uint8)
    skip = [(min(p[0] for p in q['quad']), 0, max(p[0] for p in q['quad']), 0) for q in cfg['cards']]
    if cfg['sparks']: skip.append(cfg['sparks'])
    c = fit_arc(img, bg, cfg['arc_from'], skip)
    top = np.polyval(c, np.arange(W))[None, :] - cfg['line_strip']
    am = (np.clip((np.arange(H)[:, None] - top) / 2.0, 0, 1) * 255).astype(np.uint8)
    # protect text area above the arc from the strip
    save(np.dstack([plate, am]), os.path.join(out, 'photo.png'))
    bgp = plate.copy()
    if cfg['cards']:
        cmk = cv2.dilate(quad_mask(cfg['cards']), np.ones((41, 41), np.uint8))
        bgp = cv2.cvtColor(cv2.inpaint(cv2.cvtColor(bgp, cv2.COLOR_RGB2BGR), cmk, 9, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB)
    plate_bg_src = bgp.copy()
    ys_ = L['layers']['sub']['y'] + L['layers']['sub']['h'] + 2
    fill = cv2.GaussianBlur(bgp[ys_ - 6:ys_ - 1].mean(axis=0, keepdims=True).astype(np.float32), (0, 0), sigmaX=6)
    bgp[ys_:] = np.repeat(fill, H - ys_, axis=0).astype(np.uint8)
    Image.fromarray(bgp).save(os.path.join(out, 'plate_bg.png'))
    L['arc_mid'] = float(np.polyval(c, W / 2)); L['arc_min'] = float(np.min(np.polyval(c, np.arange(W))))
    json.dump(L, open(os.path.join(out, 'layout.json'), 'w'), indent=1, default=float)
    # debug overlay
    dbg = img.copy()
    for k, v in L['layers'].items():
        cv2.rectangle(dbg, (v['x'], v['y']), (v['x'] + v['w'], v['y'] + v['h']), (255, 0, 255), 2)
    for cv_ in L['covers']:
        cv2.polylines(dbg, [np.array(rect_quad(cv_['cx'], cv_['cy'], cv_['w'], cv_['h'], cv_['ang']), np.int32)], True, (0, 255, 0), 2)
    cv2.polylines(dbg, [np.stack([np.arange(W), np.polyval(c, np.arange(W))], 1).astype(np.int32)], False, (255, 0, 0), 2)
    Image.fromarray(dbg).save(os.path.join(out, '_debug.png'))
    print(name, 'ok')

for n, c in POSTS.items():
    if len(sys.argv) < 2 or any(n.startswith(a) for a in sys.argv[1:]):
        run(n, c)
