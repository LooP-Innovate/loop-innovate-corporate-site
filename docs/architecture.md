# L∞P Innovate Website v3 Architecture

## Current milestone

The project is evolving the PRE-ASSET/Phase 02 foundation into a production-
oriented, video-free Static Cinematic Scrollytelling mode. Six approved still
anchors are the primary Journey assets. Code-driven overlays and deterministic
scroll state provide motion; five generated transition videos are no longer a
delivery prerequisite.

This change preserves the real corporate site, responsive foundation,
accessibility, SEO routes, pure Timeline, and isolated Phase 01 regression lab.
It does not authorize production deployment or fabricated imagery, copy, proof,
pricing, or policy claims.

## Engineering priorities

~~~text
Correctness -> Determinism -> Accessibility -> Performance
  -> Maintainability -> Visual polish
~~~

## System map

~~~text
Next.js application
  -> root metadata and semantic routes
  -> fixed responsive navigation
  -> FIELD LOOP Journey
     -> section-local geometry and pure Timeline
     -> still resolver and truthful placeholder
     -> layered scene overlays and RETURN-only infinity
     -> scene readout, progress, responsive rail, gated Debug
  -> Journey exit
  -> corporate sections, contact, footer

Foundations
  -> design tokens and responsive tiers
  -> accessibility and reduced-motion contract
  -> scene/asset validation and unit tests
  -> project-local design and engineering Skills
~~~

## Ownership

### Application and corporate flow

app owns routes, layout, metadata, and page landmarks. components/site owns
navigation, footer, the home corporate flow, and reusable route composition.
lib/site owns authored navigation and development-safe content status.

The home order remains:

~~~text
skip link -> navigation -> FIELD LOOP Journey -> RETURN release
  -> Positioning -> What We Do -> Services -> AI/DX Approach
  -> Selected Work missing state -> Process -> Pricing -> FAQ
  -> Contact -> Footer
~~~

### Journey view

components/scrollytelling owns the sticky Stage, still/fallback layers,
scene-specific overlay rendering, controls, and diagnostics. The component tree
may be rationalized, but conceptual ownership remains:

- Stage: current/destination still and fallback composition;
- scene visual layer: atmosphere, structure, motion accents;
- overlay UI: scene identity, progress, responsive rail;
- engine: geometry, Timeline, preference, and bounded runtime state;
- Debug: observed static diagnostics only.

### Journey library

lib/scrollytelling owns framework-light contracts:

- type-safe scene IDs, still fields, overlayMode, focal tiers, and status;
- one authored scene configuration and derived manifests;
- pure global-to-scene Timeline;
- still-first resolver with placeholder safety;
- pure overlay state when practical.

Adding an approved still changes configuration, not Timeline mathematics or a
scene-specific React branch.

### Historical video surfaces

components/experiments/scroll-video remains the isolated Phase 01 regression
lab. Existing video resolver/scrubbing code may remain for compatibility or a
future explicit mode, but the normal homepage cannot depend on duration,
metadata, currentTime, Range behavior, or a video seek RAF.

## Static asset boundary

Canonical Journey stills live under:

~~~text
public/media/journey/still/
  01-field.webp
  02-order.webp
  03-design.webp
  04-build.webp
  05-adopt.webp
  06-return.webp
~~~

Optional mobile crops append -mobile. Missing assets are null and resolve to a
truthful placeholder without a network request. The existing FIELD MP4 remains
an approved extraction source and historical proof asset; the homepage uses the
derived 01-field.webp.

The validator reports READY, MISSING, and OPTIONAL. It fails unsafe configured
paths or invalid files/configuration, but does not fail solely because future
videos are absent. See journey-asset-spec.md.

## Journey data flow

~~~text
section geometry
  -> normalized Journey progress
  -> scene index, next index, local progress, blend progress
  -> resolved current/destination still
  -> scene overlayMode
  -> CSS/SVG visual variables
  -> scene readout, rail, Debug
~~~

The sticky track remains derived from six anchors and five intervals. High-
frequency progress stays outside ordinary React rendering. Static image readiness
controls only fallback visibility, never narrative timing.

## Visual architecture

Every chapter layers a base still, atmosphere, structural overlay, motion accent,
shade, copy, controls, and Debug. FIELD remains visually quiet; ORDER introduces
paths; DESIGN introduces grids and geometry; BUILD activates routes; ADOPT lowers
graphic intensity; RETURN converges into circulation.

Only RETURN may host a horizontal closed-loop infinity. It must be a single
interwoven, uncropped blue-to-cyan ribbon with no sphere, ring, capsule, bar, or
mechanical core. Omit it when a compliant rendering is not ready.

## Responsive and accessibility architecture

Preserve the established Wide/Desktop/Tablet/Compact/Narrow/short-landscape
contract, safe areas, 100svh Stage, disclosure navigation, compact rail, and
orientation progress. Desktop, tablet, and mobile focal positions apply to
stills and compatibility fallbacks.

Decorative stills, SVG/CSS overlays, and infinity remain outside the tab order
and accessibility tree. Adjacent scene labels carry meaning. Reduced motion
renders static still chapters with no drift, parallax, mask travel, line drawing,
continuous loop, smooth rail jump, or optional video request.

## Debug and production behavior

Normal static diagnostics show still, overlay, scene, progress, preference,
visibility, and asset status. Video metrics appear only in an explicitly active
optional video mode. Debug is a collapsed, bounded development surface and must
not drive runtime behavior.

Production indexing, canonical origin, deployment, analytics, and migration
remain separate approvals. The existing production L∞P site is untouched.

## Quality gates

Before declaring the video-free switch ready, record:

- Timeline, scene-config, overlay, and still-resolver tests;
- validator, lint, typecheck, and production build results;
- six-scene forward/reverse and rail behavior;
- missing-still behavior with no 404 spam;
- responsive crop and overflow at the established matrix;
- reduced-motion static completeness and zero Journey video requests;
- keyboard, focus, headings, and screen-reader checks;
- Console, Network, image decode, RAF, and performance inspection;
- corporate-flow and Journey-exit regression.

All final still-first results remain Pending until entered in
pre-asset-checklist.md.

## Documentation map

- static-scrollytelling-mode.md: still-first runtime and visual contract
- journey-architecture.md: Journey ownership and invariants
- journey-asset-spec.md: still paths, validation, and integration
- responsive-strategy.md: viewport and focal tiers
- design-system.md: brand and overlay language
- accessibility.md: semantics and reduced motion
- pre-asset-checklist.md: evidence and remaining work
- phase-02-scene-engine.md: historical video-driven engine record
- roadmap.md: production sequence
