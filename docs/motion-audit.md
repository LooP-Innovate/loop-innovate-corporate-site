# Motion audit

The implementation has several internal motion names, but they resolve to five user-perceived languages.

| Motion language | Meaning | Decision |
| --- | --- | --- |
| Journey transition | FIELD LOOP progression and scene meaning | Keep |
| Reveal / Open | Section entrance and editorial hierarchy | Keep as one visual family; internal variants may share timing tokens |
| Stagger | Lists, grids, and process reading order | Keep as one family; avoid per-card novelty |
| Structural transformation | Field → Infinity and BUILD System Window | Keep only where structure itself communicates the idea |
| Cursor interaction | Fine-pointer feedback and brand texture | Keep at current restrained strength |

## Keep

- One FIELD TO SYSTEM typewriter. The complete accessible text exists immediately; only its visual duplicate is animated.
- Journey scene transitions, Field → Infinity, System Window, and the pointer-only cursor.
- Existing touch disablement, reduced-motion fallback, forced-color protection, and keyboard focus treatment.

## Merge

- `kinetic`, `split`, `mask`, `open`, `scale`, `reveal`, `story`, and `warm` are treated as one Reveal / Open language.
- `stagger`, `stack-card`, `flow-step`, `slide`, `progress-item`, and `line-item` are treated as one ordered-list language.
- Shared duration/easing tokens remain the source of timing consistency even where semantic data names differ.

## Remove / reduce

- Removed the unused `storySoftRise` keyframe.
- Raised the scroll-focus opacity floor from 0.32 to 0.68 so non-focused B2B content remains readable.
- Do not add further typewriter instances. Important explanatory text must never wait for animation.

The custom cursor remains visually subordinate to content: no touch rendering, no forced-color rendering, and no essential state communicated only through cursor morphing.
