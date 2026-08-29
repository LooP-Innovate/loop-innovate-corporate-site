# L∞P Innovate Design System Foundation

## Status

This is the PRE-ASSET visual foundation for the still-first corporate site and
Static Cinematic Scrollytelling Journey. Runtime tokens exist, but final browser
calibration, scene copy, and RETURN infinity approval remain Pending.

## Brand direction

~~~text
FIELD LOOP
現場を、仕組みから変える。
~~~

The experience is quiet, premium, human-centered, intelligent, future-oriented,
real-world, architectural, and restrained. Build confidence with proportion,
legibility, material contrast, scene continuity, and whitespace rather than
decorative volume.

Do not invent claims, customers, outcomes, certifications, telemetry, case
studies, or production imagery.

## Token governance

- Use semantic custom properties from styles/tokens.css.
- Add a token only for a reusable decision.
- Keep page-scoped aliases mapped to shared foundations.
- Prefer semantic surface/text values over raw brand colors.
- Verify dark, light, hover, focus, disabled, reduced-motion, and responsive
  states after changing a foundation.
- Keep high-frequency Journey values in scoped scene custom properties, not in
  the global token namespace.

## Foundations

### Color and material

Primary anchors remain:

| Token | Role |
| --- | --- |
| --brand-cyan | Precise highlight, progress, optical edge |
| --brand-blue | Strong selected emphasis |
| --brand-cloud | Light neutral foundation |
| --surface-dark family | Cinematic Journey and dark site regions |
| --surface-light family | Reading-oriented corporate regions |
| --text and border semantic families | Surface-aware hierarchy |

Blue/cyan is an accent and optical material, not permission to flood every
surface. Low-opacity text must not sit on an uncontrolled still without a
contrast shade.

### Typography

- Use the Japanese-capable sans stack for body/UI.
- Reserve display type for a small number of Hero/Journey moments.
- Use mono only for indices, technical labels, and diagnostics.
- Keep Japanese line height, punctuation, and line length readable.
- Do not apply Latin tracking rules to Japanese sentences.
- Reduce display scale at Tablet/Compact before it collides with subjects, safe
  areas, rail, or viewport edges.

### Space, shape, and depth

Use the existing spacing, section, container, radius, border, shadow, and z-index
tokens. Preserve semantic grouping on Compact while removing desktop-only empty
height. Prefer alignment and surface contrast over nested cards, large shadows,
multiple translucent panels, and universal pills.

### Layout

- Keep Header, sections, Contact, route Heroes, and Footer on one aligned
  container contract.
- Allow the Journey still Stage to be full bleed.
- Preserve source order through responsive grid changes.
- Respect safe areas and the Wide/Desktop/Tablet/Compact/Narrow/short-landscape
  contract in responsive-strategy.md.

## Still-first Journey language

Still anchors are not passive posters. Code-driven layers create chapter change:

~~~text
base still
  -> atmosphere
  -> structural overlay
  -> restrained motion accent
  -> shade
  -> scene identity and controls
~~~

Use bounded scale drift, micro-parallax, opacity, blur-to-sharp staging, masks,
line emergence, and node/plane visibility. Use CSS and SVG first. Do not use
random state or an independent clock to determine narrative position.

## Scene overlay grammar

| Scene | Visual rule |
| --- | --- |
| FIELD | Protect the real-world still. Minimal atmosphere and almost no graphic overlay |
| ORDER | Sparse information paths, alignment lines, low-density nodes, directional order |
| DESIGN | Clearer grid, transparent architectural frames, planes, and measured geometry |
| BUILD | Organized route illumination and restrained activation; no sci-fi overload |
| ADOPT | Lower overlay density and return attention to people and environment |
| RETURN | Converging cyclic flow and the only allowed infinity emergence |

Every chapter needs a distinct grammar and compositional mood. Do not substitute
six versions of the same grid or a plain crossfade. Overlays remain abstract;
they cannot imply real measured data or a live system.

## Motion

Scroll-linked state comes from Timeline progress and reconstructs identically in
forward and reverse. Duration/easing tokens remain for ordinary UI feedback.
Continuous ambient motion is optional, nonessential, visibility-gated, and must
stop in reduced motion.

Prefer:

- transform and opacity;
- bounded blur or mask work after performance measurement;
- SVG line/shape state;
- scoped CSS variables;
- discrete React scene state.

Do not add GSAP, Three.js, WebGL, or particle engines for polish. Do not keep
will-change on large inactive layers.

## RETURN-only Infinity contract

An infinity may exist only in RETURN. A compliant form has:

- one perfectly horizontal silhouette;
- one interwoven ribbon;
- two fully closed, uncropped elliptical loops;
- a natural front/back crossing;
- restrained blue-to-cyan optical light.

Reject a sphere, center ring, capsule, bar, mechanical core, broken/cropped loop,
vertical mark, earlier-scene infinity, neon overload, or cyberpunk bloom.

A quiet circulation state or empty integration slot is better than a malformed
provisional infinity. The final formation remains subject to user approval. It
is decorative and may become a static completed mark or disappear in reduced
motion without losing RETURN meaning.

## Still asset treatment

- Keep essential text and claims out of scene bitmaps.
- Use one canonical still per scene, plus a mobile crop only when measured crop
  requires it.
- Apply Desktop, Tablet, and Mobile focal tiers consistently to still and
  compatibility poster.
- Keep a truthful labelled placeholder beneath every scene until its real still
  is ready.
- Do not present random stock or an unapproved generated substitute as real.
- Preserve color grade and world continuity while allowing overlay grammar to
  make chapters distinct.

## Corporate component language

- Navigation: quiet, high-contrast, clear current state.
- Journey: full-viewport still Stage, minimal text, precise chapter progress.
- Journey exit: intentional visual release into normal reading flow.
- Corporate sections: editorial grids and structured rows, not a card wall.
- Services/process: relationships and sequence over decoration.
- Case studies/proof: explicit empty state until verified evidence exists.

## Reduced motion design

Reduced motion uses static stills and readable chapter identity. Remove:

- parallax and drift;
- blur/mask travel;
- line drawing and node emergence animation;
- crossfade animation and smooth rail jumps;
- continuous atmospheric or infinity loops;
- optional Journey video.

Do not reduce contrast, remove scene order, or show a half-formed RETURN symbol.

## Anti-patterns

Reject generic SaaS dashboards, cheap gradients, cyberpunk styling, neon/bloom
overload, random glowing blobs, excessive glassmorphism, fake AI decoration,
giant type without hierarchy, undifferentiated still crossfades, fake telemetry,
and decorative motion competing with the FIELD LOOP story.

## Acceptance

Automated/source checks are not visual PASS. Browser evidence must confirm:

- coherent chapter separation and crop at the responsive matrix;
- readable Japanese type and stable container rhythm;
- no overflow, black gaps, or uncontrolled image loading;
- visible focus and adequate contrast on every scene;
- complete reduced-motion static presentation;
- RETURN-only infinity compliance;
- no invented asset, copy, or proof.

Current still-first visual acceptance remains Pending.
