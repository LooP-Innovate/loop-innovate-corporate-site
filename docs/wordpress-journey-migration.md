# WordPress Journey Migration Specification

The Journey is a fixed visual application embedded in the theme, not a Gutenberg
layout. WordPress may supply narrowly structured copy fields, but it must not own
the engine, motion grammar or scene composition.

## Ownership map

| Concern | Current source | WordPress ownership | Editable? | Migration rule |
| --- | --- | --- | --- | --- |
| Scene definitions and IDs | `scene-config.ts` | Theme code | No | Preserve all six IDs and schema |
| Scene order | `SCENES` | Theme code | No | FIELD → ORDER → DESIGN → BUILD → ADOPT → RETURN |
| Asset resolver and manifest | resolver/config modules | Theme code/build manifest | No | Validated allowlist only; no free URL field |
| Progression math | `timeline.ts` | Theme JavaScript | No | Port tests before replacing implementation |
| Track length | `JOURNEY_TRACK_HEIGHT_SVH` | Theme CSS/config | No | Preserve 510svh |
| Segment weights | `JOURNEY_SEGMENT_WEIGHTS` | Theme JavaScript | No | Preserve `[0.78, 0.84, 0.88, 1.12, 1.38]` |
| Endpoint start | `JOURNEY_ENDPOINT_SCROLL_START` | Theme JavaScript | No | Preserve `0.92` |
| Blend start | `DEFAULT_BLEND_START` | Theme JavaScript | No | Preserve `0.9` |
| ADOPT → RETURN story start | `useJourneyEngine.ts` | Theme JavaScript | No | Preserve `0.9` |
| Blend and transition logic | timeline/interaction modules | Theme JavaScript + CSS | No | Preserve reversible state and reduced-motion branch |
| Layer metadata/order | `layer-config.ts` | Theme code/build manifest | No | Preserve layer name, scene, z-order and delivery policy |
| Fixed scene graphics | Journey components/CSS | Theme templates | No | Keep outside block editor |
| Responsive focal rules | scene/still resolver | Theme code | No | Preserve desktop/tablet/mobile focal tiers |
| Responsive asset delivery | Next Image configuration | Theme image helper/CDN | No | Match `journey-asset-policy.md` quality baseline |
| Scene label | scene config | Structured field or theme default | Limited | Enum-bound to the six scene records |
| Heading | scene config | Structured fields | Limited | `heading_line_1`, `heading_line_2`; no HTML |
| Description | scene config | Structured fields | Limited | Bounded plain-text lines; no arbitrary blocks |
| Forced break positions | current structured lines | Theme template | No/free text disallowed | Render only the defined line fields |

## Fixed layer

The following must remain version-controlled in the WordPress theme or a bundled
theme module:

- the six-scene engine, order, timeline, 510svh track and all timing constants;
- preloading, scene selection, crossfade deadband and reverse-scroll behavior;
- BUILD System Window and RETURN phases, layer structure and exit-to-white logic;
- CSS custom-property contract, masks, blending, overlay modes and focal points;
- pointer and keyboard behavior, debug default-off behavior and reduced motion;
- motion token assignment and responsive breakpoints;
- asset allowlist, dimensions, delivery quality and validation.

Neither Gutenberg users nor normal editors may enter `data-motion`, timing values,
asset URLs, blend modes, inline JavaScript or arbitrary Journey markup.

## Editable layer candidate

If copy editing is required after visual parity has been accepted, expose a single
structured record per scene:

```text
scene_id             fixed enum, read-only
label                bounded plain text
heading_line_1       required plain text
heading_line_2       optional plain text
description_line_1   required plain text
description_line_2   optional plain text
revision_status      draft / review / approved
```

Validation must reject HTML, line-break injection, missing required lines and
unexpected scene IDs. Only an approved revision is rendered. A preview must run the
same four-viewport visual regression because even valid copy can change the locked
composition.

## Migration acceptance

- Exact scene order and checkpoint mapping pass the ported timeline tests.
- Visual comparison passes at 1440×900, 1024×768, 390×844 and 320×568.
- Forward and reverse scrolling preserve the same state.
- Reduced motion produces the current static, readable contract.
- RETURN reaches the same white transition without clipping or early takeover.
- No editor role can modify fixed-layer values or inject a motion token.
