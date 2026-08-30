# Journey asset delivery policy

Baseline: `v3.0-pre-optimization` (`d290b44a0e274753ff36ea4ca12a2f729dc00c86`). This policy changes delivery only. Scene order, 510svh track length, weighted timing, blend behavior, motion, copy, focal points, and layer composition remain fixed.

## Decision rules

1. Visual, blend, gradient, transparency, and portrait-cover fidelity take precedence over bytes.
2. A source WebP remains `unoptimized` when q90 AVIF is larger, the saving is immaterial, or sparse alpha/gradient fidelity carries more value than the saving.
3. RETURN is the only scene moved to Next Image q90 delivery. Every RETURN source reduced materially and the combined browser transfer met the target.
4. RETURN uses `sizes="1672px"`. A 640px derivative was tested and rejected because portrait `object-fit: cover` made stars, people, and water visibly soft at 390x844. The browser therefore receives a full-height q90 derivative, not the six raw originals.

## Still assets

All sources are 1672x941 WebP.

| Asset | Scene | Source size | Before `unoptimized` | Final strategy | Reason | Desktop source | Tablet source | Mobile source |
|---|---|---:|:---:|---|---|---|---|---|
| `still/01-field.webp` | FIELD | 138.1 KB | No | A: Next Image q75 | Existing responsive path is visually approved | generated `w=1920` | generated width selected from `100vw` | generated `w=640` |
| `still/02-order.webp` | ORDER | 144.4 KB | No | A: Next Image q75 | Existing responsive path is visually approved | generated `w=1920` | generated width selected from `100vw` | generated `w=640` |
| `still/03-design.webp` | DESIGN | 208.1 KB | No | A: Next Image q75 | Existing responsive path is visually approved | generated `w=1920` | generated width selected from `100vw` | generated `w=640` |
| `still/04-build.webp` | BUILD | 284.5 KB | No | A: Next Image q75 | Existing responsive path is visually approved | generated `w=1920` | generated width selected from `100vw` | generated `w=640` |
| `still/05-adopt.webp` | ADOPT | 107.8 KB | No | A: Next Image q75 | Existing responsive path is visually approved | generated `w=1920` | generated width selected from `100vw` | generated `w=640` |
| `still/06-return.webp` | RETURN | 1,797.5 KB | Yes | A: Next Image q90, fidelity-sized | Large photographic source; q90 AVIF preserves the dawn gradient while removing raw transfer | generated `w=1920&q=90` | generated `w=1920&q=90` | generated `w=1920&q=90` |

## Separated layers

All sources are 1672x941 alpha WebP. `source` means the exact WebP remains intentionally unoptimized at every viewport. `q90` means a browser-negotiated AVIF/WebP derivative through Next Image.

| Asset | Scene | Source size | Before `unoptimized` | Final strategy | Reason | Desktop | Tablet | Mobile |
|---|---|---:|:---:|---|---|---|---|---|
| `layers/field/fog-haze.webp` | FIELD | 23.2 KB | Yes | source | q90 trial was larger; preserve mist alpha | source | source | source |
| `layers/order/perspective-grid.webp` | ORDER | 58.6 KB | Yes | source | q90 saving was negligible; preserve thin lines | source | source | source |
| `layers/order/lake-grid.webp` | ORDER | 56.2 KB | Yes | source | q90 trial was larger; preserve reflection alpha | source | source | source |
| `layers/order/grid-nodes.webp` | ORDER | 34.8 KB | Yes | source | q90 trial was slightly larger | source | source | source |
| `layers/order/city-lights.webp` | ORDER | 9.1 KB | Yes | source | Absolute saving is too small to justify another encode | source | source | source |
| `layers/design/ground-lines.webp` | DESIGN | 122.8 KB | Yes | source | q90 saving was negligible; preserve thin geometry | source | source | source |
| `layers/design/volumetric-frames.webp` | DESIGN | 37.1 KB | Yes | source | Small source; preserve transparent edges | source | source | source |
| `layers/design/vertical-guides.webp` | DESIGN | 54.3 KB | Yes | source | q90 trial was larger | source | source | source |
| `layers/design/design-points.webp` | DESIGN | 57.4 KB | Yes | source | Saving was negligible; preserve point contrast | source | source | source |
| `layers/build/transparent-frames.webp` | BUILD | 326.1 KB | Yes | source | q90 was the same size; preserve frame alpha | source | source | source |
| `layers/build/spatial-nodes.webp` | BUILD | 277.4 KB | Yes | source | Saving was under 7%; preserve crisp node detail | source | source | source |
| `layers/build/calculation-lines.webp` | BUILD | 105.7 KB | Yes | source | q90 trial was larger | source | source | source |
| `layers/adopt/information-overlay.webp` | ADOPT | 70.7 KB | Yes | source | q90 trial was larger | source | source | source |
| `layers/adopt/grid-traces.webp` | ADOPT | 13.4 KB | Yes | source | q90 trial was larger | source | source | source |
| `layers/adopt/ambient-glow.webp` | ADOPT | 27.0 KB | Yes | source | Small source; retain exact glow gradient | source | source | source |
| `layers/return/milky-way-stars.webp` | RETURN | 167.4 KB | Yes | A: q90, fidelity-sized | Material reduction with star detail retained | generated `w=1920&q=90` | same | same |
| `layers/return/star-field.webp` | RETURN | 566.0 KB | Yes | A: q90, fidelity-sized | Material reduction; q90 retained fine stars in visual QA | generated `w=1920&q=90` | same | same |
| `layers/return/dawn-horizon-glow.webp` | RETURN | 41.1 KB | Yes | A: q90, fidelity-sized | Material reduction; no gradient banding observed | generated `w=1920&q=90` | same | same |
| `layers/return/subtle-grid-flow.webp` | RETURN | 335.6 KB | Yes | A: q90, fidelity-sized | Material reduction; grid/water blend retained | generated `w=1920&q=90` | same | same |
| `layers/return/blue-particles.webp` | RETURN | 293.5 KB | Yes | A: q90, fidelity-sized | Material reduction; particle contrast retained | generated `w=1920&q=90` | same | same |

## RETURN exit assets

| Asset | Resolution | Size | Before `unoptimized` | Final strategy | Reason |
|---|---:|---:|:---:|---|---|
| `transition/return-exit/white-dot-dissolve-particles.webp` | 1672x941 | 25.5 KB | Yes | source | Small alpha source; exact dissolve is safer than a re-encode |
| `transition/return-exit/white-transition-wash.webp` | 1672x941 | 3.3 KB | Yes | source | Already minimal; preserve exact wash gradient |

## RETURN measured result

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Six RETURN source resources | 3,201,122 B | 376,913 B | -88.2% |
| Fresh HTTP transfer including response headers | 3,202,826 B | 379,490 B | -88.2% |

The 1 MB target is met without changing source pixels in the repository. q75/w640 RETURN trials were rejected. The accepted q90/w1920 derivatives scored 41.25 dB PSNR in the 1440 comparison screenshot and 38.63 dB at 390, with no visible banding, missing people, broken transparency, blend change, or transition change.

## Visual QA record

Checked at 1440x900, 1024x768, 390x844, and 320x568. The inspection covered night sky, stars, Milky Way, mist, mountains, city, water reflection, people, transparent layers, blue gradients, and the final RETURN-to-white transition. Console errors and horizontal overflow were zero at all four sizes.
