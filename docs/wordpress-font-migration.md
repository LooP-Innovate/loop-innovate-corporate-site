# WordPress Font Migration Note

The reference build uses `next/font/google` with Inter and Noto Sans JP. WordPress
does not provide the `next/font` build pipeline, so the theme must self-host and
reconstruct its output rather than switching font providers or families.

## Current reference

| Property | Inter | Noto Sans JP |
| --- | --- | --- |
| Style | normal | normal |
| Weight | variable 100–900 | variable 100–900 |
| Display | `swap` | `swap` |
| Requested Next subset | `latin` | `latin` |
| Fallback | Arial-adjusted `Inter Fallback` | Arial-adjusted `Noto Sans JP Fallback` |
| Fallback ascent | 90.44% | 110.73% |
| Fallback descent | 22.52% | 27.49% |
| Fallback line gap | 0% | 0% |
| Fallback size adjust | 107.12% | 104.76% |

`subsets: ["latin"]` is intentionally unchanged. In Next Font it controls the
preloaded subset; it does not remove Japanese glyph coverage from Noto Sans JP.

The production CSS contains 133 `@font-face` declarations:

- Inter: 7 unicode-range sources plus 1 fallback declaration;
- Noto Sans JP: 124 unicode-range sources plus 1 fallback declaration.

The current HTML preloads one Latin WOFF2 source per family. Build filenames are
content-hashed and may change; they are identifiers for this reference build, not
stable WordPress URLs.

## Extracted reference

`docs/wordpress-font-face-reference.css` contains the exact `@font-face` and
`unicode-range` declarations extracted from the production build. Regenerate after
a reference build with:

```bash
node scripts/extract-font-face-reference.mjs
```

This CSS is migration input, not a drop-in public stylesheet. Its `../media/` URLs
must be mapped to copied, same-origin theme assets.

## WordPress implementation contract

1. Copy every WOFF2 file referenced by the accepted CSS into a versioned theme
   font directory. Verify redistribution terms before publishing.
2. Preserve family names, variable weight range, normal style, `font-display: swap`
   and every `unicode-range` value.
3. Rewrite only the URL prefix; do not merge ranges or silently fall back to a
   remote Google Fonts request.
4. Preload only the two Latin subset files used above the fold, with
   `as="font"`, correct `type`, and `crossorigin` where required.
5. Preserve the fallback metric overrides to avoid layout shift.
6. Serve fonts over the production HTTPS origin with immutable, fingerprinted
   caching and correct `font/woff2` MIME type.
7. Keep the CSS variable/fallback order:
   Inter → Noto Sans JP → Yu Gothic → Meiryo → sans-serif.

## Acceptance checks

- No network request to a third-party font host.
- Japanese headings, body copy and legal pages render without missing glyphs.
- Font weights 100–900 render consistently with the reference screenshots.
- Preload does not download the full Japanese range at initial load.
- CLS and line wrapping match the Next.js reference at all four QA viewports.
- Browser console and Network panels show no CORS, MIME or failed font request.
