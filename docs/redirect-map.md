# Redirect Map — Initial WordPress Draft

The current public route inventory is `/` plus the 13 entries in
`SITE_ROUTE_SLUGS`. WordPress should preserve these canonical paths. A row with
status `200` is a route-preservation entry, not a redirect.

| Old URL | New URL | HTTP status | Reason | WordPress target | Notes |
| --- | --- | ---: | --- | --- | --- |
| `/` | `/` | 200 | Canonical top page | Front Page template | No redirect |
| `/about` | `/about` | 200 | Preserve public route | Page template: About | No redirect |
| `/services` | `/services` | 200 | Preserve public route | Page template: Services | No redirect |
| `/ai-fde` | `/ai-fde` | 200 | Preserve public route | Page template: AI-FDE | No redirect |
| `/pricing` | `/pricing` | 200 | Preserve public route | Page template: Pricing | No redirect |
| `/case-studies` | `/case-studies` | 200 | Preserve public route | Case Study archive or fixed page | Apply publication guard |
| `/faq` | `/faq` | 200 | Preserve public route | Page template: FAQ | No redirect |
| `/contact` | `/contact` | 200 | Preserve public route | Contact template | Indexing remains gated by Contact readiness |
| `/security` | `/security` | 200 | Preserve trust route | Page template: Security | No redirect |
| `/ai-policy` | `/ai-policy` | 200 | Preserve trust route | Page template: AI Policy | No redirect |
| `/privacy-policy` | `/privacy-policy` | 200 | Preserve legal route | Privacy Policy page | No redirect |
| `/terms` | `/terms` | 200 | Preserve legal route | Terms page | Canonical target for legacy URL |
| `/legal` | `/legal` | 200 | Preserve legal hub | Legal Hub page | Guard child links independently |
| `/tokushoho` | `/tokushoho` | 200 or 404 | Preserve guarded route | Tokushoho template | 404 until publication guard is ready |
| `/terms-of-service` | `/terms` | 301 | Existing legacy permanent redirect | Terms page | Explicit 301 in `next.config.ts` |

## Rules

- Permanent URL changes use HTTP 301.
- Do not introduce wildcard redirects, aliases or unnecessary chains.
- `/journey-debug` is an internal, default-off diagnostic path. It is not a public
  WordPress route and receives no redirect; requests should remain 404.
- Let the hosting stack normalize only the agreed trailing-slash policy. Do not
  create two indexable forms of the same URL.
- Redirect destinations must be relative or validated production HTTPS URLs; never
  accept editor-provided arbitrary external targets.
- Re-test status, `Location`, canonical and sitemap after the WordPress permalink
  configuration is frozen.
