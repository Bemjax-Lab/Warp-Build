# Warp CSS Scaffolding

All helper classes are compiled into `Warp.css` from `src/Gui/Helpers.css`. They are available inside every window body and anywhere within the shadow root.

Spacing values come from the active skin's CSS custom properties:

| Token | Default |
|---|---|
| `--xs` | 25 px |
| `--sm` | 35 px |
| `--md` | 50 px |
| `--lg` | 70 px |
| `--xl` | 100 px |

---

## Grid rows `.r2` – `.r10`

Turn any block into an N-column equal grid. Children stretch to fill their cell.

```
.r2  → repeat(2,  1fr)
.r3  → repeat(3,  1fr)
…
.r10 → repeat(10, 1fr)
```

```html
<!-- two columns -->
<div class="r2">
    <div class="s1 p5">Left</div>
    <div class="s2 p5">Right</div>
</div>

<!-- four columns -->
<div class="r4">
    <button class="s1 p5">A</button>
    <button class="s2 p5">B</button>
    <button class="s3 p5">C</button>
    <button class="s4 p5">D</button>
</div>

<!-- nested: r2 inside the middle column of r3 -->
<div class="r3">
    <div class="s0 p5">Info</div>
    <div class="r2">
        <div class="s3 p5">Sub A</div>
        <div class="s4 p5">Sub B</div>
    </div>
    <button class="s5 p5">Delete</button>
</div>
```

Grids compose freely — nest any `.rN` inside a grid cell for sub-layouts. Use `.cN` to span multiple columns within the same grid (see below).

---

## Column spans `.c2` – `.c10`

Make a child occupy N columns in the parent `.rN` grid.

```
.c2  → grid-column: span 2
.c3  → grid-column: span 3
…
.c10 → grid-column: span 10
```

```html
<!-- c2 takes two of six columns -->
<div class="r6">
    <div class="c2 s1 p5">wide (2 cols)</div>
    <div class="s2 p5">1</div>
    <div class="s3 p5">1</div>
    <div class="s4 p5">1</div>
</div>

<!-- three equal c2 children fill a 6-column grid exactly -->
<div class="r6">
    <div class="c2 s1 p5">A</div>
    <div class="c2 s2 p5">B</div>
    <div class="c2 s3 p5">C</div>
</div>

<!-- full-width header row in a 4-column layout -->
<div class="r4">
    <div class="c4 s0 p5">Full-width header</div>
    <div class="s1 p5">col 1</div>
    <div class="s2 p5">col 2</div>
    <div class="s3 p5">col 3</div>
    <div class="s4 p5">col 4</div>
</div>
```

If spans exceed the column count, the browser wraps the child to the next row. For complex sub-layouts, nested grids are still the cleaner choice.

---

## Semantic colours `.s0` – `.s6`

Sets `background-color`, `color`, and SVG `fill` in one class. Values come from the active skin.

| Class | Alias | Background var | Text var |
|---|---|---|---|
| `.s0` | `.default` | `--defaultBg` | `--defaultColor` |
| `.s1` | `.primary` | `--primaryBg` | `--primaryColor` |
| `.s2` | `.secondary` | `--secondaryBg` | `--secondaryColor` |
| `.s3` | `.success` | `--successBg` | `--successColor` |
| `.s4` | `.warning` | `--warningBg` | `--warningColor` |
| `.s5` | `.danger` | `--dangerBg` | `--dangerColor` |
| `.s6` | `.link` | `--linkBg` | `--linkColor` |

```html
<!-- all six on buttons -->
<div class="r6">
    <button class="s0 p5">Default</button>
    <button class="s1 p5">Primary</button>
    <button class="s2 p5">Secondary</button>
    <button class="s3 p5">Success</button>
    <button class="s4 p5">Warning</button>
    <button class="s5 p5">Danger</button>
</div>

<!-- coloured panel -->
<div class="s3 p10">Operation completed successfully.</div>
```

---

## Text colours `.t0` – `.t6`

Changes only the text and SVG fill colour — background is untouched. Uses the *background* variable of the matching semantic slot as the text colour (so `.t1` makes text the same orange/blue as `.s1`'s background).

| Class | Alias |
|---|---|
| `.t0` | `.text-default` |
| `.t1` | `.text-primary` |
| `.t2` | `.text-secondary` |
| `.t3` | `.text-success` |
| `.t4` | `.text-warning` |
| `.t5` | `.text-danger` |
| `.t6` | `.text-link` |

```html
<span class="t5">Error: something went wrong.</span>
<span class="t3">All systems nominal.</span>

<!-- coloured icon (SVG fill follows text colour) -->
<span class="t1">
    <svg>…</svg>
</span>
```

---

## Fixed padding `.p*`

```
.p0   → padding: 0
.p5   → padding: 5px
.p10  → padding: 10px
.p15  → padding: 15px
.p20  → padding: 20px
```

Directional variants — `t` top, `b` bottom, `l` left, `r` right:

```
.pt0  .pt5  .pt10  .pt15  .pt20
.pb0  .pb5  .pb10  .pb15  .pb20
.pl0  .pl5  .pl10  .pl15  .pl20
.pr0  .pr5  .pr10  .pr15  .pr20
```

```html
<div class="s0 p10">Padded panel</div>
<div class="s1 pt5 pb5 pl10 pr10">Custom sides</div>
<div class="s2 p0">No padding</div>
```

---

## Fixed margin `.m*`

```
.m0   → margin: 0
.m5   → margin: 5px
.m10  → margin: 10px
.m15  → margin: 15px
.m20  → margin: 20px
```

Directional variants:

```
.mt0  .mt5  .mt10  .mt15  .mt20    (top)
.mb0  .mb5  .mb10  .mb15  .mb20    (bottom)
.ml0  .ml5  .ml10  .ml15  .ml20    (left)
.mr0  .mr5  .mr10  .mr15  .mr20    (right)
```

Negative margin — pushes element outward:

```
.m-5  .m-10  .m-15  .m-20
.mt-5 .mt-10 .mt-15 .mt-20
.mb-5 .mb-10 .mb-15 .mb-20
.ml-5 .ml-10 .ml-15 .ml-20
.mr-5 .mr-10 .mr-15 .mr-20
```

```html
<div class="s1 p5 mt10 mb10">Vertical breathing room</div>
<div class="s0 p5 ml20">Indented</div>
<div class="s5 p5 m-5">Bleeds 5px outside parent</div>
```

---

## Relative margin `.m{dir}{size}`

Uses spacing tokens instead of fixed pixels. Useful when you want margins that scale with the skin.

```
.mxs  .msm  .mmd  .mlg  .mxl      (all sides)

.mtxs .mtsm .mtmd .mtlg .mtxl     (top)
.mbxs .mbsm .mbmd .mblg .mbxl     (bottom)
```

```html
<div class="s0 p5 mtsm mblg">Token-spaced block</div>
```

---

## Auto margin `.mla` `.mra`

```
.mla  → margin-left: auto    (push element to the right)
.mra  → margin-right: auto   (push element to the left)
```

```html
<!-- push a button to the far right of a flex/block parent -->
<button class="s1 p5 mla">Far right</button>

<!-- center an inline-block -->
<div class="inline-block mla mra s2 p10">Centered block</div>
```

---

## Height `.h*` and Width `.w*`

Map directly to spacing tokens.

```
.hxs → height: var(--xs)   25 px
.hsm → height: var(--sm)   35 px
.hmd → height: var(--md)   50 px
.hlg → height: var(--lg)   70 px
.hxl → height: var(--xl)  100 px

.wxs → width: var(--xs)
.wsm → width: var(--sm)
.wmd → width: var(--md)
.wlg → width: var(--lg)
.wxl → width: var(--xl)
```

```html
<!-- buttons at different heights -->
<div class="r5">
    <button class="s1 hxs">xs</button>
    <button class="s2 hsm">sm</button>
    <button class="s3 hmd">md</button>
    <button class="s4 hlg">lg</button>
    <button class="s5 hxl">xl</button>
</div>

<!-- square element — same token for both axes -->
<div class="s1 hmd wmd">Square</div>
```

---

## Round `.round`

Applies `border-radius: 50%` — makes square elements circular.

```html
<!-- circular button — use matching h/w token -->
<button class="s1 hxs wxs round">+</button>
<button class="s5 hxs wxs round">−</button>
<button class="s3 hsm wsm round">✓</button>

<!-- circular avatar placeholder -->
<div class="s0 hmd wmd round"></div>
```

---

## Elevation `.raised` `.raised-sm` `.inset-xs`

```
.raised     → deep multi-layer drop shadow (cards, floating panels)
.raised-sm  → shallow asymmetric shadow (buttons, chips)
.inset-xs   → inner shadow (pressed state, inset wells)
```

```html
<div class="s0 p10 raised">Floating card</div>
<button class="s1 p5 raised-sm">Raised button</button>
<div class="s0 p10 inset-xs">Inset well</div>

<!-- windows themselves use .raised — combine for layering -->
<div class="s2 p5 raised-sm round hxs wxs">Chip</div>
```

---

## State `.disabled` `.hidden`

```
.disabled  → opacity: 0.4, pointer-events: none, overflow: hidden
.hidden    → display: none
```

```html
<button class="s1 p5 disabled">Can't click</button>
<div class="s3 p5 hidden">Not visible</div>
```

Toggle with JS:

```js
el.classList.toggle('disabled');
el.classList.toggle('hidden');
```

---

## Opacity `.op0` – `.op9`

```
.op0 → opacity: 0      .op5 → opacity: 0.5
.op1 → opacity: 0.1    .op6 → opacity: 0.6
.op2 → opacity: 0.2    .op7 → opacity: 0.7
.op3 → opacity: 0.3    .op8 → opacity: 0.8
.op4 → opacity: 0.4    .op9 → opacity: 0.9
```

```html
<div class="r5">
    <div class="s1 p5 op3">30%</div>
    <div class="s1 p5 op5">50%</div>
    <div class="s1 p5 op7">70%</div>
    <div class="s1 p5 op9">90%</div>
    <div class="s1 p5">100%</div>
</div>
```

---

## Display helpers

```
.block        → display: block
.inline       → display: inline;       overflow: hidden
.inline-block → display: inline-block; overflow: hidden
.hidden       → display: none !important
.centered     → display: inline-block; margin: auto  (center in parent)
.fixed        → position: fixed !important
```

```html
<span class="block s0 p5">Now block-level</span>
<div class="inline-block s1 p5">Inline block</div>
<div class="centered s2 p10">Horizontally centered</div>
```

---

## Float helpers `.fr` `.fl` `.fi`

```
.fr → float: right
.fl → float: left
.fi → float: initial  (clear float)
```

```html
<button class="s5 p5 fr">Delete</button>
<button class="s3 p5 fl">Save</button>
<div class="fi">Back to flow</div>
```

---

## Image background `.image`

Turns an element into a CSS background-image container (cover, no-repeat, centered).

```html
<div class="image hxl" style="background-image: url('photo.jpg')"></div>
```

---

## Clear `.clear`

Removes background and border from an element and its hover/active/SVG states — useful for icon-only buttons.

```html
<button class="clear">
    <svg>…</svg>
</button>
```

---

## Size propagation `.xs` `.sm` `.lg` `.xl`

Put a size class on any container to make all descendant buttons, inputs, selects, and textareas render at that size — no need to add the class to each element individually. `md` is the default and doesn't need a class.

| Class | Font size | Height token |
|---|---|---|
| `.xs` | 0.8 em | `--xs` (25 px) |
| `.sm` | 0.9 em | `--sm` (35 px) |
| `.lg` | 1.2 em | `--lg` (70 px) |
| `.xl` | 1.4 em | `--xl` (100 px) |

Affected elements: `button`, `select`, `input[type=text|password|email|search|date|number]`, `textarea`. Also adjusts icon sizes inside buttons, round button dimensions, and select option heights.

```html
<!-- all children render at xs size -->
<div class="r6 xs">
    <input type="text" placeholder="small input">
    <select><option>Pick one</option></select>
    <button class="s1">Go</button>
</div>

<!-- combine with grid rows for compact panels -->
<div class="r3 xs" style="gap:3px">
    <label>Name</label>
    <input type="text" class="c2">
</div>

<!-- sm-sized form section -->
<div class="r2 sm">
    <input type="text" placeholder="First name">
    <input type="text" placeholder="Last name">
    <button class="s1 c2">Submit</button>
</div>

<!-- per-element class still works and overrides propagation -->
<div class="xs">
    <button>xs button</button>
    <button class="lg">this one is lg despite parent</button>
</div>
```

Propagation uses descendant selectors (`.xs button`), so per-element classes (`button.lg`) still win due to higher specificity.

---

## Quick reference

```
Layout      r2–r10  block  inline  inline-block  centered  fixed  fl  fr  fi
Colour bg   s0–s6   (default primary secondary success warning danger link)
Colour text t0–t6   (text-default … text-link)
Padding     p0/5/10/15/20   pt pb pl pr (same steps)
Margin      m0/5/10/15/20   mt mb ml mr (same) + negatives m-5/10/15/20
            mla mra  (auto)
            mxs msm mmd mlg mxl  (token)  mtxs mtsm … mbxl (directional token)
Size        hxs hsm hmd hlg hxl   wxs wsm wmd wlg wxl
Size prop   xs sm lg xl  (on container → children inherit size)
Shape       round
Elevation   raised  raised-sm  inset-xs
Opacity     op0–op9
State       disabled  hidden
Misc        image  clear
```
