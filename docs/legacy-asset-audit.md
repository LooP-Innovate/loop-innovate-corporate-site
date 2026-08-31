# Legacy and unused public asset audit

Audit scope: all files under `public/`, with full searches across routes, components, Journey configuration, docs, tests, debug code, and fallbacks. No asset was deleted unless all references and contract dependencies were zero.

| Asset | Size | Referenced by | Production used | Decision | Reason |
|---|---:|---|:---:|---|---|
| `brand/loop-combination-full-color.png` | 11.2 KB | header/footer/metadata | Yes | Keep | Official light-surface and schema logo |
| `brand/loop-combination-white.png` | 2.4 KB | dark header/footer | Yes | Keep | Official dark-surface logo |
| `media/corporate/ai-fde-definition-wide.webp` | 51.3 KB | `RoutePage` | Yes | Keep | AI-FDE route background |
| `media/corporate/field-loop-fields-wide.webp` | 18.8 KB | `HomeSections` | Yes | Keep | FIELD LOOP section background |
| `media/corporate/founder-koichi-mikami.webp` | 91.0 KB | About profile | Yes | Keep | Approved profile asset |
| `media/journey/still/01-field.webp` | 138.1 KB | scene config/resolver/renderer | Yes | Keep | FIELD base still |
| `media/journey/still/02-order.webp` | 144.4 KB | scene config/resolver/renderer | Yes | Keep | ORDER base still |
| `media/journey/still/03-design.webp` | 208.1 KB | scene config/resolver/renderer | Yes | Keep | DESIGN base still |
| `media/journey/still/04-build.webp` | 284.5 KB | scene config/resolver/renderer | Yes | Keep | BUILD base still |
| `media/journey/still/05-adopt.webp` | 107.8 KB | scene config/resolver/renderer | Yes | Keep | ADOPT base still |
| `media/journey/still/06-return.webp` | 1,797.5 KB | scene config/resolver/renderer | Yes | Keep | RETURN source; delivery is optimized at runtime |
| `media/journey/layers/field/*` | 23.2 KB | layer config/renderer | Yes | Keep | FIELD mist layer |
| `media/journey/layers/order/*` | 158.7 KB | layer config/renderer | Yes | Keep | Four ORDER layers |
| `media/journey/layers/design/*` | 271.6 KB | layer config/renderer | Yes | Keep | Four DESIGN layers |
| `media/journey/layers/build/*` | 709.2 KB | layer config/renderer | Yes | Keep | Three BUILD layers |
| `media/journey/layers/adopt/*` | 111.2 KB | layer config/renderer | Yes | Keep | Three ADOPT layers |
| `media/journey/layers/return/*` | 1,403.6 KB | layer config/renderer | Yes | Keep | Five RETURN sources; q90 delivery at runtime |
| `media/journey/transition/return-exit/*` | 28.8 KB | `DotDitherTransition`, return asset config/tests | Yes | Keep | RETURN-to-white transition |
| `media/journey/README.md` | 2.6 KB | documentation | No runtime fetch | Keep | Asset contract and provenance |
| `media/journey/poster/.gitkeep` | 1 B | asset contract | No | Keep | Preserves optional poster contract directory |
| `media/journey/video/.gitkeep` | 1 B | asset contract | No | Keep | Preserves optional future clip directory |
| `video/field-v01.mp4` | 4,858.2 KB | `SCENES.desktopVideo`, asset resolver, validator, tests, `ScrollVideoLab`, historical docs | Not fetched by current still renderer | Keep for Phase 0 | It is not route-rendered today, but reference count is not zero and it remains the configured FIELD video/fallback contract. Remove only after the WordPress Journey manifest and tests stop referencing it. |
| `video/README.md` | 0.4 KB | documentation | No runtime fetch | Keep | Describes the retained legacy source |

## `field-v01.mp4` conclusion

`ScrollVideoLab.tsx` itself has no production route import, but the MP4 is not referenced only by that experiment: `lib/scrollytelling/scene-config.ts` still exposes it as `desktopVideo`, the resolver and validator consume that contract, and tests assert it. The current `JourneyStill` renderer does not request it, confirmed by the browser inventory (`video: 0`). Therefore it adds repository/public-folder weight but zero current page transfer. Deleting it in Phase 0 would require changing the Journey source contract, so it is retained and explicitly marked as a WordPress migration cleanup candidate.

## Removed

None. The zero-reference safety condition was not met for the only large legacy candidate.

## Final WordPress migration decision

**Decision: B — clean the legacy Next.js dependency and safely delete the asset;
do not migrate it to WordPress.**

`field-v01.mp4` is not part of the WordPress asset manifest. The production home
page uses the six-still renderer; neither `ScrollVideoLab` nor
`resolveJourneyAsset` is imported by a production route, `useJourneyEngine`
selects the still renderer, and the measured Journey video transfer is zero.
The remaining scene-config, validator and test references are residual Phase
01/02 proof-of-concept contracts, not production-architecture requirements.

Deletion must be performed as a coordinated cleanup on the Phase 1 working line,
not as an isolated file removal from the immutable reference:

1. Set the FIELD `desktopVideo` contract to `null` and remove the concrete legacy
   path constant.
2. Remove or convert real-file assertions to synthetic resolver fixtures while
   retaining the nullable future-video schema if still useful.
3. Remove the unimported `components/experiments/scroll-video/` implementation.
4. Confirm zero production and contract references, then remove
   `public/video/field-v01.mp4` and its legacy README.
5. Re-run validation, tests, build and smoke checks.

The asset is therefore excluded from WordPress migration. The existing
`v3.0-reference` annotated tag and Git history preserve it for historical visual
comparison, so the migration does not lose the original source reference.
