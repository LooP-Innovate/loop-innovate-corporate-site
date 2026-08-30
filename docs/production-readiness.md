# Production readiness inventory

## SEO and identity

| Item | Current state |
| --- | --- |
| Title / description | Implemented per route |
| Canonical | Emitted only when `NEXT_PUBLIC_SITE_URL` is valid |
| Robots | `noindex, nofollow` unless HTTPS URL + indexing flag + contact-ready flag all pass |
| Sitemap | Empty unless the same gate passes |
| Favicon | Code-native infinity mark implemented in `app/icon.tsx` |
| OGP | Dedicated dark navy / pale blue image implemented in `app/opengraph-image.tsx` |
| Schema | Minimal Organization JSON-LD; no invented address or phone |
| Tokushoho | Source retained; public route/link/sitemap withheld until confirmed facts are complete and `publicationApproval` is explicitly approved |

Development and production values remain separated in `.env.example`. Never commit a real destination address or secret to a `NEXT_PUBLIC_` variable.

## Asset audit

`public/` currently totals approximately 9.94 MiB. The largest files are:

- legacy FIELD MP4: 4.63 MiB
- RETURN still: 1.71 MiB
- RETURN star layer: 0.54 MiB

Production Journey is still-first and does not import the legacy MP4. The MP4 remains only as a documented reference/experiment source and should be excluded from a final WordPress production package unless the video mode is deliberately restored.

Journey stills and layers are WebP. Base stills declare responsive `sizes`; non-initial layers are lazy, while the initial FIELD still is preloaded. RETURN and transparent overlay assets remain unoptimized to preserve current visual behavior; AVIF/responsive re-encoding is a measured P1 optimization after visual regression testing, not a pre-migration guess.

## Unresolved external facts

- verified public contact address and form delivery
- Tokushoho address, phone, public email, payment, cancellation, recurring terms and payment-provider conditions
- legal determination of whether the Tokushoho page is required before online sales/settlement begins

These values must come from the operator/legal review. They are never inferred by code.
