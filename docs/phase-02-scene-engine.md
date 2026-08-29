# Phase 02 Hybrid Scene Timeline Engine

> Historical phase record. The current PRE-ASSET scene/asset types, responsive
> resolver, loading window, media paths, debug contract, and integration rules
> are authoritative in [`journey-architecture.md`](./journey-architecture.md)
> and [`journey-asset-spec.md`](./journey-asset-spec.md). Preserve this document
> as the rationale for the original Phase 02 engine rather than using it as the
> asset onboarding guide.

## Scope and decision

Phase 02 builds the L∞P-specific Scrollytelling Engine skeleton. It is not a
finished corporate website and it does not introduce final visual language or
brand copy.

The selected architecture is **C — Reference and Phase 01 hybrid integration**:

- take only general concepts such as a scene timeline, local segment progress,
  layered crossfade, poster fallback, and scene progress navigation;
- preserve the tested Phase 01 duration, seeking, smoothing, reduced-motion,
  and cleanup behavior;
- implement all L∞P code, CSS, wording, placeholders, and assets independently.

The reference repository has no confirmed downstream license grant. It is not
a package dependency and no reference source, styles, prose, imagery, or video
may be copied into this implementation.

## Runtime ownership

The Phase 02 surface is organized around the following responsibilities:

| Area | Responsibility |
| --- | --- |
| `scene-config.ts` | Ordered scene records, outgoing asset slots, blend point, and responsive focal points |
| `timeline.ts` | Pure normalization and progress-to-scene calculation |
| `LoopJourney` | Journey section, track geometry, sticky lifetime, observers, and orchestration |
| `JourneyStage` | Current/destination layers, video, poster, placeholder, shade, and opacity |
| `JourneyOverlay` | Minimal scene identifier, CSS progress, and optional desktop rail |
| `JourneyDebug` | Throttled development diagnostics only |
| `useJourneyEngine` | Scroll, RAF, media metadata, and preference lifecycle if kept as a hook |

The Phase 01 implementation remains under
`components/experiments/scroll-video/` and is not imported as a visual child of
the journey. Shared behavior should be factored only when the resulting API is
actually common and remains easier to test.

## Scene configuration

The immutable order is:

| Index | Scene | Phase 02 visual | Outgoing clip status |
| ---: | --- | --- | --- |
| 0 | FIELD | Real FIELD video with fallback placeholder/poster | `/video/field-v01.mp4` used as the PoC interval asset |
| 1 | ORDER | Explicit placeholder unless a real poster is configured | Missing |
| 2 | DESIGN | Explicit placeholder unless a real poster is configured | Missing |
| 3 | BUILD | Explicit placeholder unless a real poster is configured | Missing |
| 4 | ADOPT | Explicit placeholder unless a real poster is configured | Missing |
| 5 | RETURN | Explicit placeholder unless a real poster is configured | No outgoing interval |

A scene record can provide an identifier, display label, optional poster,
optional outgoing clip, blend start, and desktop/mobile focal positions. The
configuration must validate the ordered relationship rather than relying on
scattered string comparisons.

The implemented configuration API exports `SCENES`, `TRANSITIONS`,
`SCENE_COUNT`, `TRANSITION_COUNT`, `getSceneByIndex`, and derived viewport,
segment, and track height constants. The outgoing media property is `clipSrc`;
all absent media values are `null`.

Six scenes create five interval slots:

```text
FIELD --[0]--> ORDER --[1]--> DESIGN --[2]--> BUILD --[3]--> ADOPT --[4]--> RETURN
```

Only interval 0 has a real Phase 02 video. Missing assets remain `undefined` or
`null`; they are not represented by speculative public paths that would cause
404 requests.

The current FIELD file depicts FIELD itself rather than an approved
FIELD-to-ORDER transition. Phase 02 maps it over interval 0 only to prove media
scrubbing and fallback crossfade. Its semantic role may be replaced when the
production transition is delivered.

## Timeline calculation

### Input and invariants

The timeline accepts normalized or untrusted progress and a scene count. It
returns a normalized journey progress, current scene index, next scene index,
segment-local progress, and blend progress. It is a pure function: no DOM,
media, date, randomness, or mutable module state is allowed.

Its public operations are `calculateJourneyTimeline`,
`calculateBlendProgress`, and `getSceneJourneyProgress`. The canonical local
value is `segmentProgress`; UI labels may say "Local Progress", but engine code
does not introduce a second competing field name.

For six scenes:

```text
intervalCount = sceneCount - 1 = 5
p             = clamp(progress, 0, 1)
scaled        = p * intervalCount
```

For `p < 1`:

```text
sceneIndex      = floor(scaled)
nextSceneIndex  = sceneIndex + 1
segmentProgress = scaled - sceneIndex
```

At `p = 1`:

```text
sceneIndex      = 5  // RETURN
nextSceneIndex  = 5
segmentProgress = 1
blendProgress   = 0  // no destination after RETURN
```

The explicit final case prevents an out-of-bounds next scene and ensures that
RETURN remains the stable final visual.

### Expected checkpoints

| Journey progress | Scene | Next | Segment progress | Blend progress |
| ---: | --- | --- | ---: | ---: |
| 0% | FIELD | ORDER | 0.00 | 0.00 |
| 20% | ORDER | DESIGN | 0.00 | 0.00 |
| 40% | DESIGN | BUILD | 0.00 | 0.00 |
| 60% | BUILD | ADOPT | 0.00 | 0.00 |
| 80% | ADOPT | RETURN | 0.00 | 0.00 |
| 100% | RETURN | RETURN | 1.00 | 0.00 |

Around the first boundary:

| Journey progress | Scene | Segment progress | Blend progress |
| ---: | --- | ---: | ---: |
| 19.99% | FIELD | 0.9995 | 0.9950 |
| 20.00% | ORDER | 0.0000 | 0.0000 |
| 20.01% | ORDER | 0.0005 | 0.0000 |

Equivalent boundary tests are expected at 40%, 60%, and 80%, alongside clamped
negative/over-one inputs and any supported invalid-input behavior.

## Crossfade

Each outgoing interval has a `blendStart`; the default is `0.90`. The timeline
computes:

```text
blendProgress = clamp(
  (segmentProgress - blendStart) / (1 - blendStart),
  0,
  1
)

current opacity     = 1 - blendProgress
destination opacity = blendProgress
```

This value comes only from scroll progress. There is no independent timer, so
the same positions produce the same opacities in both directions. A future
scene may set values such as `0.85` or `0.95` without changing the algorithm.

The destination asset is resolved in strict fallback order:

```text
ready destination video
  -> configured destination poster
  -> deterministic CSS placeholder
```

FIELD-to-ORDER therefore fades from the FIELD frame into the ORDER placeholder
in Phase 02. A destination video element that exists but has not reached a safe
ready state does not replace the poster/placeholder and cannot introduce a
black frame.

## FIELD video control

For the FIELD interval only:

```text
targetTime = valid FIELD duration * segmentProgress
```

The controller then approaches that value with the Phase 01 smoothing factor:

```text
smoothedTime += (targetTime - smoothedTime) * 0.15
```

Small differences below the seek threshold are skipped. The controller may
coalesce targets while a seek is in progress, but it must apply the most recent
target after the browser becomes ready. Forward scrolling advances FIELD;
reverse scrolling seeks it backward. Once the ORDER interval is active, FIELD
may be parked once at its ending frame rather than sought every RAF.

Duration is accepted only from the actual `HTMLVideoElement` after:

- `loadedmetadata`;
- `durationchange`; or
- a mount-time or source-change check where `readyState >= HAVE_METADATA`.

Only finite positive values update the valid duration. Duration is never
hardcoded and an existing value is never replaced with zero or a non-finite
number.

## Sticky section and progress geometry

The expected document experiment is:

```text
ordinary before section
  -> LoopJourney track
     -> sticky 100svh stage
  -> ordinary after section
```

Progress is calculated relative to the journey track, not the document:

```text
rect     = track.getBoundingClientRect()
distance = rect.height - window.innerHeight
progress = clamp(-rect.top / distance, 0, 1)
```

Using the current bounding rectangle avoids `offsetTop` assumptions through
nested layout contexts. `ResizeObserver`, viewport resize, and orientation
signals invalidate cached geometry before subsequent progress or rail-jump
calculations.

The stage is sticky only while its containing track intersects its sticky
lifetime. Entering the journey pins the visual viewport; reaching the track end
releases it naturally. A `position: fixed` page-level stage is prohibited.

The track length is derived from data:

```text
trackHeight = viewportHeight
            + (sceneCount - 1) * intervalScrollLength
```

Phase 02 exports `JOURNEY_TRACK_HEIGHT_SVH` from the same scene configuration.
The configured interval length is `110svh`, so six scenes yield
`100 + (5 * 110) = 650svh`. If the interval length changes, it changes in one
configuration point rather than through unrelated CSS constants.

Rail jumps convert a scene index back into this same section-relative domain:

```text
targetProgress = sceneIndex / (sceneCount - 1)
targetScrollY  = trackDocumentTop + targetProgress * distance
```

The final scene maps to progress 1. Reduced-motion mode uses non-smooth scroll
behavior.

## Loading strategy

### Phase 02 behavior

- Use direct public URLs on media elements.
- Preserve browser HTTP Range requests and cache behavior.
- Do not use `fetch -> Blob -> object URL`.
- Default inactive media to metadata-only or no source until needed.
- Prepare only the active and adjacent scene window.
- Scrub only the active clip on RAF.
- Park a previous/next clip at an endpoint only when required.
- Treat metadata and readiness per clip; one failed asset must not erase a
  working poster or placeholder.

Phase 02 has only one real video, so it must not manufacture four additional
requests merely to simulate the future window.

### Expansion target

The same asset resolver can later cap attached media at:

- desktop: previous, current, and next (maximum three);
- mobile: current and direction-adjacent (maximum two).

The loader boundary stays independent of timeline math. Replacing a placeholder
with an asset changes scene configuration and readiness state, not global
progress behavior.

## RAF lifecycle and performance

Scroll handlers record the latest target and request work; they do not perform
heavy media work synchronously. A RAF loop is useful only when all required
conditions are met:

```text
journey is near/in view
AND reduced motion is false
AND an active video has valid metadata
AND currentTime has not converged to targetTime
```

When convergence is reached, when the journey leaves the observed region, when
reduced motion becomes active, or when the component unmounts, pending RAF work
is cancelled. Observer, media, resize/orientation, and media-query listeners
are also removed on cleanup.

Continuous visual progress is written to the journey element's
`--loop-journey-progress` CSS custom property. Other continuous progress and
blend data stays in refs or scoped CSS properties. React state is reserved for
scene boundaries, media readiness, and throttled debug output; ordinary React
rendering is not required for every fractional scroll update.

## Reduced motion contract

The engine observes `matchMedia("(prefers-reduced-motion: reduce)")`, including
changes after mount.

When reduce is active:

- video current-time synchronization stops;
- pending RAF work is cancelled and not restarted by scrolling;
- crossfade/transition animation is removed;
- poster or placeholder is the primary visual;
- rail navigation uses immediate rather than smooth scrolling;
- debug output still reports the preference and stable scene values;
- no media or lifecycle error is emitted.

The engine can still select a discrete scene from section progress, provided
the presentation does not animate between states.

## Mobile contract

Phase 02 provides structural rather than final mobile design:

- sticky height uses `100svh`;
- controls and labels respect safe-area insets;
- video remains `object-fit: cover`;
- each scene can define desktop and mobile focal points;
- FIELD defaults to `center center` on desktop and approximately `35% center`
  on narrow viewports, subject to browser visual confirmation;
- orientation and viewport changes trigger geometry recalculation;
- the desktop rail is hidden or simplified on narrow screens;
- future media attachment is bounded to two clips on mobile.

No user-agent sniffing is required for these behaviors.

## Scene rail and accessibility

The Phase 02 rail is a diagnostic navigation aid. Each item identifies one of
the six scenes, exposes the current selection with `aria-current`, and maps its
action through journey-local geometry. Desktop pointer targets should not be
smaller than 44 by 44 CSS pixels, and keyboard focus must be visible.

The stage's visual changes should not be announced continuously through an
`aria-live` region. Hidden scene content must not leave interactive descendants
in the tab order. Placeholder wording stays factual, for example:

```text
02 / ORDER
SCENE PLACEHOLDER
```

No marketing claims or final brand prose are introduced in Phase 02.

## Debug contract

The removable debug panel reports actual runtime values:

```text
Journey Progress
Scene Index
Scene ID
Next Scene
Local Progress
Blend Progress
Target Time
Current Time
Duration
Active Video
Next Asset Type
Video Ready State
Reduced Motion
Journey In View
```

Diagnostics do not drive the engine. Removing or disabling the panel must not
change timeline, media, loading, or cleanup behavior.

## Adding future scene assets

Add assets one transition at a time. Do not predeclare paths before their files
exist.

1. Produce or approve the scene poster and transition clip outside the engine.
2. Place the actual poster under `public/images/scenes/` and the actual video
   under an agreed `public/video/` subdirectory. Keep the existing FIELD path
   unchanged unless a migration is intentional.
3. Inspect the video before configuration: dimensions, frame rate, duration,
   codec/profile, pixel format, audio tracks, fast-start layout, keyframe
   spacing, and seek behavior.
4. Prefer web-compatible H.264 with `yuv420p`, no unnecessary audio, fast-start,
   and a short scrub-friendly GOP. Supply a mobile rendition later through an
   explicit configuration field rather than user-agent-based URL rewriting.
5. Add the poster and `clipSrc` URL to exactly one scene record only after
   both public files exist.
6. Confirm the URL returns successfully with the correct media type and
   supports normal Range responses. Check that seeking does not trigger full
   repeated downloads.
7. Test its interval beginning, midpoint, blend start, boundary, and reverse
   path. Confirm a delayed or failed clip still resolves to its poster and then
   placeholder without black output.
8. Test reduced motion, narrow/portrait layout, orientation change, direct rail
   jump, memory attachment limits, and console cleanup before adding the next
   clip.

Replacing a placeholder must not require changes to `timeline.ts`.

## Phase 02 verification gates

Phase 02 is accepted only when all of the following are demonstrated:

- the six-scene and five-interval model is configured;
- pure timeline values and boundary cases are tested;
- FIELD reads its real duration and scrubs in both directions;
- ORDER through RETURN have deterministic placeholders;
- FIELD fades into the ORDER fallback without a black frame;
- forward and reverse traversal select every scene in the expected order;
- the sticky stage enters and releases between ordinary page sections;
- the debug panel reports real values without driving the runtime;
- reduced motion stops seeking, RAF, and animated transitions;
- resize/orientation and mobile focal behavior remain usable;
- no missing-file requests, React/hydration/media errors, RAF leaks, event
  leaks, state loops, or console spam occur;
- every repository-provided lint, typecheck, test, and build script succeeds;
- no reference expression or asset was copied.

These gates validate the engine skeleton only. Infinity Core, final scene
assets, brand copy, navigation, corporate content, advanced rendering, and
production deployment remain later-phase work.
