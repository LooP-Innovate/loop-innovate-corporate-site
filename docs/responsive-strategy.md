# Responsive Strategy

## Status

This document defines the responsive contract retained by the still-first
Journey. The matrix at the end records the Chromium in-app-browser baseline run
completed on 2026-08-20 before the static-scrollytelling switch. That run remains
valid regression evidence for layout mechanics, but the new still crops,
overlays, reduced-motion visuals, and zero-video behavior are Pending integrated
QA. Physical iOS Safari, Android Chrome, safe-area hardware, browser chrome, and
200% zoom remain release-device checks.

## Principle

Design L∞P mobile as an intentional composition, not a scaled desktop page.
Preserve story order, meaning, legibility, and interaction; simplify secondary
navigation, decoration, media payload, and vertical rhythm first.

Breakpoints describe layout pressure, not device identity. Prefer the shared
tiers below, then add a content-driven exception only when a component proves it
needs one. Do not infer layout or media choice from user-agent strings.

## Breakpoint contract

| Tier | Range | Layout and interaction contract | Journey contract |
| --- | --- | --- | --- |
| Wide | `>= 90rem` | Capped containers and deliberate whitespace; content must not stretch merely because space exists | Desktop still and focal point; complete labelled rail |
| Desktop | `> 64rem` and `< 90rem` | Full navigation and editorial grids | Desktop still and focal point; complete labelled rail |
| Tablet | `> 48rem` and `<= 64rem` | Reduced columns, controlled line length, disclosure navigation where needed | Desktop still variant; tablet focal point; compact dot rail with 44px targets |
| Compact | `<= 48rem` | Single reading flow, compact typography and rhythm, disclosure navigation | Mobile still with desktop fallback and mobile focal point; full rail hidden; current scene and progress retained |
| Narrow | `<= 30rem` | A compact-subset adjustment for type, gutter, long labels, and section rhythm—not a separate content order | Same mobile asset contract; essential scene state remains visible |
| Short landscape | `orientation: landscape` and `max-height: 32rem` | Cross-cutting height override at any width; compact Hero, scrollable menus, and safe vertical bands | Hide the vertical rail; retain scene readout and progress without collision |

Boundary ownership is intentional: `48rem` belongs to Compact, and `64rem`
belongs to Tablet. Short landscape and Narrow refine the active width tier; they
do not create additional media asset variants.

Content-driven exceptions may sit inside these tiers—for example, a Footer can
reduce columns before the rest of the page—but they must preserve DOM reading
order and the same accessibility contract.

## Containers, gutters, and safe areas

- Cap ordinary content and align Header, body sections, Contact, route Heroes,
  and Footer to the same container geometry.
- Compose inline gutters with `env(safe-area-inset-left)` and
  `env(safe-area-inset-right)` rather than adding an unrelated second inset.
- Include `env(safe-area-inset-top)` in fixed-header geometry and
  `scroll-padding-top`; include the bottom inset in Footer and viewport-bound
  controls.
- Use `viewport-fit=cover` only together with these inset protections.
- Confirm `document.documentElement.scrollWidth <= window.innerWidth`; clipping
  overflow is not a substitute for responsive reflow.

## Viewport height units

- Use `100svh` for the sticky Journey Stage. Its stable small-viewport height
  avoids an address-bar change becoming a second animation clock or moving the
  pin boundary during normal scrolling.
- Use `100dvh` where a currently available viewport ceiling matters, such as an
  open mobile menu or scrollable diagnostic body. These surfaces may adapt as
  browser chrome expands or retracts.
- Do not replace the Journey Stage with `100dvh`; that can create visible pin
  and progress jumps on mobile browsers.
- Size full-height UI against the shared Header height plus safe-area insets,
  not against an unexplained fixed pixel subtraction.

## Journey still selection

The still asset contract remains desktop/mobile even though composition has
three focal tiers. Resolve a Compact/Mobile request as follows:

```text
mobile still -> desktop still
  -> configured compatibility poster
  -> generated placeholder
```

A Desktop or Tablet request uses the desktop still, configured compatibility
poster, then placeholder. A tablet focal point does not require a third image
file. Missing null paths never become requests.

Reduced motion uses the same still resolution but removes drift, parallax,
animated blur/mask/lines, continuous loops, and animated crossfade. Optional
future video is not requested.

Decode current and destination stills near the active interval rather than
requesting every canonical filename at startup. Retain the current destination
through a visible reverse crossfade so it cannot disappear at the boundary.
Optional future video keeps the historical bounded-media policy, but it is not
part of static-mode layout or readiness.

## Focal tiers and cropping

Journey stills, compatibility posters, and any optional future video use the same
three authored focal values:

- `focalPointDesktop`
- `focalPointTablet`
- `focalPointMobile`

Keep `object-fit: cover`; change the focal point rather than switching portrait
screens to `contain`. The current FIELD calibration is:

```text
Desktop  center center
Tablet   30% center
Mobile   25% center
```

This calibration protected the person in the earlier FIELD proof frame across
Wide, Tablet portrait, Compact portrait, and short-landscape screenshots. The
derived 01-field.webp and all replacement stills require a new crop pass before
static integration can inherit that PASS. Revalidate all three values whenever a
still changes. A RETURN infinity layer must remain fully inside its safe visual
box at every tier.

## Journey rail

- Desktop/Wide: show all six scene labels, a clear active state, and at least
  44px hit height.
- Tablet: retain all six accessible buttons but present a compact dot rail; the
  accessible label remains on each control even when visible text is hidden.
- Compact/Narrow: hide the vertical rail and preserve the current scene readout
  plus progress track.
- Short landscape: hide the vertical rail regardless of width so it cannot
  collide with the fixed Header or consume the usable height.

Rail simplification must not remove semantic Journey order, keyboard access on
tiers where controls remain visible, or the ability to understand the active
scene.

## Debug behavior

Journey diagnostics use a native `details` disclosure. The summary remains
reachable at a 44px target size; the detailed body opens into a viewport-bounded,
internally scrollable region. Safe-area and Header offsets keep it out of primary
controls. Compact and short-landscape tiers reduce its footprint further.

The panel must be collapsed by default on ordinary pages and must not create
production DOM or layout when Debug is disabled. `/journey-debug` remains the
dedicated full diagnostic surface. A collapsible implementation prevents Debug
from invalidating the visual-QA viewport it is intended to observe.

## Orientation and progress preservation

Orientation changes are geometry changes, not Journey restarts. The engine
contract is:

1. Snapshot normalized Journey progress before replacing the geometry.
2. Re-measure the section and sticky distance after the viewport stabilizes.
3. Restore the equivalent scroll position against the new distance.
4. Keep the same scene and segment progress.
5. If the width crosses an asset-variant boundary, attach/decode the replacement
   still without changing the retained scene or local progress. An explicitly
   enabled future video additionally seeks to that retained progress.

Continue observing section/sticky resize and window orientation changes. Use
`visualViewport` only as a supplement: ordinary address-bar resize must not be
treated as a user-requested progress reset. Forward/reverse direction, active
crossfade, and media preload limits must remain valid after rotation.

## Typography and vertical rhythm

- Preserve cinematic/editorial display type on Desktop and Wide without forcing
  intended lines to wrap or collide with the rail.
- Reduce display scale on Tablet and Compact before text reaches media subjects,
  safe areas, or the viewport edge.
- Narrow and short-landscape tiers may remove secondary metadata but not the
  primary statement or active-scene meaning.
- Keep Japanese body copy at a readable measure; inspect punctuation, short
  orphan lines, and system-font substitution manually.
- Reduce excess section padding and decorative minimum heights on Compact while
  preserving semantic grouping.

## Navigation and corporate sections

- Desktop/Wide use the full primary navigation; Tablet/Compact use the native
  disclosure navigation.
- Open menus must have a `100dvh`-based maximum block size, internal scrolling,
  contained overscroll, and safe-area offsets so every link remains reachable in
  short landscape.
- Keep interactive targets at least 44 by 44 CSS pixels and visible focus at all
  tiers.
- Collapse corporate grids in source order. Use intentional Tablet layouts
  rather than keeping Desktop grids until the Compact threshold or mechanically
  forcing every section into the same column count.
- Keep the Journey exit spacious enough to communicate release, but do not add a
  near-full-screen empty pause on Compact.
- Missing visual assets remain explicit placeholders; responsive work must not
  invent proof or production media.

## Browser QA status

The PRE-ASSET responsive baseline is **PASS** in the Chromium in-app-browser.
The still-first integration status is **Pending**. Prior layout evidence is not
evidence that the new WebP crop, overlay grammar, RETURN infinity, image
requests, or static reduced-motion state passes.

| Viewport | Required still-first inspection | Baseline | Static integration |
| --- | --- | --- | --- |
| `1920x1080` | Wide alignment, Hero, rail, still crop/overlay | PASS | Pending |
| `1440x900` | Desktop Header, Journey, rhythm, overflow | PASS | Pending |
| `1366x768` | Laptop height pressure and rail | PASS | Pending |
| `1280x800` | Laptop navigation and Journey release | PASS | Pending |
| `1024x768` | Tablet boundary, menu, dot rail, grids | PASS | Pending |
| `820x1180` | Portrait-tablet FIELD still crop and reading flow | PASS | Pending |
| `430x932` | Compact Hero, menu, Debug, crop, Footer | PASS | Pending |
| `393x852` | Compact type, overflow, still crop | PASS | Pending |
| `390x844` | Compact type, overflow, still crop | PASS | Pending |
| `375x812` | Narrow rhythm and touch targets | PASS | Pending |
| `360x800` | Narrow edge cases and long labels | PASS | Pending |
| `844x390` landscape | Short Hero, menu, readout/progress, crop | PASS | Pending |

For every static row confirm Header, Journey, rail mode, still/fallback crop,
overlay distinction, RETURN-only infinity, corporate layout, Debug ON/OFF, safe
areas, menu interaction, sticky release, forward/reverse progress, reduced
motion, zero normal-mode Journey video requests, and:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Baseline evidence included: exact `100svh` Stage height, full/dot/hidden rail
modes, collapsed and scrollable-open Debug states, a `100dvh`-bounded menu,
normal Journey release, standard-route portrait/landscape layouts, and an
orientation change at FIELD progress `0.0994` that retained the scene, source,
Ready State 4, and video time (`3.998s` before, `3.999s` after). Console warning
and error logs were empty. The video-specific values are historical responsive
regression evidence only.

Before production release, repeat the matrix on physical iOS Safari and Android
Chrome, exercise 200% zoom, and recheck crop/slow/missing-still behavior with the
canonical six scene anchors.
