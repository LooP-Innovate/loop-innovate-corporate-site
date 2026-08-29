# Accessibility Contract

## Scope

Accessibility is part of the still-first architecture, not a final polish pass.
Apply this contract to the Journey, scene stills and overlays, RETURN infinity,
navigation, corporate content, disclosures, Debug, and any future optional
video.

## Semantic structure

- Keep one page-level main landmark.
- Use header, labelled nav, ordered headings, meaningful section/article, and
  footer according to content.
- Give the Journey an accessible heading/label and preserve the semantic order
  FIELD, ORDER, DESIGN, BUILD, ADOPT, RETURN.
- Keep DOM, reading, and keyboard order aligned.
- Use links for navigation and buttons for actions.
- Keep normal corporate content available after the sticky Journey releases.

## Keyboard and focus

- Make navigation, visible rail controls, disclosures, CTAs, and future forms
  usable without a pointer.
- Preserve visible focus using the focus token on dark, light, still, and
  placeholder surfaces.
- Keep compact interaction targets at least 44 by 44 CSS pixels.
- Keep focus out of hidden scene layers, decorative overlays, and closed
  disclosures.
- Ensure the mobile menu and Debug disclosure remain scrollable/reachable in
  short landscape.
- Define Escape, focus return, and cleanup when a custom disclosure/dialog ever
  replaces native semantics.

## Journey semantics

- Adjacent scene identity and text carry meaning.
- Treat base stills, atmosphere, masks, paths, grids, nodes, motion accents, and
  RETURN infinity as decorative when they repeat that meaning.
- Decorative img uses empty alt; CSS backgrounds/SVG/canvas stay out of the
  accessibility tree and tab order.
- Use aria-current for the active visible rail step.
- Do not announce continuous progress, blend, parallax, overlay density, or
  formation values through aria-live.
- Rail jumps use the same section-relative geometry and must not trap the user
  inside the sticky track.
- Provide an ordered static scene summary when enhanced visuals or JavaScript
  are unavailable.

Meaningful editorial images outside the decorative Journey contract require alt
text that communicates their purpose without describing irrelevant appearance.

## Reduced motion

Observe prefers-reduced-motion, including changes after mount. Reduced mode is a
complete alternate presentation:

- render static stills or truthful placeholders;
- remove drift, parallax, animated scale, blur, masks, line drawing, node
  emergence, crossfade motion, smooth scrolling, and decorative loops;
- do not load optional Journey video;
- present RETURN with a static compliant infinity or omit the decoration;
- keep scene identity, order, current state, rail semantics where visible,
  Journey exit, and corporate content;
- keep Debug facts accurate without errors or animation.

Do not freeze halfway through a mask, blur, line draw, or infinity formation.

## Color and visual readability

- Meet contrast requirements for text, controls, focus, icons, and meaningful
  boundaries against every still and placeholder.
- Test overlays against the actual still crop at all responsive tiers.
- Do not communicate current/ready/missing/optional state through color alone.
- Preserve 200% zoom and narrow reflow without horizontal scrolling.
- Keep Japanese text readable and avoid low-opacity thin copy on detailed image
  regions.
- Decorative blur/mask effects must never reduce text legibility.

## Assets and failures

- Do not put essential text, labels, claims, or instructions inside a still,
  overlay, or infinity.
- A missing/failed still retains scene identity and a truthful placeholder.
- Do not emit repeated nonexistent requests that create noisy or unstable
  fallback.
- Avoid layout shift by providing stable scene geometry while images decode.
- If future video is enabled, keep it muted, decorative, free of essential
  meaning, and backed by the same still. Do not autoplay audio.

## Progressive enhancement

The initial document must communicate site identity, Journey order, and major
corporate sections before images or client enhancements are ready. Blocked
images, CSS masks, SVG failure, a delayed bundle, or reduced motion must not
produce a blank or meaningless Hero.

Use configuration-driven scene labels and semantic corporate content as the
durable layer. Treat still composition, structural overlays, formation, and
optional video as progressive enhancement.

## RETURN infinity

The infinity is decorative and exists only in RETURN. Hide SVG/canvas internals
from assistive technology unless a future approved interaction gives them a
semantic role. Do not expose path points or continuous formation progress.

The accessible RETURN label/text must explain the chapter without requiring the
symbol. No inaccessible malformed symbol should be shown merely to satisfy a
visual slot.

## Navigation and corporate content

- Preserve the focus-revealed 本文へ移動 skip link.
- Preserve native details/summary semantics for compact navigation and Debug
  unless a replacement provides an equal or stronger contract.
- Give the current route a programmatic state without removing its name.
- Maintain heading hierarchy and source order through responsive layouts.
- Label future fields explicitly, connect errors to inputs, and announce
  submission results appropriately.
- Keep legal/security/privacy/AI-policy links understandable without icon-only
  naming.

## Debug surfaces

Debug is development tooling. It is collapsed by default, viewport-bounded, and
internally scrollable when enabled. Its summary is a real control with visible
focus. Normal production renders no Debug unless an explicit safe flag enables
it.

Static diagnostics should report scene, still, overlayMode, progress, motion,
visibility, and asset status. Do not show or announce video metrics unless an
explicit video mode is active. Debug output observes runtime state and cannot be
the only semantic source of chapter identity.

## Verification

Final accessibility status remains Pending until manual/browser evidence covers:

- complete keyboard traversal and reverse traversal;
- visible focus on all surfaces;
- landmark, heading, reading-order, control-name, and aria-current audit;
- native navigation and Debug disclosure behavior;
- 44px targets and short-landscape reachability;
- 200% zoom and narrow reflow;
- representative contrast over each real still;
- reduced-motion load, state, and zero optional-video-request behavior;
- missing/slow still fallback and layout stability;
- representative screen-reader output;
- automated checks followed by manual review.

Record results in pre-asset-checklist.md. Automated success alone is not PASS.
