# Publication Guard Specification

This document translates the current TypeScript publication gates into a
language-independent, fail-closed contract for WordPress/PHP. Missing settings,
invalid values and caught exceptions always resolve to **not ready**.

## 1. Global indexing guard

```text
INDEXING_READY =
  PUBLIC_PRODUCTION_HTTPS_URL_VALID
  AND CONTACT_READY
  AND EXPLICIT_INDEXING_APPROVAL
```

### Valid production URL

The URL must parse, use HTTPS, contain no username/password and must not target:

- `localhost`, `.localhost`, `.local` or `.internal`;
- IPv4 loopback, private, link-local or CGNAT ranges;
- IPv6 loopback, unique-local or link-local ranges.

### Contact readiness

`CONTACT_READY` may become true only after all of the following are verified:

- a public contact route and working form exist;
- the delivery destination is configured and tested;
- privacy consent is shown and recorded appropriately;
- validation, success and error states are complete;
- SMTP delivery and expected notification/automatic reply are tested;
- nonce/CSRF validation and spam controls are active;
- logs and error messages do not expose submitted PII.

### Output matrix

| Output | INDEXING_READY = true | INDEXING_READY = false |
| --- | --- | --- |
| Meta robots | `index, follow` | `noindex, nofollow, nocache` |
| `robots.txt` | Allow `/`; advertise sitemap | Disallow `/`; do not advertise a public sitemap |
| XML sitemap | Root and guarded public routes | Empty or disabled |
| Canonical | Valid production HTTPS canonical | Do not output |
| URL-bearing Organization JSON-LD | Output | Do not output |

The root and route canonical metadata are now gated by the same
`isIndexingEnabled()` condition in the reference implementation. WordPress must
apply one shared function to `<head>`, robots, sitemap and structured data so that
no output path can bypass the guard.

## 2. Contact approval state

Store explicit administrative booleans separately from inferred technical state:

```text
CONTACT_TECHNICALLY_READY
CONTACT_PUBLICATION_APPROVAL
CONTACT_READY = both true
```

Only a restricted administrator role may approve publication. Record approver,
timestamp and the configuration revision tested. Changing the recipient, SMTP
transport, form schema, privacy notice or spam control invalidates technical
readiness until re-tested.

## 3. Tokushoho guard

```text
TOKUSHOHO_READY =
  ADDRESS_COMPLETE_AND_VERIFIED
  AND PHONE_COMPLETE_AND_VERIFIED
  AND PUBLIC_EMAIL_COMPLETE_AND_VERIFIED
  AND PAYMENT_CONDITIONS_COMPLETE_AND_VERIFIED
  AND CANCELLATION_TERMS_COMPLETE_AND_VERIFIED
  AND RECURRING_CONDITIONS_COMPLETE_WHEN_APPLICABLE
  AND CARD_PAYMENT_CONDITIONS_COMPLETE_WHEN_APPLICABLE
  AND OPERATOR_IDENTITY_VERIFIED
  AND NO_PLACEHOLDER_OR_DUMMY_VALUE
  AND PUBLICATION_APPROVAL
```

Use structured fields and verification flags rather than a single free-text regex.
Reject null, empty, whitespace-only, sample, dummy, pending, TBD, example domains,
synthetic phone values and text that embeds such placeholders. Record editor,
approver and approval timestamp.

When false:

- the route is not registered as public or resolves to 404 on direct access;
- its Footer and Legal Hub links are hidden;
- it is absent from sitemap, search, feed and REST responses;
- it is never canonicalized or redirected to a misleading substitute.

### Current TypeScript behavior

The reference currently requires approval plus seven non-empty commerce fields,
email shape, a phone with at least nine digits, minimum trimmed lengths and exact
sentinel rejection. It correctly hides the route/link/sitemap while pending, but
its placeholder detector is intentionally less strict than the WordPress target.
The migration must implement the structured target above, not copy only the current
regex behavior.

## 4. Case Study guard

The same fail-closed principle applies to Case Studies. A post must be approved,
have approved anonymous or named disclosure permission, contain no customer-internal
or dummy data, and expose only independently verified and approved metrics. Apply
the same predicate to archive queries, single routes, related-content queries,
search, feed, REST and sitemap. The complete schema is defined in
`docs/case-study-publication-guard.md`.

## 5. WordPress implementation boundary

- Put predicates in a small version-controlled theme/plugin module, not in page
  builder conditions.
- Register settings with strict schema, capability checks and escaped output.
- Use one predicate per guard and call it from every publication surface.
- Keep default values false; deployment environment values cannot silently approve
  editorial publication.
- Add PHPUnit truth tables and integration tests for route status, head output,
  robots, sitemap, REST and queries.
- Log state transitions without logging protected form data or customer content.

## 6. Acceptance scenarios

1. Valid URL but Contact false: noindex, no canonical, no sitemap.
2. Contact true but explicit approval false: same fail-closed result.
3. All three indexing conditions true: index/follow, canonical and sitemap enabled.
4. Any invalid/private/local URL: fail closed even if both booleans are true.
5. Tokushoho missing one verified fact: direct access 404 and no link in any surface.
6. A dummy commerce value or unapproved edit: readiness is revoked.
7. A pending Case Study or unverified metric: no public output path reveals it.
