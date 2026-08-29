# Journey media asset contract

The production Journey is still-image-first. Every chapter owns one canonical
desktop WebP anchor:

```text
still/01-field.webp
still/02-order.webp
still/03-design.webp
still/04-build.webp
still/05-adopt.webp
still/06-return.webp
```

Optional compact variants add `-mobile` before `.webp`, for example
`still/01-field-mobile.webp`. When that nullable source is not configured, the
resolver intentionally reuses the desktop still. A missing configured source
resolves to a poster or a `null` placeholder; renderers must never request the
diagnostic contract path directly.

The active nullable `desktopStill` and `mobileStill` fields live in
`lib/scrollytelling/scene-config.ts`. `contractStillFile` records the approved
name, `overlayMode` selects the scene grammar, and the three focal-point fields
control desktop, tablet, and mobile crops.

## Optional future video compatibility

Five transition video contracts remain available, but they are not required by
the homepage Journey:

```text
video/01-field-to-order.mp4
video/02-order-to-design.mp4
video/03-design-to-build.mp4
video/04-build-to-adopt.mp4
video/05-adopt-to-return.mp4
```

Optional mobile video variants add `-mobile`. Do not move or overwrite
`public/video/field-v01.mp4`; it remains the verified Phase 01/02 legacy source,
not a still-mode dependency.

Posters remain a static fallback and use the transition stem in `poster/` with
`.webp`, `.avif`, `.jpg`, `.jpeg`, or `.png`.

Run `npm run asset:check` after every media change. The validator reports:

- `READY`: a configured primary still/poster is present and valid;
- `MISSING`: the required scene anchor is not configured yet;
- `OPTIONAL`: mobile overrides and future video sources.

Missing nullable sources are a valid pre-asset state. A configured URL that is
absent, duplicated, outside the contract directory, wrongly named, or not the
declared media container fails validation. `ffprobe` metadata checks apply only
to configured optional videos and are skipped when the executable is absent.

## Selected interaction layers

Phase 2 separated layers live under `layers/{scene}/` and are registered only
in `lib/scrollytelling/layer-config.ts`. These are deliberately a small audited
subset of the source archives. Do not copy all source PNGs into `public`, and do
not add people/background cutouts over a base that already contains them.

The validator checks every registered layer's canonical scene directory, unique
URL, existence, and WebP container signature. Unregistered files in a selected
layer directory fail validation.
