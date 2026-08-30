# Case Study Publication Guard

The migration must retain the current disclosure-first behavior and strengthen the
metric verification model. WordPress must never let an editor publish an unverified
number merely because the post itself is `publish`.

## Current Next.js contract

`isCaseStudyPublishable()` currently requires:

```text
publishStatus = "published"
AND clientDisclosurePermission != "pending"
AND every metric has non-empty label, value and source
```

Disclosure permission is `anonymous-approved`, `named-approved` or `pending`.
The current featured record is anonymous-approved and has no numeric metrics.
That is valid: a truthful anonymous narrative does not need a fabricated number.
If the record fails the predicate, the Case Study content is omitted and only the
publication policy is shown.

Current limitations to address during migration:

- no independent case-level `publication_approval` field;
- no per-metric `verified` or per-metric approval field;
- no stored reference to disclosure evidence;
- placeholder and customer-internal-data rejection are not structural;
- a named permission audit trail is not represented.

## WordPress CPT model

### Case Study fields

| Field | Type | Rule |
| --- | --- | --- |
| Core status | WordPress post status | Must be `publish` |
| Publication approval | restricted boolean | Must be true |
| Disclosure permission | enum | `pending`, `anonymous-approved`, `named-approved` |
| Identity mode | enum | `anonymous`, `named` and consistent with permission |
| Disclosure evidence reference | protected reference | Required for approval; never rendered publicly |
| Customer-information review | restricted boolean | Must pass |
| Placeholder review | restricted boolean | Must pass |
| Approval audit | user ID + timestamp + revision | Required and immutable in public revision |

### Metric repeater

| Field | Type | Rule |
| --- | --- | --- |
| Label | bounded plain text | Required |
| Value | bounded plain text/number | Required; unit explicit |
| Source | protected or publishable citation | Required |
| Verified | restricted boolean | Must be true to render |
| Publication approval | restricted boolean | Must be true to render |
| Verification note | protected text | Optional; never rendered directly |

## Public predicate

```text
CASE_STUDY_READY =
  post_status = publish
  AND publication_approval = true
  AND disclosure_permission IN (anonymous-approved, named-approved)
  AND identity_mode matches permission
  AND disclosure/customer-information review passed
  AND placeholder review passed
  AND every displayed metric is complete, verified and approved
```

Zero metrics are permitted. If any configured metric is unverified or unapproved,
the safest default is to return the entire case to review. At minimum, the metric
must be excluded from all public output and must not leak through REST or metadata.

## Protected information rules

- Never place customer names, internal IDs, raw evidence, private source documents,
  contacts or internal URLs in public post meta.
- Anonymous cases must be reviewed for indirect identification through location,
  dates, rare job titles, screenshots, filenames and combinations of facts.
- Named publication requires explicit, recorded permission for the exact revision.
- Reject sample, placeholder, `TBD`, unverifiable claims and unsupported percentages.
- Metrics must state units and measurement scope; decorative numbers are forbidden.

## Enforcement surfaces

Use the same predicate for:

- archive and front-page queries;
- single route and preview/public distinction;
- related content and navigation;
- WordPress search and feeds;
- REST API and GraphQL if enabled;
- XML sitemap, Open Graph and JSON-LD;
- image attachments and downloadable material.

An unready direct route returns 404 to unauthenticated users. Editors may use a
nonce-protected preview that sends `no-store` and `noindex` and is not shareable as
a public URL.

## Required tests

- pending disclosure is excluded everywhere;
- anonymous-approved zero-metric case can publish;
- named case without matching evidence cannot publish;
- one unverified metric revokes readiness or is consistently excluded;
- empty label/value/source fails;
- dummy or customer-internal data fails;
- REST, sitemap, search, feed and direct route match the archive predicate;
- a post edit after approval invalidates the previous approval revision.
