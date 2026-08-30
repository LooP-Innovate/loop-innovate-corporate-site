# Transfer Baseline — v3.0 Reference

Measured on 2026-08-31 against the production build with a fresh browser load,
cache disabled, and the Network inventory captured at three Journey checkpoints.
`Transferred` includes response headers; `Resource` is the decoded response body.
The repeatable HTTP measurement is implemented by
`scripts/measure-transfer-baseline.mjs`.

## Measurement conditions

| Item | Value |
| --- | --- |
| Build | `next build` production output |
| Cache | Disabled / fresh load |
| Desktop viewport | 1440 × 900 |
| Mobile viewport | 390 × 844 |
| Initial checkpoint | Initial document and resources requested before scrolling |
| BUILD checkpoint | Resources requested after reaching BUILD |
| RETURN checkpoint | Resources requested after RETURN is visible |
| Image negotiation | AVIF, then WebP |

The before inventory was captured from the annotated pre-optimization reference.
Its document, CSS, JavaScript and font requests are the original browser values.
For a stable like-for-like image comparison, the captured image URLs were replayed
against a production server with identical `Accept` headers. The after inventory is
from the final reference build. This hybrid replay avoids counting a stopped local
server or browser cache hit as a zero-byte response.

## Desktop — 1440 × 900

All values are bytes.

| Checkpoint | Version | Document | CSS | JS | Fonts | Images | Journey assets | Cumulative transferred | Cumulative resource |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Initial | Before | 17,691 | 61,815 | 172,944 | 684,445 | 356,026 | 351,007 | 1,433,731 | 2,624,404 |
| Initial | After | 17,707 | 61,815 | 173,052 | 684,445 | 356,026 | 351,007 | 1,433,908 | 2,625,099 |
| BUILD | Before | — | — | — | 722,193 | 1,533,017 | 1,666,278 | 2,896,352 | 4,082,636 |
| BUILD | After | — | — | — | 722,193 | 1,533,017 | 1,666,278 | 2,786,927 | 3,973,415 |
| RETURN | Before | — | — | — | 740,609 | 4,748,024 | 4,869,104 | 6,131,194 | 7,314,721 |
| RETURN | After | — | — | — | 740,609 | 1,924,688 | 2,045,768 | 3,197,014 | 4,380,187 |

## Mobile — 390 × 844

All values are bytes.

| Checkpoint | Version | Document | CSS | JS | Fonts | Images | Journey assets | Cumulative transferred | Cumulative resource |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Initial | Before | 17,691 | 61,815 | 172,944 | 684,445 | 241,994 | 236,975 | 1,247,854 | 2,159,069 |
| Initial | After | 17,707 | 61,815 | 173,052 | 684,445 | 241,994 | 236,975 | 1,248,020 | 2,159,764 |
| BUILD | Before | — | — | — | 722,193 | 1,351,563 | 1,370,792 | 2,437,193 | 3,344,022 |
| BUILD | After | — | — | — | 722,193 | 1,351,563 | 1,370,792 | 2,419,585 | 3,326,628 |
| RETURN | Before | — | — | — | 740,609 | 4,557,709 | 4,573,618 | 5,663,174 | 6,567,247 |
| RETURN | After | — | — | — | 740,609 | 1,734,373 | 1,750,282 | 2,820,811 | 3,724,540 |

## RETURN asset delta

| Metric | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Six RETURN images — transferred | 3,202,826 B | 379,490 B | 88.2% |
| Six RETURN images — resource | 3,201,122 B | 376,913 B | 88.2% |

The target of less than 1 MB is met without changing the source artwork, scene
order, timing, blend or copy. A 640px mobile candidate was rejected because stars,
people and water reflections became visibly soft. The final policy therefore asks
Next Image for a 1672px display source and lets the production optimizer deliver a
high-quality AVIF at quality 90. See `docs/journey-asset-policy.md` for the per-file
decision and visual comparison.

## Reference interpretation

- Initial-load transfer is effectively unchanged; the optimization is deliberately
  scoped to RETURN.
- BUILD remains visually and materially unchanged.
- RETURN cumulative transfer falls by about 2.93 MB on desktop and 2.84 MB on
  mobile in this local production baseline.
- These are a migration comparison baseline, not a promise of Internet timings.
  CDN compression, cache state, HTTP version and WordPress hosting will change the
  wire total. WordPress acceptance should repeat the same checkpoints and compare
  both resource and transferred sizes.
